import { useLoaderData, Link } from "react-router-dom";
import { useState } from "react";
import { customFetch } from "../utils";
import { PaginationContainer } from "../components";

const url = "/products";

const allProductsQuery = (queryParams) => {
  return {
    queryKey: ["products", queryParams],
    queryFn: () =>
      customFetch(url, {
        params: queryParams ? queryParams : { page: 1, limit: 10 },
      }),
  };
};

export const singleProductQuery = (id) => ({
  queryKey: ['product', id],
  queryFn: async () => {
    const { data } = await customFetch(`/products/${id}`);
    console.log("Fetched single product:", data);
    return data; // backend returns product directly (no { data: { ... } })
  },
});



export const loader =
  (queryClient) =>
  async ({ request }) => {
    const params = Object.fromEntries([
      ...new URL(request.url).searchParams.entries(),
    ]);

    const response = await queryClient.ensureQueryData(
      allProductsQuery(params)
    );
    const products = response.data.data || [];
    const meta = response.data.meta || {};

    return { products, meta, params };
  };

const AdminProducts = () => {
  const { products, meta } = useLoaderData();
  const [loading, setLoading] = useState(false);

  // 🔹 State for modal
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;
    try {
      setLoading(true);
      await customFetch.delete(`${url}/${selectedProduct._id}`);
      window.location.reload(); // or use queryClient.invalidateQueries(['products'])
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setShowModal(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Products Management</h2>
        <Link to="create" className="btn btn-primary">
          + Add Product
        </Link>
      </div>

      {/* Table */}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Company</th>
            <th>Description</th>
            <th>Selling Price</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Featured</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td>{product.title}</td>
              <td>{product.company}</td>
              <td>{product.description}</td>
              <td>{product.sellingPrice}</td>
              <td>{product.price}</td>
              <td>{product.stock}</td>
              <td>{product.featured ? "Yes" : "No"}</td>
              <td>
                <span className="badge badge-secondary">
                  {product.category.name}
                </span>
              </td>
              {/* 🔹 Images + Actions in same column */}
              <td>
                <div className="flex flex-col gap-2">
                  {/* Images row */}
                  <div className="flex gap-2">
                    {["image1", "image2", "image3", "image4", "image5"].map(
                      (imgKey) =>
                        product[imgKey]?.url ? (
                          <img
                            key={imgKey}
                            src={product[imgKey].url}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : null
                    )}
                  </div>

                  {/* Actions row */}
                  <div className="flex gap-2">
                    <Link
                      to={`edit/${product._id}`}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowModal(true);
                      }}
                      disabled={loading}
                      className="btn btn-sm btn-error text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">
                No products found.
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
              <span className="font-semibold">{selectedProduct?.name}</span>?
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
                  setSelectedProduct(null);
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

export default AdminProducts;
