// inside AdminProductsCreate.jsx
import { useLoaderData, Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import SubmitBtn from '../components/SubmitBtn';

// 🔹 loader to fetch categories
export const loader = async () => {
  try {
    const response = await customFetch.get('/categories',{ params: { page:1, pageSize:1000 }});
    const categories = response.data.data || [];
    return categories
  } catch (err) {
    console.error("Failed to fetch categories", err);
    return [];
  }
};

export const action = (queryClient) => async ({ request }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    await customFetch.post('/products', payload, {
      headers: { "Content-Type": "multipart/form-data" }, // 👈 for images
    });
    toast.success('Product created');
    queryClient.removeQueries(["products"]);
    return redirect('/admin/products');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to create product');
    return null;
  }
};

const AdminProductsCreate = () => {
  const categories = useLoaderData();

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      <Form method="post" encType="multipart/form-data" className="flex flex-col gap-y-4">
        <FormInput label="title" name="title" type="text" />
        <FormInput label="company" name="company" type="text" />
        <FormInput label="description" name="description" type="text" />
        <FormInput label="sellingPrice" name="sellingPrice" type="number" />
        <FormInput label="price" name="price" type="number" />
        <FormInput label="stock" name="stock" type="number" />
        <FormInput label="image1" name="image1" type="file" />
        <FormInput label="image2" name="image2" type="file" />
        <FormInput label="image3" name="image3" type="file" />
        <FormInput label="image4" name="image4" type="file" />
        <FormInput label="image5" name="image5" type="file" />
        
        {/* 🔹 dynamic category select */}
        <FormSelect
          label="category"
          name="category"
          list={categories.map((cat) => cat.name)}
          defaultValue=""
        />

        <SubmitBtn text="Create Product" />
      </Form>
    </div>
  );
};

export default AdminProductsCreate;
