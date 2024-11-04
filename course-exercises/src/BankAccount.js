import { useReducer } from 'react';

const initialState = {
  balance: 0,
  loan: 0,
  isActive: false,
  status: '',
};

function reducer(state, action) {
  switch (action.type) {
    case 'open':
      return { ...state, isActive: true, balance: 500 };

    case 'deposit':
      return { ...state, balance: state.balance + action.payload };

    case 'withdraw':
      return { ...state, balance: state.balance - action.payload };

    case 'loan-request':
      if (state.loan > 0) return { ...state };
      else
        return {
          ...state,
          loan: state.loan + action.payload,
          balance: state.balance + action.payload,
        };

    case 'loan-payment':
      return {
        ...state,
        loan: state.loan - action.payload,
        balance: state.balance - action.payload,
      };

    case 'close':
      if (state.balance !== 0 || state.loan !== 0) {
        console.log('Cannot close account without zero balances');
        return { ...state };
      } else {
        return { ...initialState };
      }

    default:
      throw new Error('Action not supported by reducer function');
  }
}

function BankAccount() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );
  return (
    <div className="banking">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>

      <p>
        <button
          onClick={() => {
            dispatch({ type: 'open' });
          }}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: 'deposit', payload: 150 });
          }}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: 'withdraw', payload: 50 });
          }}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: 'loan-request', payload: 5000 });
          }}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: 'loan-payment', payload: 5000 });
          }}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => {
            dispatch({ type: 'close' });
          }}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}

export default BankAccount;
