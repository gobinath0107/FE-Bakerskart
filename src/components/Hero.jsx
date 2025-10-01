import { Link } from 'react-router-dom';

import hero1 from '../assets/design.png';
import hero2 from '../assets/design1.png';
import hero3 from '../assets/design2.png';

const carouselImages = [hero1, hero2, hero3];

const Hero = () => {
  return (
    <div className='grid lg:grid-cols-2 gap-24 items-center'>
      <div>
        <h1 className='max-w-2xl text-4xl font-bold tracking-tight sm:text-6xl'>
          UNLEASH YOUR CULINARY CREATIVITY!
        </h1>
        <p className='mt-8 max-w-xl text-lg leading-8'>
          Explore a wide range of bakery supplies at BakersKart. Let our suggestions guide you to find the ideal ingredients and tools for an enhanced baking experience.
        </p>
        <div className='mt-10'>
          <Link to='/products' className='btn btn-primary'>
            Our Products
          </Link>
        </div>
      </div>
      <div className='hidden h-[28rem] lg:carousel carousel-center p-4 space-x-4 bg-neutral rounded-box '>
        {carouselImages.map((image) => {
          return (
            <div key={image} className='carousel-item'>
              <img
                src={image}
                className='rounded-box h-full w-80 object-cover'
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default Hero;
