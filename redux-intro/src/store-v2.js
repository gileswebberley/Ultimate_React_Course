//legacy thing because it is old fashioned, now use redux toolkit
import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from 'redux';
//implement the middleware for asyncronous state changing (with Thunk)
import { thunk } from 'redux-thunk';
//get our redux devtools chrome extension working
import { composeWithDevTools } from 'redux-devtools-extension';

import accountReducer from './features/accounts/accountSlice';
import customerReducer from './features/customers/customerSlice';

//now we have two reducer functions, and indeed two state contexts, we use redux to produce a root reducer which we can pass to our store
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

//here we are implementing Thunk and DevTools with the additional argument
const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
