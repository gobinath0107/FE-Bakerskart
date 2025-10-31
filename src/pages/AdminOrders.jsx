import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { customFetch } from "../utils";
import { PaginationContainer } from "../components";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { toast } from "react-toastify";

const url = "/orders";

const allOrdersQuery = (queryParams, token) => ({
  queryKey: ["orders", queryParams],
  queryFn: () =>
    customFetch(url, {
      params: queryParams ? queryParams : { page: 1, pageSize: 10 },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
});

export const singleOrderQuery = (id, token) => ({
  queryKey: ["order", id],
  queryFn: () =>
    customFetch(`/orders/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }),
});

export const loader =
  (store, queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);
    const admin = store.getState().userState.admin;
    if (!admin?.token) throw new Response("Unauthorized", { status: 401 });

    const response = await queryClient.ensureQueryData(
      allOrdersQuery(params, admin.token)
    );
    const orders = response.data.data || [];
    const meta = response.data.meta || {};
    return { orders, meta, params, token: admin.token };
  };

const AdminOrder = () => {
  const { orders, meta, token } = useLoaderData();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // new states for bill type modal
  const [showTypeModal, setShowTypeModal] = useState(false);

  // ✅ Download Invoice with selected type
  const handleDownloadInvoice = async (order, type) => {
    try {
      setLoading(true);
      const response = await customFetch.get(
        `/orders/${order.id}/invoice?type=${type}`,
        {
          responseType: "blob",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `invoice-${order.id}-${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      toast?.success?.(`${type} invoice downloaded successfully`);
    } catch (err) {
      console.error(err);
      toast?.error?.("Failed to download invoice");
    } finally {
      setLoading(false);
      setShowTypeModal(false);
      setSelectedOrder(null);
    }
  };

  // ✅ Handle Delete
  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedOrder.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload(); // refresh or invalidate query
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedOrder(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <Link to="create" className="btn btn-primary">
          + Add Order
        </Link>
      </div>

      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Company</th>
            <th>City</th>
            <th>State</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.attributes.name}</td>
              <td>{order.attributes.address}</td>
              <td>{order.attributes.user.company}</td>
              <td>{order.attributes.city}</td>
              <td>{order.attributes.state}</td>
              <td>{order.attributes.numItemsInCart}</td>
              <td>{order.attributes.orderTotal}</td>
              <td>
                <span className="badge badge-secondary">
                  {order.attributes.status}
                </span>
              </td>
              <td className="flex gap-2">
                {/* ✅ Download Invoice Button */}
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowTypeModal(true); // open type modal
                  }}
                  disabled={loading}
                  className="btn btn-sm btn-outline"
                  title="Download Invoice"
                >
                  <FaCloudDownloadAlt className="text-blue-600" />
                </button>

                {/* ✅ Edit */}
                <Link
                  to={`edit/${order.id}`}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </Link>

                {/* ✅ Delete */}
                <button
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowModal(true);
                  }}
                  disabled={loading}
                  className="btn btn-sm btn-error text-white"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center text-gray-500 py-4">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {meta?.pagination && <PaginationContainer />}

      {/* ✅ Delete Confirmation Modal */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the order by{" "}
              <span className="font-semibold">
                {selectedOrder?.attributes.name}
              </span>
              ?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* ✅ Bill Type Selection Modal */}
      {showTypeModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4 text-center">
              Select Bill Type
            </h3>
            <div className="flex justify-center gap-4 mb-6">
              <button
                className="btn btn-success"
                disabled={loading}
                onClick={() => handleDownloadInvoice(selectedOrder, "Cash")}
              >
                {loading ? "Generating..." : "Cash Bill"}
              </button>
              <button
                className="btn btn-warning"
                disabled={loading}
                onClick={() => handleDownloadInvoice(selectedOrder, "Credit")}
              >
                {loading ? "Generating..." : "Credit Bill"}
              </button>
            </div>
            <div className="modal-action justify-center">
              <button
                className="btn"
                onClick={() => {
                  setShowTypeModal(false);
                  setSelectedOrder(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AdminOrder;
