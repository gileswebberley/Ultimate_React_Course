import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deposit, payLoan, requestLoan, withdraw } from './accountSlice';

function AccountOperations() {
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [loanAmount, setLoanAmount] = useState('');
  const [loanPurposeRequest, setLoanPurpose] = useState('');
  const [currency, setCurrency] = useState('USD');

  const dispatch = useDispatch();
  const { balance, loan, loanPurpose } = useSelector((store) => store.account);

  function handleDeposit() {
    if (!depositAmount) return;
    dispatch(deposit(depositAmount));
    setDepositAmount('');
  }

  function handleWithdrawal() {
    if (!withdrawalAmount) return;
    dispatch(withdraw(withdrawalAmount));
    setWithdrawalAmount('');
  }

  function handleRequestLoan() {
    if (!loanAmount || !loanPurposeRequest) return;
    dispatch(requestLoan(loanAmount, loanPurposeRequest));
    setLoanAmount('');
    setLoanPurpose('');
  }

  function handlePayLoan() {
    if (balance < loan) return;
    dispatch(payLoan());
  }

  return (
    <div>
      <h2>Your account operations</h2>
      <div className="inputs">
        <div>
          <label>Deposit</label>
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(+e.target.value)}
          />
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="USD">US Dollar</option>
            <option value="EUR">Euro</option>
            <option value="GBP">British Pound</option>
          </select>

          <button onClick={handleDeposit}>Deposit {depositAmount}</button>
        </div>

        <div>
          <label>Withdraw</label>
          <input
            type="number"
            value={withdrawalAmount}
            onChange={(e) => setWithdrawalAmount(+e.target.value)}
          />
          <button onClick={handleWithdrawal}>
            Withdraw {withdrawalAmount}
          </button>
        </div>

        {loan === 0 && (
          <div>
            <label>Request loan</label>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(+e.target.value)}
              placeholder="Loan amount"
            />
            <input
              value={loanPurposeRequest}
              onChange={(e) => setLoanPurpose(e.target.value)}
              placeholder="Loan purpose"
            />
            <button onClick={handleRequestLoan}>Request loan</button>
          </div>
        )}

        {loan !== 0 && (
          <div>
            <span>
              Pay back ${loan} ({loanPurpose}){' '}
            </span>
            <button onClick={handlePayLoan}>Pay loan</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AccountOperations;
