import React from 'react';

const messages = [
  'Learn React ⚛️',
  'Apply for jobs 💼',
  'Invest your new income 🤑',
];

export default function App() {
  //Place state within the top Component that uses it, it can be passed down to children with Props remember
  //Note that useState can only be called in the top level of a component, not within other scopes (eg inside the handleNext function)
  const [step, setStep] = React.useState(2);

  function handleNext() {
    if (step < 3) setStep(step + 1);
  }

  //I have emulated this function with an arrow function within the onClick property of the Previous button
  function handlePrevious() {
    if (step > 1) setStep(step - 1);
  }

  return (
    <div className="steps">
      <div className="numbers">
        <div className={`${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`${step >= 3 ? 'active' : ''}`}>3</div>
      </div>

      <p className="message">
        Step {step}: {messages[step - 1]}
      </p>

      <div className="buttons">
        <button
          style={{
            backgroundColor: '#7a632f',
            color: '#99e8e8',
          }}
          onClick={() => {
            if (step > 1) setStep(step - 1);
          }}
        >
          Previous
        </button>
        <button
          style={{
            backgroundColor: '#7a632f',
            color: '#99e8e8',
          }}
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}
