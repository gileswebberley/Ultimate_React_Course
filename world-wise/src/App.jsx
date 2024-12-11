//All fixed import statements must be above the dynamic ones
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { CitiesContextProvider } from './Contexts/CitiesContext';
import { AuthProvider } from './Contexts/FakeAuthContext';
import CityList from './components/CityList';
import City from './components/City';
import CountriesList from './components/CountriesList';
import Form from './components/Form';
import ProtectedRoute from './pages/ProtectedRoute';
import SpinnerFullPage from './components/SpinnerFullPage';

/* We are going to use the lazy loading functionality of react and javascript to avoid such a large bundle having to be downloaded to the client when they first visit the app by loading the pages seperately
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
*/
const Product = lazy(() => import('./pages/Product'));
const Pricing = lazy(() => import('./pages/Pricing'));
const Homepage = lazy(() => import('./pages/Homepage'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const AppLayout = lazy(() => import('./pages/AppLayout'));
const Login = lazy(() => import('./pages/Login'));

function App() {
  //let's define our first routes 'in a declaritive way' within the jsx now we have installed react router into the project

  return (
    <div>
      {/* <p>
        This would appear on every page whereas the components inside the routes
        will appear according to the url
      </p> */}
      {/* Place all of the site inside our Context Provider so that we can access it from any of the components via useCitiesContext() hook */}
      <CitiesContextProvider>
        <AuthProvider>
          <BrowserRouter>
            {/* Now we wrap this to allow for the code splitting through dynamic imports */}
            <Suspense fallback={<SpinnerFullPage />}>
              <Routes>
                {/* Set up the homepage, or landing page as the basic url. We can do this by setting it as default by using the 'index route' */}
                <Route index element={<Homepage />} />
                {/* Now we set up for the url www.example.com/product as an example */}
                <Route path="product" element={<Product />} />
                <Route path="pricing" element={<Pricing />} />
                <Route path="login" element={<Login />} />
                {/* We have 'Nested Routes' in the app page, for the cities/countries/map functionality of the Sidebar component.
              To make sure you can't go to the app until you are logged in we've added this protective wrappper component */}
                <Route
                  path="app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  {/* We want cities to be the default when we have the simple [url]/app url in the browser so set that as the index as we have for the home page. Now to redirect we use the Navigate component with the 'replace' keyword rather than just the 'to' param so that the back button will still work (otherwise we go back to /app and the Navigate takes us to cities and so we get stuck in a history stack loop) */}
                  <Route index element={<Navigate replace to="cities" />} />
                  <Route path="cities" element={<CityList />} />
                  {/* In here we are going to start using params which are held within the url path, we do this by defining a parameter name by using the colon as below (be aware that the parameter should be the name of the property you are grabbing in <City> when we use useParams() hook in there */}
                  <Route path="cities/:id" element={<City />} />
                  <Route path="countries" element={<CountriesList />} />
                  <Route path="form" element={<Form />} />
                </Route>
                {/* Finally we can create a 404 not found page for any urls that don't match one of the routes we've set up */}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </CitiesContextProvider>
    </div>
  );
  //now we've got this basic structure set up we can go to each of the 'pages' (components) and use <Link> or <NavLink> (if we want the .active class added to the active page link) in place of the traditional <a href> inside our PageNav component
}

export default App;
