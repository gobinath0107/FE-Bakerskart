import { Form, redirect } from "react-router-dom";
import FormInput from "./FormInput";
import SubmitBtn from "./SubmitBtn";
import { customFetch, formatPrice } from "../utils";
import { toast } from "react-toastify";
import { clearCart } from "../features/cart/cartSlice";
import { useSelector } from "react-redux";
import { useState,useEffect } from "react";

export const action =
  (store, queryClient) =>
  async ({ request }) => {
    const formData = await request.formData();
    const { name, address, city, state, company } =
      Object.fromEntries(formData);
    const user = store.getState().userState.user;
    const { cartItems, orderTotal, numItemsInCart } =
      store.getState().cartState;

    // Map cartItems to match backend schema
    const mappedCartItems = cartItems.map((item) => ({
      productId: item.productID,
      amount: item.amount,
      price: item.price,
      name: item.title,
      image: item.image,
    }));

    const info = {
      name,
      address,
      city,
      state,
      company,
      chargeTotal: orderTotal,
      orderTotal: formatPrice(orderTotal),
      cartItems: mappedCartItems,
      numItemsInCart,
    };

    try {
      await customFetch.post(
        "/orders",
        { data: info },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      queryClient.removeQueries(["orders"]);
      store.dispatch(clearCart());
      toast.success("order placed successfully");
      return redirect("/orders");
    } catch (error) {
      console.log(error);
      const errorMessage =
        error?.response?.data?.error?.message ||
        "there was an error placing your order";
      toast.error(errorMessage);
      if ([401, 403].includes(error?.response?.status)) {
        return redirect("/login");
      }
      return null;
    }
  };

const CheckoutForm = () => {
    const user = useSelector((state) => state.userState.user);
  const [userInfo, setUserInfo] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    company: "",
  });

  useEffect(() => {
    if (user) {
      setUserInfo({
        name: user.username || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        company: user.company || "",
      });
    }
  }, [user]);
  return (
    <Form method="POST" className="flex flex-col gap-y-4">
      <h4 className="font-medium text-xl capitalize">shipping information</h4>
      <FormInput label="name" name="name" type="text" defaultValue={userInfo.name} />
      <FormInput label="address" name="address" type="text" defaultValue={userInfo.address} />
      <FormInput label="city" name="city" type="text" defaultValue={userInfo.city} />
      <FormInput label="state" name="state" type="text" defaultValue={userInfo.state} />
      <FormInput label="company" name="company" type="text" defaultValue={userInfo.company} />
      <div className="mt-4">
        <SubmitBtn text="place your order" />
      </div>
    </Form>
  );
};
export default CheckoutForm;
