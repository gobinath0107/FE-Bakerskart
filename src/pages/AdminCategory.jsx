import { useLoaderData, Link } from 'react-router-dom';
import { useState } from 'react';
import { customFetch } from '../utils';
import { PaginationContainer } from '../components';

const url = '/categories';

const allCategoryQuery = (queryParams) => {
  return {
    queryKey: ['categories', queryParams],
    queryFn: () =>
      customFetch(url, {
        params: queryParams ? queryParams : { page: 1, limit: 10 },
      }),
  };
};

export const singleCategoryQuery = (id) => ({
  queryKey: ['category', id],
  queryFn: () => customFetch(`/categories/${id}`),
});

export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(allCategoryQuery(params));
    const categories = response.data.data || [];
    const meta = response.data.meta || {};
    return { categories, meta, params };
  };

const AdminCategory = () => {
  const { categories, meta } = useLoaderData();
  const [loading, setLoading] = useState(false);

  // 🔹 Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // 🔹 Open delete confirmation modal
  const handleDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  // 🔹 Confirm deletion
  const handleDeleteConfirm = async () => {
    if (!selectedCategory?._id) return;

    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedCategory._id}`);
      window.location.reload(); // optional: replace with queryClient.invalidateQueries(['categories'])
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedCategory(null);
    }
  };

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <Link to="/admin/category/create" className="btn btn-primary btn-sm">
          + Add Category
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.name}</td>
                <td>{cat.description}</td>
                <td className="text-right space-x-2">
                  <Link
                    to={`/admin/category/edit/${cat._id}`}
                    className="btn btn-sm btn-warning"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(cat)}
                    className="btn btn-sm btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta?.pagination && <PaginationContainer meta={meta} />}

      {/* 🔹 Confirmation Modal */}
      {showModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete category{' '}
              <span className="font-semibold">{selectedCategory?.name}</span>?
            </p>
            <div className="modal-action">
              <button
                className="btn btn-error"
                onClick={handleDeleteConfirm}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                className="btn"
                onClick={() => {
                  setShowModal(false);
                  setSelectedCategory(null);
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

export default AdminCategory;
