import { Outlet, useNavigation } from 'react-router-dom';
import { Header, Navbar, Loading, Footer } from '../components';
const HomeLayout = () => {
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  return (
     <div className="flex flex-col min-h-screen">
      <Header />
      <Navbar />

      <main className="flex-grow">
      {isPageLoading ? (
        <Loading />
      ) : (
        <section className='align-element py-20'>
          <Outlet />
        </section>
      )}
      </main>
      <Footer/>
    </div>
  );
};
export default HomeLayout;
