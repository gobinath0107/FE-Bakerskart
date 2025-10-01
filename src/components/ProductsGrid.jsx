import { Link, useLoaderData } from 'react-router-dom';
import { formatPrice } from '../utils';

const ProductsGrid = () => {
  const { products } = useLoaderData();

  return (
    <div className='pt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
      {products.map((product) => {
        const { title, price, image1, sellingPrice } = product
        const { url } = image1
        const rupeeAmount = formatPrice(price);
        const rupeeSellingPrice = formatPrice(sellingPrice);
        return (
          <Link
            key={product._id}
            to={`/products/${product._id}`}
            className='card w-full shadow-xl hover:shadow-2xl transition duration-300'
          >
            <figure className='px-4 pt-4'>
              <img
                src={url}
                alt={title}
                className='rounded-xl h-64 md:h-48 w-full object-cover'
              />
            </figure>
            <div className='card-body items-center text-center'>
              <h2 className='card-title capitalize tracking-wider'>{title}</h2>
              <span className='text-secondary line-through'>{rupeeAmount}</span>
              <span className='text-secondary'>{rupeeSellingPrice}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
};
export default ProductsGrid;
