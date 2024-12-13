//We are using react-router v6+ which provides us with the Browser Router which should be setup outside of the react tree with a statically defined set of routes. This type of router allows us to use the data fetching capabilities (loaders, actions, fetchers, and more)

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './ui/Home';
//now import our loader for the menu as well
import Menu, { loader as menuLoader } from './features/menu/Menu';
import Cart from './features/cart/Cart';
import CreateOrder from './features/order/CreateOrder';
import Order from './features/order/Order';
import AppLayout from './ui/AppLayout';

import Error from './ui/Error';
//Let's build out our Routes in an imperative way, unlike in our WorldWise app, so that we can do data loading in this way
const router = createBrowserRouter(
  //Now we're going to create a layout that will work with phone screens or browsers on a pc in the AppLayout component, then make our routes children
  [
    {
      //layout route so no path
      element: <AppLayout />,
      //browser router also catches errors and you can define a component to be shown if that occurs (see Error component for how to get the message)
      errorElement: <Error />,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: '/menu',
          element: <Menu />,
          //loader function defined and exported from Menu.js
          loader: menuLoader,
          //our overall error handler does not sit within the layout because it is at the parent level so let's catch those more local errors here and stop it bubbling-up
          errorElement: <Error />,
        },
        {
          path: '/cart',
          element: <Cart />,
          errorElement: <Error />,
        },
        {
          path: '/order/new',
          element: <CreateOrder />,
          errorElement: <Error />,
        },
        {
          path: '/order/:orderId',
          element: <Order />,
          errorElement: <Error />,
        },
      ],
    },
  ]
);

function App() {
  //Now we can inject our router into our SPA by doing the following
  return <RouterProvider router={router} />;
}

export default App;
