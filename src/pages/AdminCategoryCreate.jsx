import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import FormInput from '../components/FormInput';
import SubmitBtn from '../components/SubmitBtn';

// 🔹 Action for creating a new category
export const action = (queryClient) => async ({ request }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    await customFetch.post('/categories', payload);
    toast.success('Category created successfully');
    queryClient.removeQueries(['categories']); // invalidate category cache
    return redirect('/admin/category');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to create category');
    return null;
  }
};

// 🔹 Component UI
const AdminCategoryCreate = () => {
  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Category</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput label="Name" name="name" type="text" />
        <FormInput label="Description" name="description" type="text" />
        <SubmitBtn text="Create Category" />
      </Form>
    </div>
  );
};

export default AdminCategoryCreate;
