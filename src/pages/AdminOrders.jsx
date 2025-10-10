import { Link, useLoaderData } from "react-router-dom";
import { useState } from "react";
import { customFetch } from "../utils";
import { PaginationContainer } from "../components";
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

  const handleDeleteConfirm = async () => {
    if (!selectedOrder) return;
    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedOrder.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      window.location.reload(); // or invalidate queries
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
                <Link
                  to={`edit/${order.id}`}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </Link>
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
              <td colSpan="8" className="text-center text-gray-500 py-4">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {meta?.pagination && <PaginationContainer />}

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
    </div>
  );
};

export default AdminOrder;
