import { RouterProvider, createBrowserRouter, redirect } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  About,
  Cart,
  Checkout,
  Error,
  HomeLayout,
  Landing,
  Login,
  Orders,
  Products,
  Register,
  SingleProduct,
  Admin,
  AdminLogin,
  AdminRegister
} from './pages';

import { ErrorElement } from './components';
import { toast } from 'react-toastify';

// loaders
import { loader as landingLoader } from './pages/Landing';
import { loader as singleProductLoader } from './pages/SingleProduct';
import { loader as productsLoader } from './pages/Products';
import { loader as checkoutLoader } from './pages/Checkout';
import { loader as ordersLoader } from './pages/Orders';
// actions
import { action as registerAction } from './pages/Register';
import { action as loginAction } from './pages/Login';
import { action as adminLoginAction } from './pages/AdminLogin';
import { action as adminRegisterAction } from './pages/AdminRegister';
import { action as checkoutAction } from './components/CheckoutForm';
import { store } from './store';

const adminLoader = (store) => () => {
  const user = store.getState().userState.user;
  if (!user || user.role !== 'admin') {
    toast.warn('You must be an admin to access this page');
    return redirect('/admin/login');
  }
  return null;
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
        errorElement: <ErrorElement />,
        loader: landingLoader(queryClient),
      },
      {
        path: 'products',
        element: <Products />,
        errorElement: <ErrorElement />,
        loader: productsLoader(queryClient),
      },
      {
        path: 'products/:id',
        element: <SingleProduct />,
        errorElement: <ErrorElement />,
        loader: singleProductLoader(queryClient),
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'checkout',
        element: <Checkout />,
        loader: checkoutLoader(store),
        action: checkoutAction(store, queryClient),
      },
      {
        path: 'orders',
        element: <Orders />,
        loader: ordersLoader(store, queryClient),
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: '/register',
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
  {
    path: '/admin',
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Admin />,
        errorElement: <ErrorElement />,
        loader: adminLoader(store),
      },
      {
        path: 'login',
        element: <AdminLogin />,
        errorElement: <Error />,
        action: adminLoginAction(store),
      },
      {
        path: 'register',
        element: <AdminRegister />,
        errorElement: <Error />,
        action: adminRegisterAction,
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
};
export default App;
