import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Homepage from './pages/Homepage';
import PageNotFound from './pages/PageNotFound';
import AppLayout from './pages/AppLayout';
import Login from './pages/Login';

function App() {
  //let's define our first routes 'in a declaritive way' within the jsx now we have installed react router into the project

  return (
    <div>
      {/* <p>
        This would appear on every page whereas the components inside the routes
        will appear according to the url
      </p> */}
      <BrowserRouter>
        <Routes>
          {/* Set up the homepage, or landing page as the basic url */}
          <Route path="/" element={<Homepage />} />
          {/* Now we set up for the url www.example.com/product as an example */}
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="login" element={<Login />} />
          <Route path="app" element={<AppLayout />} />
          {/* Finally we can create a 404 not found page for any urls that don't match one of the routes we've set up */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
  //now we've got this basic structure set up we can go to each of the 'pages' (components) and use <Link> or <NavLink> in place of the traditional <a href> inside our PageNav component
}

export default App;
