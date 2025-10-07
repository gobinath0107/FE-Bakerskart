import { useEffect, useState } from "react";
import { Form, useLoaderData, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch, generateAmountOptions } from "../utils";
import { singleOrderQuery } from "./AdminOrders";
import FormInput from "../components/FormInput";
import SubmitBtn from "../components/SubmitBtn";

export const loader = (queryClient) => async ({ params }) => {
  const getAdmin = localStorage.getItem("admin");
  const token = JSON.parse(getAdmin).token;
  const response = await queryClient.ensureQueryData(
    singleOrderQuery(params.id, token)
  );
  const order = response?.data;
  if (!order) throw new Response("Not Found", { status: 404 });

  // Fetch all products for "add product" dropdown
  const productsRes = await customFetch("/products", {
    params: { page: 1, limit: 1000 },
  });
  const products = productsRes.data.data || [];

  return { order, products, token };
};

export const action = (queryClient) => async ({ request, params }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  if (data.cartItems) data.cartItems = JSON.parse(data.cartItems);

  const getAdmin = localStorage.getItem("admin");
  const token = JSON.parse(getAdmin).token;

  try {
    await customFetch.patch(`/orders/${params.id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    queryClient.removeQueries("orders");
    queryClient.removeQueries("order");
    toast.success("Order updated successfully");
    return redirect("/admin/orders");
  } catch (err) {
    toast.error(err?.response?.data?.message || "Failed to update order");
    return null;
  }
};

const AdminOrderEdit = () => {
  const { order, products } = useLoaderData();

  const [status, setStatus] = useState(order.status);
  const [cartItems, setCartItems] = useState(order.cartItems);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discount, setDiscount] = useState(order.discount || 0);

  const handleAmountChange = (id, value) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, amount: parseInt(value) } : item
      )
    );
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item._id !== id));
  };

  const handleAddProduct = () => {
    if (!selectedProduct) return;
    const product = products.find((p) => p._id === selectedProduct);
    if (!product) return;

    // Add product to cartItems
    setCartItems((prev) => [
      ...prev,
      {
        _id: new Date().getTime().toString(), // temporary id
        productId: product._id,
        name: product.title,
        price: product.price,
        amount: 1,
        image: product.image1?.url,
      },
    ]);
    setSelectedProduct("");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.amount, 0);
  const totalItems = cartItems.reduce((sum, i) => sum + i.amount, 0);
  const finalTotal = Math.max(subtotal - Number(discount), 0);

  const cartItemsJSON = JSON.stringify(cartItems);

  return (
    <div className="max-w-3xl mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Order</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        {/* Order info */}
        <FormInput label="Name" name="name" type="text" defaultValue={order.name} />
        <FormInput
          label="Email"
          name="email"
          type="text"
          defaultValue={order.user.email}
        />
        <FormInput
          label="Address"
          name="address"
          type="text"
          defaultValue={order.address}
        />

        {/* Add New Product */}
        <div className="flex items-center gap-2">
          <select
            className="select select-bordered"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">Select product to add</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} - ₹{p.price}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleAddProduct}
          >
            Add Product
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex flex-col gap-2 border rounded p-2 max-h-96 overflow-y-auto">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b py-2"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">₹{item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="select select-sm select-bordered"
                  value={item.amount}
                  onChange={(e) =>
                    handleAmountChange(item._id, e.target.value)
                  }
                >
                  {generateAmountOptions(item.amount + 5)}
                </select>
                <button
                  type="button"
                  className="btn btn-sm btn-error"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Discount Field */}
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text font-semibold">Discount (₹)</span>
          </label>
          <input
            type="number"
            name="discount"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="input input-bordered"
            min="0"
          />
        </div>

        {/* Totals */}
        <FormInput
          label="Total Items"
          name="numItemsInCart"
          type="text"
          defaultValue={totalItems}
          readOnly
        />
        <FormInput
          label="Order Total"
          name="orderTotal"
          type="text"
          defaultValue={`₹${finalTotal}`}
          readOnly
        />

        {/* Status */}
        <div className="flex flex-col">
          <label className="label">
            <span className="label-text font-semibold">Status</span>
          </label>
          <select
            className="select select-bordered"
            name="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {["pending", "paid", "delivered", "cancelled"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Hidden cartItems */}
        <input type="hidden" name="cartItems" value={cartItemsJSON} />
        <SubmitBtn text="Update Order" />
      </Form>
    </div>
  );
};

export default AdminOrderEdit;
