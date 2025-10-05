import { Form, useLoaderData, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import { singleUserQuery } from './AdminUser';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import SubmitBtn from '../components/SubmitBtn';

export const loader = (queryClient) => async ({ params }) => {
  const response = await queryClient.ensureQueryData(singleUserQuery(params.id));
  console.log("response:", response);

  const users = response?.data?.user;
  if (!users) {
    throw new Response('Not Found', { status: 404 });
  }
  return { users };
};

export const action = (queryClient) => async ({ request, params }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    if (!payload.password) delete payload.password;
    await customFetch.put(`/users/${params.id}`, payload);
    await queryClient.invalidateQueries(['users']);
    await queryClient.invalidateQueries(['user', params.id]);
    queryClient.removeQueries(["users"]);
    toast.success('User updated');
    return redirect('/admin/users');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to update user');
    return null;
  }
};

const AdminUserEdit = () => {
  const { users } = useLoaderData();

  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput
          label="username"
          name="username"
          type="text"
          defaultValue={users.username}
        />
        <FormInput
          label="email"
          name="email"
          type="email"
          defaultValue={users.email}
        />
        <FormInput
          label="password"
          name="password"
          type="password"
          defaultValue=""
        />
        <FormInput
          label="address"
          name="address"
          type="text"
          defaultValue={users.address}
        />
        <FormInput
          label="city"
          name="city"
          type="text"
          defaultValue={users.city}
        />
        <FormInput
          label="state"
          name="state"
          type="text"
          defaultValue={users.state}
        />
        <FormInput
          label="mobile"
          name="mobile"
          type="number"
          defaultValue={users.mobile}
        />
        <FormInput
          label="company"
          name="company"
          type="text"
          defaultValue={users.company}
        />
        <FormSelect
          label="status"
          name="status"
          list={['active', 'inactive']}
          defaultValue={users.status === 'active' ? 'active' : 'inactive'}
        />
        <SubmitBtn text="Update User" />
      </Form>
    </div>
  );
};

export default AdminUserEdit;
