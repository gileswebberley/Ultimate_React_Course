//The new way of doing it with RTK
import { createSlice } from '@reduxjs/toolkit';
//We now don't have to write our own action creators, we remove the switch statements, and we can appear to mutate state directly (using the immer library)!!

const AccountActions = {
  DEPOSIT: 'account/deposit',
  WITHDRAW: 'account/withdraw',
  LOAN_REQUEST: 'account/requestLoan',
  LOAN_PAY: 'account/payLoan',
  CONVERTING: 'account/convertingCurrency',
};

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
  nativeCurrencyCode: 'GBP',
  isLoading: false,
};

//So we now produce our 'slice' like this...
const accountSlice = createSlice({
  name: 'account',
  initialState: initialStateAccount,
  //and now for the really fancy bit where we build our action creators directly and can seemingly mutate the state as we no longer need to return it in full (because RTK is 'very opinionated')
  reducers: {
    deposit(state, action) {
      //not using the api yet so just...
      state.balance += Number(action.payload);
      state.isLoading = false;
    },
    withdraw(state, action) {
      state.balance -= Number(action.payload);
    },
    //here we want our action creator to recieve more than one argument and so we must use the prepare method
    requestLoan: {
      prepare(amount, purpose) {
        //if you wanted to create any extra arguments to be passed on here is the place - for example in customerSlice we have the created date (which should not be done in the reducer/action creator itself)
        return { payload: { amount, purpose } };
      },

      reducer(state, action) {
        if (state.loan > 0) return; //no need to return state!
        state.loan = Number(action.payload.amount);
        state.loanPurpose = action.payload.purpose;
        state.balance += Number(action.payload.amount);
      },
    },
    payLoan(state) {
      //careful to place this line above resetting the loan
      state.balance -= state.loan;
      state.loan = initialStateAccount.loan;
      state.loanPurpose = initialStateAccount.loanPurpose;
    },
    convertingCurrency(state) {
      state.isLoading = true;
    },
  },
});

//console.log(accountSlice);

//now destructure the actions object to name export the action creators
export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

//We'll use our old Thunk solution instead of exporting the deposit action to avoid the more complex RTK way of using createAsyncThunk - careful to name the type correctly ie 'name/action' (another good reason for the fake enum)
export function deposit(
  amount,
  currency = initialStateAccount.nativeCurrencyCode
) {
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
//default export our reducer
export default accountSlice.reducer;
