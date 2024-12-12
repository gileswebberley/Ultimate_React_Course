//We are using react-router v6+ which provides us with the Browser Router which should be setup outside of the react tree with a statically defined set of routes. This type of router allows us to use the data fetching capabilities (loaders, actions, fetchers, and more)

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './ui/Home';
import Menu from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';

//Let's build out our Routes in an imperative way, unlike in our WorldWise app, so that we can do data loading in this way
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/menu',
    element: <Menu />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/order/new',
    element: <CreateOrder />,
  },
  {
    path: '/order/:orderId',
    element: <Order />,
  },
]);

//Now we're going to create a layout that will work with phone screens or browsers on a pc

function App() {
  //Now we can inject our router into our SPA by doing the following
  return <RouterProvider router={router} />;
}

export default App;
