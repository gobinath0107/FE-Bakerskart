import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { useNavigate } from "react-router-dom";

const AdminOrderCreate = () => {
  const navigate = useNavigate();
  const [userQuery, setUserQuery] = useState("");
  const [productQuery, setProductQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [cart, setCart] = useState([]);

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [discount, setDiscount] = useState(0);

  // Autofill address fields when a user is selected
  useEffect(() => {
    if (selectedUser) {
      setAddress(selectedUser.address || "");
      setCity(selectedUser.city || "");
      setState(selectedUser.state || "");
    }
  }, [selectedUser]);

  // Search users
  const handleUserSearch = async () => {
    if (!userQuery.trim()) return;
    try {
      const res = await customFetch.get(`/users/search?q=${userQuery}`);
      setUsers(res.data);
    } catch {
      toast.error("Failed to fetch users");
    }
  };

  // Search products
  const handleProductSearch = async () => {
    if (!productQuery.trim()) return;
    try {
      const res = await customFetch.get(`/products/search?q=${productQuery}`);
      setProducts(res.data);
    } catch {
      toast.error("Failed to fetch products");
    }
  };

  // Add product to cart
  const addToCart = (product) => {
    if (cart.find((i) => i._id === product._id)) {
      toast.info("Product already added");
      return;
    }
    setCart([...cart, { ...product, amount: 1 }]);
  };

  // Remove product from cart
  const removeFromCart = (id) => {
    setCart(cart.filter((i) => i._id !== id));
  };

  // Update quantity
  const updateQty = (id, value) => {
    const qty = Math.max(1, Number(value));
    setCart(cart.map((i) => (i._id === id ? { ...i, amount: qty } : i)));
  };

  // Submit order
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || cart.length === 0) {
      toast.warn("Select a user and add at least one product");
      return;
    }

    const getAdmin = localStorage.getItem("admin");
    const token = JSON.parse(getAdmin)?.token;

    try {
      await customFetch.post(
        "/orders",
        {
          data: {
            userId: selectedUser._id,
            name: selectedUser.username,
            address,
            city,
            state,
            discount: Number(discount),
            numItemsInCart: cart.length,
            cartItems: cart.map((p) => ({
              productId: p._id,
              name: p.title,
              price: p.sellingPrice,
              amount: p.amount,
              image: p.image1?.url || p.image1,
            })),
          },
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order created successfully");
      // Reset all fields
      setCart([]);
      setSelectedUser(null);
      setUsers([]);
      setProducts([]);
      setAddress("");
      setCity("");
      setState("");
      setUserQuery("");
      setProductQuery("");
      setDiscount(0);

      navigate("/admin/orders")
    } catch (err) {
      toast.error(err?.response?.data?.message || "Order creation failed");
    }
  };

  // Totals
  const subtotal = cart.reduce((sum, i) => sum + i.sellingPrice * i.amount, 0);
  const total = Math.max(0, subtotal - Number(discount));

  return (
    <section className="max-w-5xl mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Order</h2>

      {/* USER SEARCH */}
      <div className="mb-4">
        <label className="font-semibold">Search User</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            className="input input-bordered w-full"
            value={userQuery}
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Search by name, email, or company"
          />
          <button className="btn btn-primary" onClick={handleUserSearch}>
            Search
          </button>
        </div>

        {users.length > 0 && (
          <ul className="menu bg-base-100 mt-2 rounded-lg">
            {users.map((u) => (
              <li key={u._id}>
                <button
                  onClick={() => {
                    setSelectedUser(u);
                    setUsers([]);
                  }}
                >
                  {`${u.company || ""} (${u.username}) — ${u.city || ""}, ${
                    u.state || ""
                  }`}
                </button>
              </li>
            ))}
          </ul>
        )}

        {selectedUser && (
          <p className="mt-2 text-sm text-success">
            ✅ Selected User: {selectedUser.company} ({selectedUser.username})
          </p>
        )}
      </div>

      {/* ADDRESS */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <input
          className="input input-bordered"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
        <input
          className="input input-bordered"
          placeholder="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />
      </div>

      {/* PRODUCT SEARCH */}
      <div className="mb-4">
        <label className="font-semibold">Search Products</label>
        <div className="flex gap-2 mt-1">
          <input
            type="text"
            className="input input-bordered w-full"
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            placeholder="Search product name"
          />
          <button className="btn btn-secondary" onClick={handleProductSearch}>
            Search
          </button>
        </div>

        {products.length > 0 && (
          <ul className="menu bg-base-100 mt-2 rounded-lg">
            {products.map((p) => (
              <li key={p._id}>
                <button
                  onClick={() => {
                    addToCart(p);
                    setProducts([]);
                    setProductQuery("");
                  }}
                >
                  {p.title} — {p.company} — ₹{p.sellingPrice}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* CART TABLE */}
      {cart.length > 0 && (
        <>
          <div className="overflow-x-auto mb-4 border rounded-lg">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price (₹)</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id}>
                    <td>{item.title}</td>
                    <td>{item.sellingPrice}</td>
                    <td>
                      <input
                        type="number"
                        className="input input-bordered w-20"
                        min="1"
                        value={item.amount}
                        onChange={(e) => updateQty(item._id, e.target.value)}
                      />
                    </td>
                    <td>{item.sellingPrice * item.amount}</td>
                    <td>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => removeFromCart(item._id)}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TOTAL SUMMARY */}
          <div className="text-right mb-4 text-lg">
            <p>Subtotal: ₹{subtotal.toLocaleString()}</p>
            <p>Discount: ₹{Number(discount).toLocaleString()}</p>
            <p className="font-bold">Total: ₹{total.toLocaleString()}</p>
          </div>
        </>
      )}

      {/* DISCOUNT + SUBMIT */}
      <div className="mt-6 flex flex-wrap justify-end items-center gap-4 border-t border-base-300 pt-4">
        <div className="flex items-center gap-2">
          <label className="font-medium text-sm text-gray-600">
            Discount (₹)
          </label>
          <input
            type="number"
            placeholder="0"
            className="input input-bordered w-32"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value))}
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary btn-block"
          onClick={handleSubmit}
        >
          Create Order
        </button>
      </div>
    </section>
  );
};

export default AdminOrderCreate;
