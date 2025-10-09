import { useLoaderData, Link, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch, formatPrice, productionUrl } from "../utils";

// --- Query for fetching a single order ---
const singleOrderQuery = (id, user) => {
  return {
    queryKey: ["singleOrder", id],
    queryFn: () =>
      customFetch.get(`/orders/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      }),
  };
};

export const loader = (store, queryClient) => async ({ params }) => {
  const user = store.getState().userState.user;
  if (!user) {
    toast.warn("Please login to view order details");
    return redirect("/login");
  }

  try {
    const response = await queryClient.ensureQueryData(
      singleOrderQuery(params.id, user)
    );
    return { order: response.data, user };
  } catch (err) {
    console.error(err);
    toast.error("Failed to load order details");
    return redirect("/orders");
  }
};

const SingleOrder = () => {
  const { order, user } = useLoaderData();
  if (!order) return <p className="text-center mt-10">Order not found</p>;

  const handleDownloadInvoice = async () => {
    try {
      const response = await fetch(
        `${productionUrl}/orders/${order._id}/invoice`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to generate invoice");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${order.orderId || order._id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download invoice");
    }
  };

  return (
    <section className="max-w-5xl mx-auto p-4 sm:p-6 bg-base-200 rounded-lg shadow">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold">Order Details</h2>
        <Link to="/orders" className="btn btn-outline btn-sm">
          Back to Orders
        </Link>
      </div>

      {/* Order Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-sm sm:text-base">
        <p><strong>Order ID:</strong> {order.orderId}</p>
        <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</p>
        <p><strong>Customer:</strong> {order.name}</p>
        <p><strong>Company:</strong> {order.user?.company}</p>
        <p><strong>Address:</strong> {order.address}, {order.city}, {order.state}</p>
      </div>

      {/* Cart Items */}
      <h3 className="text-lg font-semibold mb-3">Cart Items</h3>
      <div className="overflow-x-auto border rounded-lg">
        <table className="table w-full text-sm sm:text-base">
          <thead className="bg-base-300">
            <tr>
              <th>Product</th>
              <th>Price (₹)</th>
              <th>Qty</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.cartItems.map((item) => (
              <tr key={item._id}>
                <td className="flex items-center gap-3 min-w-[180px]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 object-cover rounded"
                  />
                  <span className="truncate">{item.name}</span>
                </td>
                <td>{formatPrice(item.price)}</td>
                <td>{item.amount}</td>
                <td>{formatPrice(item.price * item.amount)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col sm:flex-row justify-between mt-6 text-base sm:text-lg">
        <div></div>
        <div className="text-right">
          <p>Subtotal: ₹{order.chargeTotal?.toLocaleString()}</p>
          {Number(order.discount) ? (
            <p>Discount: ₹{order.discount}</p>
          ) : null}
          <p className="font-bold">Total: ₹{order.orderTotal}</p>
        </div>
      </div>

      {/* Invoice Button */}
      {order.status === "delivered" && (
        <div className="mt-6 text-right">
          <button className="btn btn-primary btn-md" onClick={handleDownloadInvoice}>
            Download Invoice
          </button>
        </div>
      )}
    </section>
  );
};

export default SingleOrder;
