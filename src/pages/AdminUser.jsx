import { useLoaderData, Link } from 'react-router-dom';
import { useState } from 'react';
import { customFetch } from '../utils';
import { PaginationContainer } from '../components';

const url = '/users';

const allUsersQuery = (queryParams) => {
  return {
    queryKey: ['users', queryParams],
    queryFn: () =>
      customFetch(url, {
        params: queryParams ? queryParams : { page: 1, limit: 10 },
      }),
  };
};

export const singleUserQuery = (id) => ({
  queryKey: ['user', id],
  queryFn: () => customFetch(`/users/${id}`),
});

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(allUsersQuery(params));
    const users = response.data.data || [];
    const meta = response.data.meta || {};
    return { users, meta, params };
  };

const AdminsUser = () => {
  const { users, meta } = useLoaderData();
  const [loading, setLoading] = useState(false);

  // 🔹 State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;
    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedUser._id}`);
      window.location.reload(); // or use queryClient.invalidateQueries(['users'])
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <Link to="create" className="btn btn-primary">
          + Add User
        </Link>
      </div>

      {/* Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th className='capitalize'>Name</th>
            <th className='capitalize'>Email</th>
            <th className='capitalize'>Address</th>
            <th className='capitalize'>City</th>
            <th className='capitalize'>State</th>
            <th className='capitalize'>Mobile</th>
            <th className='capitalize'>Company</th>
            <th className='capitalize'>Status</th>
            <th className='capitalize'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.city}</td>
              <td>{user.state}</td>
              <td>{user.mobile}</td>
              <td>{user.company}</td>
              <td>{user.status}</td>
              <td className="flex gap-2">
                <Link
                  to={`edit/${user._id}`}
                  className="btn btn-sm btn-outline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => {
                    setSelectedUser(user);
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
          {users.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No users found.
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
              <span className="font-semibold">{selectedUser?.username}</span>?
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
                  setSelectedUser(null);
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

export default AdminsUser;
