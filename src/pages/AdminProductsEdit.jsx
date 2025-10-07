import { Form, useLoaderData, redirect } from "react-router-dom";
import { toast } from "react-toastify";
import { customFetch } from "../utils";
import { singleProductQuery } from "./AdminProducts.jsx";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import SubmitBtn from "../components/SubmitBtn";
import { useRef, useState } from "react";

export const loader =
  (queryClient) =>
  async ({ params }) => {
    const product = await queryClient.ensureQueryData(
      singleProductQuery(params.id)
    );
    if (!product) throw new Response("Not Found", { status: 404 });

    const response = await customFetch.get("/categories");
    return { product, categories:response.data.data };
  };

export const action =
  (queryClient) =>
  async ({ request, params }) => {
    try {
      const formData = await request.formData(); // FormData object

      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Convert checkbox to true/false string
      const isFeatured = formData.get("featured") ? "true" : "false";
      formData.set("featured", isFeatured);

      // Send FormData directly — do NOT convert to JSON
      await customFetch.patch(`/products/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Axios detects boundaries automatically
        },
      });

      await queryClient.removeQueries(["products"]);
      await queryClient.removeQueries(["product"]);
      await queryClient.invalidateQueries(["products", params.id]);
      toast.success("Product updated");
      return redirect("/admin/products");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update product");
      return null;
    }
  };

const AdminProductsEdit = () => {
  const { product, categories } = useLoaderData();
  const fileInputsRef = useRef({});
  const [previewImages, setPreviewImages] = useState({});

  const handleImageClick = (imgKey) => {
    fileInputsRef.current[imgKey]?.click();
  };

  const handleFileChange = (e, imgKey) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImages((prev) => ({
        ...prev,
        [imgKey]: imageUrl,
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>

      <Form
        method="post"
        className="flex flex-col gap-y-4"
        encType="multipart/form-data"
      >
        <FormInput
          label="Title"
          name="title"
          type="text"
          defaultValue={product.title}
        />
        <FormInput
          label="Company"
          name="company"
          type="text"
          defaultValue={product.company}
        />
        <FormInput
          label="Description"
          name="description"
          type="text"
          defaultValue={product.description}
        />
        <FormInput
          label="Selling Price"
          name="sellingPrice"
          type="number"
          defaultValue={product.sellingPrice}
        />
        <FormInput
          label="Price"
          name="price"
          type="number"
          defaultValue={product.price}
        />
        <FormInput
          label="Stock"
          name="stock"
          type="number"
          defaultValue={product.stock}
        />
        <FormInput
          label="Featured"
          name="featured"
          type="checkbox"
          defaultChecked={product.featured}
        />

        {/* Image upload section */}
        <div>
          <h3 className="font-semibold mb-2">Product Images</h3>
          <div className="grid grid-cols-5 gap-2">
            {["image1", "image2", "image3", "image4", "image5"].map(
              (imgKey) => (
                <div
                  key={imgKey}
                  className="relative w-16 h-16 cursor-pointer border rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center"
                >
                  {/* Delete / Close Button */}
                  {(previewImages[imgKey] || product[imgKey]?.url) && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent triggering file input
                        // Remove preview
                        setPreviewImages((prev) => ({
                          ...prev,
                          [imgKey]: null,
                        }));
                        // Mark existing image to delete
                        const deleteInput = document.createElement("input");
                        deleteInput.type = "hidden";
                        deleteInput.name = `delete_${imgKey}`;
                        deleteInput.value = "true";
                        e.currentTarget.parentNode.appendChild(deleteInput);
                        // Optional: hide the existing image visually
                        if (product[imgKey]?.url) product[imgKey].url = null;
                      }}
                      className="absolute top-1 right-1 bg-gray-800 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-10"
                    >
                      ×
                    </button>
                  )}

                  {/* Clickable image / preview */}
                  <div
                    onClick={() => handleImageClick(imgKey)}
                    className="w-full h-full"
                  >
                    {previewImages[imgKey] ? (
                      <img
                        src={previewImages[imgKey]}
                        alt="preview"
                        className="w-full h-full object-cover"
                      />
                    ) : product[imgKey]?.url ? (
                      <img
                        src={product[imgKey].url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-500">{imgKey}</span>
                    )}
                  </div>

                  {/* Hidden file input */}
                  <input
                    type="file"
                    name={imgKey}
                    accept="image/*"
                    ref={(el) => (fileInputsRef.current[imgKey] = el)}
                    className="hidden"
                    onChange={(e) => handleFileChange(e, imgKey)}
                  />
                </div>
              )
            )}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Click an image or empty box to add/replace.
          </p>
        </div>

        <FormSelect
          label="Category"
          name="category"
          list={categories.map((category) => category.name)}
          defaultValue={product.category?.name || ""}
        />
        <SubmitBtn text="Update Admin" />
      </Form>
    </div>
  );
};

export default AdminProductsEdit;
