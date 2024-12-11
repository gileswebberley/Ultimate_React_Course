//legacy thing because it is old fashioned, now use redux toolkit
import { combineReducers, legacy_createStore as createStore } from 'redux';

//introduction to Redux
const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
};

const initialStateCustomer = {
  fullName: '',
  nationalID: '',
  createdAt: '',
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    //action names should be it's domain then model what has or is happening
    case 'account/deposit':
      return { ...state, balance: state.balance + action.payload };

    case 'account/withdraw':
      return { ...state, balance: state.balance - action.payload };

    case 'account/requestLoan':
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };

    case 'account/payLoan':
      return {
        ...state,
        loan: initialStateAccount.loan,
        loanPurpose: initialStateAccount.loanPurpose,
        balance: state.balance - state.loan,
      };

    default:
      //in Redux it's recommended that you do not throw an error
      console.log('store reducer called with undefined action type');
      return state;
  }
}

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case 'customer/createCustomer':
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case 'customer/changeName':
      return { ...state, fullName: action.payload };
    default:
      console.log('customer reducer called with undefined action type');
      return state;
  }
}

//Now use the Redux functionality (npm i redux)
//const store = createStore(accountReducer);

//now we have two reducer functions, and indeed two state contexts, we use redux to produce a root reducer which we can pass to our store
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});
const store = createStore(rootReducer);

//now we can use dispatch just like in useReducer on the store object, we also have getState()
//just as a few examples we import this file into index.js
// store.dispatch({
//   type: 'account/requestLoan',
//   payload: { amount: 1000, purpose: 'For fun things' },
// });
store.dispatch({ type: 'account/deposit', payload: 400 });
console.log(store.getState());

//a useful convention is to use action creators, an example for the loan -
function requestLoan(amount, purpose) {
  return {
    type: 'account/requestLoan',
    payload: { amount, purpose },
  };
}

store.dispatch(requestLoan(1000, 'Test'));
console.log(store.getState());

function createCustomer(fullName, nationalID) {
  return {
    type: 'customer/createCustomer',
    payload: { fullName, nationalID, createdAt: new Date().toISOString() },
  };
}
function changeName(fullName) {
  return { type: 'customer/changeName', payload: fullName };
}

store.dispatch(createCustomer('Giles Webberley', '123456'));
console.log(store.getState());
