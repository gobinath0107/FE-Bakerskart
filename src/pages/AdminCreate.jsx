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
    await customFetch.post('/authadmin/register', payload);
    toast.success('Admin created');
    queryClient.removeQueries(["admins"]);
    return redirect('/admin/admins');
  } catch (err) {
    toast.error(err?.response?.data?.message || 'Failed to create admin');
    return null;
  }
};

const AdminCreate = () => {
  return (
    <div className="max-w-lg mx-auto bg-base-200 p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Add New Admin</h2>

      <Form method="post" className="flex flex-col gap-y-4">
        <FormInput label="username" name="username" type="text" />
        <FormInput label="email" name="email" type="email" />
        <FormInput label="password" name="password" type="password" />
        <FormSelect
          label="role"
          name="role"
          list={['staff', 'superadmin', 'admin']}
          defaultValue="staff"
        />
        <SubmitBtn text="Create Admin" />
      </Form>
    </div>
  );
};

export default AdminCreate;
