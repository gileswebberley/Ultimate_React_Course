import { useState } from 'react';

//--------------------------------------------------------------------
//The Tip Calculator Challenge -----------------------------------------------
export function TipChallenge() {
  const [tipOne, setTipOne] = useState(0);
  const [tipTwo, setTipTwo] = useState(0);
  const [billAmount, setBillAmount] = useState('');

  const totalTip = (((tipOne + tipTwo) / 2) * Number(billAmount)).toFixed(2);

  function resetTip() {
    setTipOne(0);
    setTipTwo(0);
    setBillAmount('');
  }

  return (
    <div>
      <BillAmount onSetBillAmount={setBillAmount} bill={billAmount} />
      <TipJudge onTipSelect={setTipOne} tipSelected={tipOne}>
        What tip would you like to give?{' '}
      </TipJudge>
      <TipJudge onTipSelect={setTipTwo} tipSelected={tipTwo}>
        What tip would your friend like to give?{' '}
      </TipJudge>
      {billAmount > 0 && (
        <>
          <TipCalculator amount={billAmount} tip={totalTip} />
          <TipReset onTipReset={resetTip} />
        </>
      )}
    </div>
  );
}
function BillAmount({ onSetBillAmount, bill }) {
  return (
    <div style={{ color: '#000', fontFamily: 'sans - serif' }}>
      <label>Enter the bill amount: </label>
      <input
        type="text"
        placeholder="enter bill total"
        value={bill}
        onChange={(e) => onSetBillAmount(Number(e.target.value))}
      ></input>
    </div>
  );
}
function TipJudge({ children, onTipSelect, tipSelected }) {
  return (
    <div style={{ color: '#000', fontFamily: 'sans - serif' }}>
      <span>{children} </span>
      <select
        value={tipSelected}
        onChange={(e) => onTipSelect(Number(e.target.value))}
      >
        <option value={0}>Really Poor</option>
        <option value={0.05}>Quite Good</option>
        <option value={0.1}>Very Good</option>
        <option value={0.2}>Amazing</option>
      </select>
    </div>
  );
}
function TipCalculator({ amount, tip }) {
  return (
    <h3 style={{ color: '#000', fontFamily: 'sans - serif' }}>
      You pay £{(Number(amount) + Number(tip)).toFixed(2)} (£{amount} + £{tip})
    </h3>
  );
}
function TipReset({ onTipReset }) {
  return (
    <div>
      <button type="reset" onClick={onTipReset}>
        Reset
      </button>
    </div>
  );
}
