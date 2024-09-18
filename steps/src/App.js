import React, { useState } from 'react';

const messages = [
  'Learn React ⚛️',
  'Apply for jobs 💼',
  'Invest your new income 🤑',
];

export default function App() {
  /**
   * LET'S TALK STATE --
  React rerenders an entire component when it's state changes (or is 'updated') so if we want to update a component view we simply update it's state
  Place state within the top Component that uses it, it can be passed down to children with Props remember
  Note that useState can only be called in the top level of a component, not within other scopes (eg inside the handleNext function or an if statement)
  ALWAYS TREAT STATE VARIABLES AS IMMUTABLE AND THUS USE THE SETTER FUNCTION ASSOCIATED WITH IT eg don't write step = 3 but instead write setStep(3) to avoid problems
  */
  const [step, setStep] = React.useState(2);
  const [isOpen, setIsOpen] = useState(true);

  function handleNext() {
    if (step < 3) setStep(step + 1);
  }

  //I have emulated this function with an arrow function within the onClick property of the Previous button
  function handlePrevious() {
    //DON'T SET STATE MANUALLY - so don't do if(step > 1) step -= 1
    if (step > 1) setStep(step - 1);
  }

  return (
    <>
      <button className="close" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? '-' : '+'}
      </button>
      {isOpen && (
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
      )}
    </>
  );
}
