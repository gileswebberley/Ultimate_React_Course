const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: '',
};

const AccountActions = {
  DEPOSIT: 'account/deposit',
  WITHDRAW: 'account/withdraw',
  LOAN_REQUEST: 'account/requestLoan',
  LOAN_PAY: 'account/payLoan',
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    //action names should be it's domain then model what has or is happening
    case AccountActions.DEPOSIT:
      return { ...state, balance: state.balance + Number(action.payload) };

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

export function deposit(amount) {
  return { type: AccountActions.DEPOSIT, payload: amount };
}

export function withdraw(amount) {
  return { type: AccountActions.WITHDRAW, payload: amount };
}
