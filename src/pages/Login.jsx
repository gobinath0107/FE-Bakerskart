import { FormInput, SubmitBtn } from '../components';
import { Form, Link, redirect } from 'react-router-dom';
import { customFetch } from '../utils';
import { toast } from 'react-toastify';
import { loginUser } from '../features/user/userSlice';
import { useState } from 'react';

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    try {
      const response = await customFetch.post('/auth/login', data);
      store.dispatch(loginUser(response.data));
      toast.success('logged in successfully');
      return redirect('/');
    } catch (error) {
      const errorMessage =
        error?.response?.data?.error?.message ||
        'please double check your credentials';
      toast.error(errorMessage);
      return null;
    }
  };

const Login = () => {
  const [forgot, setForgot] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1); // 1 = request OTP, 2 = reset password

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    try {
      if (step === 1) {
        const response = await customFetch.post('/auth/forgot-password', { identifier });
        toast.success('OTP sent!');
        console.log('OTP for testing:', response.data.otp); // dev/testing only
        setStep(2);
      } else if (step === 2) {
        await customFetch.post('/auth/reset-password', {

          identifier,
          otp,
          newPassword,
        });
        toast.success('Password reset successfully');
        setForgot(false);
        setStep(1);
        setIdentifier('');
        setOtp('');
        setNewPassword('');
      }
    } catch (error) {
      const msg = error?.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    }
  };

  return (
    <section className='h-screen grid place-items-center'>
      {!forgot ? (
        <Form
          method='post'
          className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'
        >
          <h4 className='text-center text-3xl font-bold'>Login</h4>
          <FormInput type='text' label='email/mobile' name='identifier' />
          <FormInput type='password' label='password' name='password' />
          <div className='mt-4'>
            <SubmitBtn text='login' />
          </div>

          <p className='text-center mt-2'>
            <button
              type='button'
              className='link link-hover link-primary'
              onClick={() => setForgot(true)}
            >
              Forgot Password?
            </button>
          </p>

          <p className='text-center'>
            Not a user yet?{' '}
            <Link
              to='/register'
              className='ml-2 link link-hover link-primary capitalize'
            >
              register
            </Link>
          </p>
        </Form>
      ) : (
        <form
          onSubmit={handleForgotSubmit}
          className='card w-96 p-8 bg-base-100 shadow-lg flex flex-col gap-y-4'
        >
          <h4 className='text-center text-2xl font-bold'>Forgot Password</h4>

          <input
            type='text'
            placeholder='Email or Mobile'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className='input input-bordered w-full'
            required
          />

          {step === 2 && (
            <>
              <input
                type='text'
                placeholder='OTP'
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className='input input-bordered w-full'
                required
              />
              <input
                type='password'
                placeholder='New Password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className='input input-bordered w-full'
                required
              />
            </>
          )}

          <div className='mt-4'>
            <button type='submit' className='btn btn-primary btn-block'>
              {step === 1 ? 'Send OTP' : 'Reset Password'}
            </button>
          </div>

          <p className='text-center mt-2'>
            <button
              type='button'
              className='link link-hover link-secondary'
              onClick={() => setForgot(false)}
            >
              Back to Login
            </button>
          </p>
        </form>
      )}
    </section>
  );
};

export default Login;
