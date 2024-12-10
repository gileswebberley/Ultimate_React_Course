//legacy thing because it is old fashioned, now use redux toolkit
import { combineReducers, legacy_createStore as createStore } from 'redux';
import accountReducer from './features/accounts/accountSlice';
import customerReducer from './features/customers/customerSlice';
//introduction to Redux

//Now use the Redux functionality (npm i redux)
//const store = createStore(accountReducer);

//now we have two reducer functions, and indeed two state contexts, we use redux to produce a root reducer which we can pass to our store
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(rootReducer);

export default store;

//now we can use dispatch just like in useReducer on the store object, we also have getState()
//just as a few examples we import this file into index.js
// store.dispatch({
//   type: 'account/requestLoan',
//   payload: { amount: 1000, purpose: 'For fun things' },
// });
// store.dispatch({ type: 'account/deposit', payload: 400 });
// console.log(store.getState());

// store.dispatch(requestLoan(1000, 'Test'));
// console.log(store.getState());

// store.dispatch(createCustomer('Giles Webberley', '123456'));
// console.log(store.getState());
