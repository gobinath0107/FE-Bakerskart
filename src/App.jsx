import {
  RouterProvider,
  createBrowserRouter,
  redirect,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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
  SingleOrder,
  Admins,
  AdminLogin,
  AdminRegister,
  DashboardLayout,
  AdminCreate,
  AdminEdit,
  AdminUser,
  AdminUserCreate,
  AdminUserEdit,
  AdminProducts,
  AdminProductsCreate,
  AdminProductsEdit,
  AdminOrder,
  AdminOrderEdit,
  AdminCategory,
  AdminCategoryEdit,
  AdminCategoryCreate
} from "./pages";

import { ErrorElement } from "./components";
import { toast } from "react-toastify";

// loaders
import { loader as landingLoader } from "./pages/Landing";
import { loader as singleProductLoader } from "./pages/SingleProduct";
import { loader as productsLoader } from "./pages/Products";
import { loader as checkoutLoader } from "./pages/Checkout";
import { loader as ordersLoader } from "./pages/Orders";
import { loader as singleOrderLoader } from './pages/SingleOrder'
import { loader as adminsLoader } from "./pages/Admins";
import { loader as adminEditLoader } from "./pages/AdminEdit";
import { loader as adminUserLoader } from "./pages/AdminUser";
import { loader as adminUserEditLoader } from "./pages/AdminUserEdit";
import { loader as adminProductsLoader } from "./pages/AdminProducts";
import { loader as adminCategoriesLoader } from "./pages/AdminProductsCreate";
import { loader as adminProductsEditLoader } from "./pages/AdminProductsEdit";
import { loader as adminOrderLoader } from './pages/AdminOrders'
import { loader as adminOrderEditLoader } from './pages/AdminOrdersEdit'
import { loader as adminCategoryLoader } from './pages/AdminCategory'
import { loader as adminCategoryEditLoader } from './pages/AdminCategoryEdit'
// actions
import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { action as adminLoginAction } from "./pages/AdminLogin";
import { action as adminRegisterAction } from "./pages/AdminRegister";
import { action as checkoutAction } from "./components/CheckoutForm";
import { action as adminCreateAction } from "./pages/AdminCreate";
import { action as adminEditAction } from "./pages/AdminEdit";
import { action as adminUserEditAction } from "./pages/AdminUserEdit";
import { action as adminUserCreateAction } from "./pages/AdminUserCreate";
import { action as adminProductsCreateAction } from "./pages/AdminProductsCreate";
import { action as adminProductsEditAction } from "./pages/AdminProductsEdit";
import { action as adminOrderEditAction } from './pages/AdminOrdersEdit'
import { action as adminCategoryEditAction } from './pages/AdminCategoryEdit'
import { action as adminCategoryCreateAction } from './pages/AdminCategoryCreate'
import { store } from "./store";

const adminLoader = (store) => () => {
  const admin = store.getState().userState.admin;
    // valid roles that can access dashboard
  const allowedRoles = ["staff", "superadmin", "admin"];
  if (!admin || !allowedRoles.includes(admin.role)) {
    toast.warn("You must be an admin to access this page");
    return redirect("/admin/login");
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
    path: "/",
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
        path: "products",
        element: <Products />,
        errorElement: <ErrorElement />,
        loader: productsLoader(queryClient),
      },
      {
        path: "products/:id",
        element: <SingleProduct />,
        errorElement: <ErrorElement />,
        loader: singleProductLoader(queryClient),
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "checkout",
        element: <Checkout />,
        loader: checkoutLoader(store),
        action: checkoutAction(store, queryClient),
      },
      {
        path: "orders",
        element: <Orders />,
        loader: ordersLoader(store, queryClient),
      },
      {
        path: "orders/:id",
        element: <SingleOrder />,
        errorElement: <ErrorElement />,
        loader: singleOrderLoader(store,queryClient)
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
    action: loginAction(store),
  },
  {
    path: "/register",
    element: <Register />,
    errorElement: <Error />,
    action: registerAction,
  },
    {
    path: "/admin/login",
    element: <AdminLogin />,
    action: adminLoginAction(store),
  },
  {
    path: "/admin/register",
    element: <AdminRegister />,
    action: adminRegisterAction,
  },
  {
    path: "/admin",
    errorElement: <Error />,
    element: <DashboardLayout />,
    loader: adminLoader(store),
    children: [
      {
        path: "admins",
        element: <Admins />,
        loader: adminsLoader(queryClient),
        errorElement: <ErrorElement />,
      },
      {
        path: "admins/create",
        element: <AdminCreate />,
        action: adminCreateAction(queryClient),
      },
      {
        path: "admins/edit/:id",
        element: <AdminEdit />,
        loader: adminEditLoader(queryClient),
        action: adminEditAction(queryClient),
        errorElement: <ErrorElement />,
      },
      {
        path: "users",
        element: <AdminUser />,
        errorElement: <ErrorElement />,
        loader: adminUserLoader(queryClient),
      },
      {
        path: "users/create",
        element: <AdminUserCreate />,
        action: adminUserCreateAction(queryClient),
        errorElement: <ErrorElement />,
      },
      {
        path: "users/edit/:id",
        element: <AdminUserEdit />,
        loader: adminUserEditLoader(queryClient),
        action: adminUserEditAction(queryClient),
        errorElement: <ErrorElement />,
      },
      {
        path: "products",
        element: <AdminProducts />,
        errorElement: <ErrorElement />,
        loader: adminProductsLoader(queryClient),
      },
      {
        path: "products/create",
        element: <AdminProductsCreate />,
        errorElement: <ErrorElement />,
        loader: adminCategoriesLoader,
        action: adminProductsCreateAction(queryClient),
      },
      {
        path: "products/edit/:id",
        element: <AdminProductsEdit />,
        errorElement: <ErrorElement />,
        loader: adminProductsEditLoader(queryClient),
        action: adminProductsEditAction(queryClient),
      },
      {
        path: "orders",
        element: <AdminOrder />,
        errorElement: <ErrorElement />,
        loader: adminOrderLoader(store,queryClient)
      },
      {
        path: "orders/edit/:id",
        element: <AdminOrderEdit />,
        errorElement: <ErrorElement />,
        loader: adminOrderEditLoader(queryClient),
        action: adminOrderEditAction(queryClient)
      },
      {
        path: "category",
        element: <AdminCategory />,
        errorElement: <ErrorElement />,
        loader: adminCategoryLoader(queryClient)
      },
      {
        path: "category/edit/:id",
        element: <AdminCategoryEdit />,
        errorElement: <ErrorElement />,
        loader: adminCategoryEditLoader(queryClient),
        action: adminCategoryEditAction(queryClient)
      },
      {
        path: "category/create",
        element: <AdminCategoryCreate />,
        errorElement: <ErrorElement />,
        action: adminCategoryCreateAction(queryClient)
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
