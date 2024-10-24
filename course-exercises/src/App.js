import { useState } from 'react';
import { useEffect } from 'react';
import TextExpanderApp from './TextExpanderApp';
import StarRating from './StarRating';

//CURRENCY CONVERTER ----------------------------------------------
// `https://api.frankfurter.app/latest?amount=100&from=EUR&to=USD`
const ConverterURL = 'https://api.frankfurter.app/latest?';

export default function App() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [amount, setAmount] = useState('100');
  const [outputAmount, setOutputAmount] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();
      async function convertCurrency() {
        console.log(
          `Search term is: ${ConverterURL}amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
        );
        try {
          const res = await fetch(
            `${ConverterURL}amount=${amount}&from=${fromCurrency}&to=${toCurrency}`,
            { signal: controller.signal }
          );
          const data = res?.ok ? await res.json() : {};
          setOutputAmount(data.rates[toCurrency]);
          console.log(`result from query is: ${JSON.stringify(data)}`);
        } catch (error) {
          console.log(error.message);
        } finally {
        }
      }
      if (amount !== '' && toCurrency !== fromCurrency) convertCurrency();
      else if (toCurrency === fromCurrency) setOutputAmount(amount);
      else setOutputAmount('');
      return () => {
        controller.abort();
      };
    },
    [fromCurrency, toCurrency, amount]
  );

  function testRating(rating) {
    console.log(rating);
  }

  return (
    <>
      <div>
        <div>
          <b>
            <u>Currency Converter</u>
          </b>
        </div>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <select
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="CAD">CAD</option>
          <option value="INR">INR</option>
        </select>
        <p>{`${amount} ${fromCurrency} = ${outputAmount} ${toCurrency}`}</p>
      </div>

      <div>
        <b>
          <u>Practice Counter</u>
        </b>
      </div>
      <PracticeCounter />
      <div>
        <b>
          <u>Tip Calculator</u>
        </b>
      </div>
      <TipChallenge />
      <div>
        <b>
          <u>Text Expander</u>
        </b>
      </div>
      <TextExpanderApp />
      <div>
        <b>
          <u>Star Rating</u>
        </b>
      </div>
      <div className="rating">
        <section>
          <StarRating
            maxRating={10}
            colour="#ff0000"
            size={16}
            onSetRating={testRating}
          />
        </section>
      </div>
    </>
  );
}
//-----------------------------------------------------------------------
//PRACTICE COUNTER FROM STEPS PROJECT

//Here I'll pop the coding challenge component
function PracticeCounter() {
  const [stepSize, setStepSize] = useState(1);
  const [counter, setCounter] = useState(0);
  //const [dateCounter, setDateCounter] = useState(new Date());
  //alternatively we could simply do this for date as the whole component is re-rendered and so normal variables are re-calculated so we don't need to remember the date from the last render
  const date = new Date();
  date.setDate(date.getDate() + counter);

  function handleStepSize(stepChange) {
    setStepSize((sS) => sS + stepChange);
  }

  // function addDaysToDate(date, daysToAdd) {
  //   const returnDate = new Date(date);
  //   returnDate.setDate(returnDate.getDate() + daysToAdd);
  //   return returnDate;
  // }

  function handleCountForward() {
    setCounter((c) => c + stepSize);
    //setDateCounter((dc) => addDaysToDate(dc, stepSize));
  }

  function handleCountBackwards() {
    setCounter((c) => c - stepSize);
    //setDateCounter((dc) => addDaysToDate(dc, -stepSize));
  }

  function getDateString() {
    let returnString = '';

    if (counter === 0) returnString = "Today's date is ";
    else if (counter > 1)
      returnString =
        'The date ' + counter.toString() + ' days from now will be ';
    else if (counter === 1) returnString = 'The date tommorow will be ';
    else if (counter === -1) returnString = 'The date yesterday was ';
    else if (counter < -1)
      returnString = 'The date ' + Math.abs(counter) + ' days ago was ';
    return returnString;
  }

  return (
    <div>
      <div className="buttons" id="step buttons">
        {/**Notice here we set a callback/arrow function as the onClick handler so that we can pass a parameter to the handleStepSize function ie include the parenthesis */}
        <button onClick={() => handleStepSize(-1)}>-</button>
        <p className="message">Step Size: {stepSize.toString()}</p>
        <button onClick={() => handleStepSize(1)}>+</button>
      </div>
      <div className="buttons" id="count buttons">
        <button onClick={handleCountBackwards}>-</button>
        <p className="message">Count: {counter.toString()}</p>
        <button onClick={handleCountForward}>+</button>
      </div>
      <span style={{ textAlign: 'center' }}>
        <p style={{ color: '#7a632f' }}>{`${
          getDateString() + date.toLocaleDateString()
        }`}</p>
      </span>
    </div>
  );
}
//--------------------------------------------------------------------
//The Tip Calculator Challenge -----------------------------------------------
function TipChallenge() {
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
