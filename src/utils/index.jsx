import axios from 'axios';
import { logoutUser } from '../features/user/userSlice';
import { store } from '../store';

// const productionUrl = ' https://strapi-store-server.onrender.com/api';
// export const productionUrl = import.meta.env.MODE === "development" ?  'http://localhost:5000/api/v1' : 'https://be-bakerskart-production.up.railway.app/api/v1';
export const productionUrl = import.meta.env.MODE === "development" ?  'http://localhost:5000/api/v1' : 'https://colorful-daisey-bakerskart-ecec7df9.koyeb.app/api/v1';


export const customFetch = axios.create({
  baseURL: productionUrl,
});

customFetch.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      store.dispatch(logoutUser());
      // You might want to redirect to the login page here
      // Example: window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export const formatPrice = (price) => {
   const numPrice = Number(price) || 0; // ensure it's always a number
  // const dollarsAmount = new Intl.NumberFormat('en-US', {
  //   style: 'currency',
  //   currency: 'USD',
  // }).format((price / 100).toFixed(2));
const dollarsAmount = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
}).format(numPrice.toFixed(2));
  return dollarsAmount;
};

export const generateAmountOptions = (number) => {
  return Array.from({ length: number }, (_, index) => {
    const amount = index + 1;
    return (
      <option key={amount} value={amount}>
        {amount}
      </option>
    );
  });
};
