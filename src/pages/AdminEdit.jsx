import { Form, useLoaderData, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import { singleAdminQuery } from './Admins.jsx';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import SubmitBtn from '../components/SubmitBtn';

export const loader = (queryClient) => async ({ params }) => {
  const response = await queryClient.ensureQueryData(singleAdminQuery(params.id));
  console.log("response:", response);
  
  const admin = response?.data?.admin;
  if (!admin) {
    throw new Response('Not Found', { status: 404 });
  }
  return { admin };
};

export const action = (queryClient) => async ({ request, params }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    if (!payload.password) delete payload.password;
    await customFetch.put(`/admins/${params.id}`, payload);
    await queryClient.invalidateQueries(['admins']);
    await queryClient.invalidateQueries(['admin', params.id]);
    toast.success('Admin updated');
    return redirect('/admin/admins');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update admin');
    return null;
  }
};

const AdminEdit = () => {
  const { admin } = useLoaderData();

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Admin</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput
          label="username"
          name="username"
          type="text"
          defaultValue={admin.username}
        />
        <FormInput
          label="email"
          name="email"
          type="email"
          defaultValue={admin.email}
        />
        <FormInput
          label="password"
          name="password"
          type="password"
          defaultValue=""
        />
        <FormSelect
          label="role"
          name="role"
          list={['staff', 'superadmin', 'admin']}
          defaultValue={admin.role}
        />
        <SubmitBtn text="Update Admin" />
      </Form>
    </div>
  );
};

export default AdminEdit;
