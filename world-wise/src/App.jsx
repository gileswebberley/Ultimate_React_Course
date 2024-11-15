import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';
import CityList from './components/CityList';
import CountriesList from './components/CountriesList';

function App() {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const res = await fetch('http://localhost:9000/cities');
        const data = await res.json();
        setCities(data);
      } catch (err) {
        console.log('Error loading cities data: ' + err.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCities();
  }, []);

  //let's define our first routes 'in a declaritive way' within the jsx now we have installed react router into the project

  return (
    <div>
      {/* <p>
        This would appear on every page whereas the components inside the routes
        will appear according to the url
      </p> */}
      <BrowserRouter>
        <Routes>
          {/* Set up the homepage, or landing page as the basic url. We can do this by setting it as default by using the 'index route' */}
          <Route index element={<Homepage />} />
          {/* Now we set up for the url www.example.com/product as an example */}
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<Login />} />
          {/* We have 'Nested Routes' in the app page, for the cities/countries/map functionality of the Sidebar component */}
          <Route path="app" element={<AppLayout />}>
            {/* We want cities to be the default when we have the simple [url]/app url in the browser so set that as the index as we have for the home page */}
            <Route
              index
              element={<CityList cities={cities} isLoading={isLoading} />}
            />
            <Route
              path="cities"
              element={<CityList cities={cities} isLoading={isLoading} />}
            />
            <Route
              path="countries"
              element={<CountriesList cities={cities} isLoading={isLoading} />}
            />
            <Route path="form" element={<p>Form</p>} />
          </Route>
          {/* Finally we can create a 404 not found page for any urls that don't match one of the routes we've set up */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
  //now we've got this basic structure set up we can go to each of the 'pages' (components) and use <Link> or <NavLink> (if we want the .active class added to the active page link) in place of the traditional <a href> inside our PageNav component
}

export default App;
