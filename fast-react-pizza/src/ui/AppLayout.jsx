import { Outlet, useNavigation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import LoaderScreen from './LoaderScreen';

//See App for the Routes that are placed in the Outlet component
//This is the Parent Route, so each page will have the Header and Footer
function AppLayout() {
  //to find out what loading state the whole site is in (not specific actions where we have previously implememented an isLoading)
  const navigation = useNavigation(); //not useNavigate!!
  const isLoading = navigation.state === 'loading';
  return (
    <div className="layout">
      {isLoading && <LoaderScreen />}
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
