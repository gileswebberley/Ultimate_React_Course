import React, { useState } from 'react';

const messages = [
  'Learn React ⚛️',
  'Apply for jobs 💼',
  'Invest your new income 🤑',
];

/**
   * LET'S TALK STATE --
  React rerenders an entire component when it's state changes (or is 'updated') so if we want to update a component view we simply update it's state
  Place state within the top Component that uses it, it can be passed down to children with Props remember
  Note that useState can only be called in the top level of a component, not within other scopes (eg inside the handleNext function or an if statement)
  ALWAYS TREAT STATE VARIABLES AS IMMUTABLE AND THUS USE THE SETTER FUNCTION ASSOCIATED WITH IT eg don't write step = 3 but instead write setStep(3) to avoid problems
  Also note that state is not affected by rerendering but rendering is triggered by a change of a state variable ie when we hide our component below the step variable does not get reset to it's default value but rather remains the same as when the compnent was hidden

  Each instance of a compnent has it's own copy of any state within itself ie state is always an instance variable

  Guidelines to usage of state - 
  Use state whever you have a variable that will change over time (in vanilla JS this could be a let variable for example) and that variable's value will be tracked by the component it is declared within
  The above means whenever a value should be dynamic and have a dynamic affect on a component use State (for example the opening and closing of the main component below)
  DO NOT USE STATE TO DECLARE VARIABLES THAT DO NOT NEED TO TRIGGER A RE-RENDER OF A COMPONENT WHEN THEIR VALUE CHANGES (just use regular variables instead)
  When building a component we can imagine that it's View is simply a reflection of it's State changing over time
  IE if you would have to manipulate the DOM when a value changes in vanilla js then use state for that value instead 
  
    DON'T SET STATE MANUALLY - so don't do if(step > 1) step -= 1
    It's also incorrect to hard code a change to the current state like this:
    if (step > 1) setStep(step - 1); if it relies on the current value of the state
    as the state does not appear to be updated until the function has completed
    meaning that if we were to immediately make another change, eg take away another 1
    it would not have an affect on the step state. so this would not take away two
    if (step > 1) setStep(step - 1); //This expression does what's expected
    if (step > 1) setStep(step - 1); //This expression has no affect
    instead it should be done with a callback function like this:
    if (step > 1) setStep((currentStepValue) => currentStepValue - 1);
  */

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PracticeCounter />

      <button className="close" onClick={() => setIsOpen((isOpen) => !isOpen)}>
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && <Stepper />}

      {/** FInally add in the tip calculator challenge */}
      <TipChallenge />
    </>
  );
}

function Stepper() {
  //bring the state with us into this component seeing as the parent component doesn't need to be aware of it ie keep it as far down the heirarchy as possible
  const [step, setStep] = useState(2);

  function handleNext() {
    if (step < 3) setStep((s) => s + 1);
  }

  //I have emulated this function with an arrow function within the onClick property of the Previous button
  //function handlePrevious() { }

  return (
    <div className="steps">
      <div className="numbers">
        <div className={step === 1 ? 'active' : ''}>1</div>
        <div className={step === 2 ? 'active' : ''}>2</div>
        <div className={step === 3 ? 'active' : ''}>3</div>
      </div>

      <p className="message">
        Step {step}: {messages[step - 1]}
      </p>

      <div className="buttons">
        {/**Now we'll replace these buttons with our own custom button as part of lesson #90 */}
        <Button
          textColour="#99e8e8"
          bgColour="#7a632f"
          onClick={() => {
            if (step > 1) setStep((s) => s - 1);
          }}
        >
          <span>👈</span>Previous
        </Button>
        <Button textColour="#99e8e8" bgColour="#7a632f" onClick={handleNext}>
          Next<span>👉</span>
        </Button>
      </div>
    </div>
  );
}

//This is the lesson #90 "Making a reusable button"-------------------------------
//by accepting the React defined 'children' property we can pass other JSX content into our component as though it were a normal html element with a sn opening and closing tag, eg here we are passing in a span and some text which makes this button more reusable.
//Essentially the hole between the opening and closing tag of the React component is wrapped up in a property called children ie <Button>props.children</Button>.
//Therefore the component no longer needs to know about it's content
function Button({ textColour, bgColour, onClick, children }) {
  return (
    <button
      style={{
        backgroundColor: bgColour,
        color: textColour,
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

//--------------------------------------------------------------------------------

//Here I'll pop the step counter coding challenge component
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

  function handleCountForward() {
    setCounter((c) => c + stepSize);
  }

  function handleCountBackwards() {
    setCounter((c) => c - stepSize);
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
