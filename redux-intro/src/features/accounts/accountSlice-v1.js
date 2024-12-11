import { type } from '@testing-library/user-event/dist/type';

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  nativeCurrencyCode: 'GBP',
  isLoading: false,
};

const AccountActions = {
  DEPOSIT: 'account/deposit',
  WITHDRAW: 'account/withdraw',
  LOAN_REQUEST: 'account/requestLoan',
  LOAN_PAY: 'account/payLoan',
  CONVERTING: 'account/convertingCurrency',
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    //action names should be it's domain then model what has or is happening
    case AccountActions.DEPOSIT:
      //console.log(`DEPOSIT: ${action.payload}`);
      return {
        ...state,
        balance: state.balance + Number(action.payload),
        isLoading: false,
      };

    case AccountActions.WITHDRAW:
      return { ...state, balance: state.balance - Number(action.payload) };

    case AccountActions.LOAN_REQUEST:
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: Number(action.payload.amount),
        loanPurpose: action.payload.purpose,
        balance: state.balance + Number(action.payload.amount),
      };

    case AccountActions.LOAN_PAY:
      return {
        ...state,
        loan: initialStateAccount.loan,
        loanPurpose: initialStateAccount.loanPurpose,
        balance: state.balance - state.loan,
      };

    case AccountActions.CONVERTING:
      return { ...state, isLoading: true };

    default:
      //in Redux it's recommended that you do not throw an error
      //console.log('account reducer called with undefined action type');
      return state;
  }
}

//a useful convention is to use action creators, an example for the loan -
export function requestLoan(amount, purpose) {
  return {
    type: AccountActions.LOAN_REQUEST,
    payload: { amount, purpose },
  };
}

export function payLoan() {
  return { type: AccountActions.LOAN_PAY };
}

//We are going to implement our use of THUNK by returning a function if we need to call the currency conversion API instead of the dispatchable object
export function deposit(amount, currency) {
  //If the currency is the native currency work as before
  if (currency === initialStateAccount.nativeCurrencyCode)
    return { type: AccountActions.DEPOSIT, payload: amount };

  //otherwise we automagically call the THUNK middleware with an async function that does it's own dispatch when data arrives
  return async function (dispatch, getState) {
    dispatch({ type: AccountActions.CONVERTING });
    //call the API (frankfurter.dev)
    const res = await fetch(
      `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=${initialStateAccount.nativeCurrencyCode}`
    );
    const data = await res.json();
    const converted = (
      amount * data.rates[initialStateAccount.nativeCurrencyCode]
    ).toFixed(2);
    //now dispatch the action
    dispatch({ type: AccountActions.DEPOSIT, payload: converted });
  };
}

export function withdraw(amount) {
  return { type: AccountActions.WITHDRAW, payload: amount };
}
