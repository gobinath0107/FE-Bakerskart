const About = () => {
  return (
    <>
      <div className='flex flex-wrap gap-2 sm:gap-x-6 items-center justify-center'>
        <h1 className='text-4xl font-bold leading-none tracking-tight sm:text-6xl'>
         Welcome to 
        </h1>
        <div className='stats bg-primary shadow'>
          <div className='stat'>
            <div className='stat-title text-primary-content text-4xl font-bold tracking-widest'>
              Bakerskart
            </div>
          </div>
        </div>
      </div>
      <p className='mt-6 text-lg leading-8 max-w-2xl mx-auto'>
        Bakerskart is your one-stop destination for all baking essentials. We provide everything you need to create perfect cakes, pastries, and desserts – from high-quality flours, baking ingredients, and cake mixes to cake molds, decorating tools, and packaging materials.

Our collection also includes celebration must-haves such as candles, toppers, snow sprays, and other party accessories. Whether you are a professional baker or a home baking enthusiast, we make it easy to find all the right products in one place.

At Bakerskart, our goal is simple – to support your baking journey with quality products, reliable service, and affordable prices. We’re here to make every bake and every celebration special.
      </p>
    </>
  );
};
export default About;
