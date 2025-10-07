import { Form, useLoaderData, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import { singleCategoryQuery } from './AdminCategory.jsx';
import FormInput from '../components/FormInput';
import SubmitBtn from '../components/SubmitBtn';

export const loader = (queryClient) => async ({ params }) => {
  const response = await queryClient.ensureQueryData(singleCategoryQuery(params.id));
  console.log("response:", response);
  
  const category = response?.data;
  if (!category) {
    throw new Response('Not Found', { status: 404 });
  }
  return { category };
};

export const action = (queryClient) => async ({ request, params }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    if (!payload.password) delete payload.password;
    await customFetch.patch(`/categories/${params.id}`, payload);
    await queryClient.removeQueries(['categories']);
    await queryClient.removeQueries(['category', params.id]);
    toast.success('category updated');
    return redirect('/admin/category');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update Category');
    return null;
  }
};

const AdminCategoryEdit = () => {
  const { category } = useLoaderData();

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Admin</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput
          label="name"
          name="name"
          type="text"
          defaultValue={category.name}
        />
        <FormInput
          label="description"
          name="description"
          type="text"
          defaultValue={category.description}
        />
        <SubmitBtn text="Update Admin" />
      </Form>
    </div>
  );
};

export default AdminCategoryEdit;
