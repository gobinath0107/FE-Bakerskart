import { useLoaderData, Link } from 'react-router-dom';
import { useState } from 'react';
import { customFetch } from '../utils';
import { PaginationContainer } from '../components';

const url = '/admins';

const allAdminsQuery = (queryParams) => {
  return {
    queryKey: ['admins', queryParams],
    queryFn: () =>
      customFetch(url, {
        params: queryParams ? queryParams : { page: 1, limit: 10 },
      }),
  };
};

export const singleAdminQuery = (id) => ({
  queryKey: ['admin', id],
  queryFn: () => customFetch(`/admins/${id}`),
});

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(allAdminsQuery(params));
    const admins = response.data.data || [];
    const meta = response.data.meta || {};
    return { admins, meta, params };
  };

const Admins = () => {
  const { admins, meta } = useLoaderData();
  const [loading, setLoading] = useState(false);

  // 🔹 State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!selectedAdmin) return;
    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedAdmin._id}`);
      window.location.reload(); // or use queryClient.invalidateQueries(['admins'])
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedAdmin(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Admins Management</h2>
        <Link to="create" className="btn btn-primary">
          + Add Admin
        </Link>
      </div>

      {/* Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin._id}>
              <td>{admin.username}</td>
              <td>{admin.email}</td>
              <td>
                <span className="badge badge-secondary">{admin.role}</span>
              </td>
              <td className="flex gap-2">
                <Link
                  to={`edit/${admin._id}`}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setSelectedAdmin(admin);
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
          {admins.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No admins found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {meta?.pagination ? <PaginationContainer /> : null}

      {/* 🔹 Delete Confirmation Modal */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">{selectedAdmin?.username}</span>?
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
                  setSelectedAdmin(null);
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

export default Admins;
