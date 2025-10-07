import { formatPrice } from '../utils';

const OrderCartItem = ({ item }) => {
  const { name, price, amount, image, company } = item;

  return (
    <article className="mb-4 flex flex-col gap-y-4 sm:flex-row flex-wrap border-b border-base-300 pb-4 last:border-b-0">
      {/* IMAGE */}
      <img
        src={image}
        alt={name}
        className="h-24 w-24 rounded-lg sm:h-32 sm:w-32 object-cover"
      />

      {/* INFO */}
      <div className="sm:ml-16 sm:w-48">
        <h3 className="capitalize font-medium">{name}</h3>
        <h4 className="mt-2 capitalize text-sm text-neutral-content">{company}</h4>
        <p className="mt-2 text-sm">Qty: {amount}</p>
      </div>

      {/* PRICE */}
      <p className="font-medium sm:ml-auto mt-2 sm:mt-0">{formatPrice(price)}</p>
    </article>
  );
};

export default OrderCartItem;
