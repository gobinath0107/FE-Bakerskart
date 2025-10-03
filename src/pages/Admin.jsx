import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../features/user/userSlice';
import { toast } from 'react-toastify';

const Admin = () => {
  const admin = useSelector((state) => state.userState.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutAdmin());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <div className="flex items-center">
          <p className="mr-4">Welcome, {admin.username}!</p>
          <Link to="/profile" className="btn btn-primary mr-4">
            Profile
          </Link>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <p>This is the admin dashboard. You can add more components and functionality here.</p>
    </div>
  );
};

export default Admin;
