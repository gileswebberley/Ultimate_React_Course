import { useState } from 'react';

//-----------------------------------------------------------------------
//PRACTICE COUNTER FROM STEPS PROJECT
//Here I'll pop the coding challenge component
export function PracticeCounter() {
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
