//replace the createStore with the new RTK alternative that automatically sets up Thunk and DevTools and also wraps the createStore
import { configureStore } from '@reduxjs/toolkit';

import accountReducer from './features/accounts/accountSlice';
import customerReducer from './features/customers/customerSlice';

//Now with the RTK we set up our store like so
const store = configureStore({
  reducer: {
    account: accountReducer,
    customer: customerReducer,
  },
});
//this leads to it all working as before even with the old style other parts of the process

export default store;
