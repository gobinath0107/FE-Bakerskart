import { Form, redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { customFetch } from '../utils';
import FormInput from '../components/FormInput';
import FormSelect from '../components/FormSelect';
import SubmitBtn from '../components/SubmitBtn';

export const action = (queryClient) => async ({ request }) => {
  const formData = await request.formData();
  const payload = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/register', payload);
    toast.success('User created');
    queryClient.removeQueries(["users"]);
    return redirect('/admin/users');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to create user');
    return null;
  }
};

const AdminUserCreate = () => {
  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New User</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput label="username" name="username" type="text" />
        <FormInput label="email" name="email" type="email" />
        <FormInput label="password" name="password" type="password" />
        <FormInput label="address" name="address" type="text" />
        <FormInput label="city" name="city" type="text" />
        <FormInput label="state" name="state" type="text" />
        <FormInput label="mobile" name="mobile" type="text" />
        <FormInput label="company" name="company" type="text" />
        <FormSelect
          label="status"
          name="status"
          list={['active', 'inactive']}
          defaultValue="active"
        />
        <SubmitBtn text="Create User" />
      </Form>
    </div>
  );
};

export default AdminUserCreate;
