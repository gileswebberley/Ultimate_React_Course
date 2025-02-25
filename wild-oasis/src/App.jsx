import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//now let's setup react-query, a bit like setup for Redux or ContextAPI
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import toast, { Toaster } from 'react-hot-toast';

import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Bookings from './pages/Bookings';
import Cabins from './pages/Cabins';
import Login from './pages/Login';
import PageNotFound from './pages/PageNotFound';
import Settings from './pages/Settings';
import Users from './pages/Users';
import GlobalStyles from './styles/GlobalStyles';
import AppLayout from './ui/AppLayout';
import Booking from './pages/Booking';
import Checkin from './pages/Checkin';
import ProtectedRoute from './ui/ProtectedRoute';

//now let's continue the setup of react-query
const queryClient = new QueryClient({
  //recommended error handling
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (query.state.data !== undefined) {
        toast.error(
          `Something went wrong with data-fetching: ${error.message}`
        );
      }
    },
  }),
  defaultOptions: {
    queries: {
      //amount of time before data is refetched
      staleTime: 2000,
    },
  },
});

function App() {
  //as we are not using the data loading features of React-Router we'll go back to the declaritive style of route setup (like in world-wise rather than the fast-react-pizza)
  return (
    <>
      {/* Just like with other state management libraries we'll wrap the whole application in our new React(Tanstack)-Query query client */}
      <QueryClientProvider client={queryClient}>
        {/* Also, we've now npm installed the devtools so we can add it as a sibling component (this creates a little icon on our page which we can click to open) */}
        <ReactQueryDevtools initialIsOpen={false} />
        {/* add our styles as a sibling component to our routes so it's available throughout the application */}
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            {/* We're going to wrap these routes in a protected one now that we have started to implement authentication */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="bookings/:bookingId" element={<Booking />} />
              <Route path="checkin/:bookingId" element={<Checkin />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        {/* For the more attractive notifications we have installed react-hot-toast package */}
        <Toaster
          position="top-center"
          gutter={8}
          containerStyle={{ margin: '8px' }}
          toastOptions={{
            success: {
              duration: 5000,
              style: {
                backgroundColor: 'var(--color-green-700)',
                color: 'var(--color-grey-50)',
              },
            },
            error: {
              duration: 5000,
              style: {
                backgroundColor: 'var(--color-red-800)',
                color: 'var(--color-grey-50)',
              },
            },
            style: {
              fontSize: '16px',
              maxWidth: '400px',
              padding: '16px 24px',
              backgroundColor: 'var(--color-grey-800)',
              color: 'var(--color-grey-50)',
            },
          }}
        />
      </QueryClientProvider>
    </>
  );
}

export default App;
