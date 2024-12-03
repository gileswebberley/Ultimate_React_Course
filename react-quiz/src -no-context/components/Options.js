function Options({ question, dispatch, answer }) {
  //variable to denote whether an answer has been clicked on
  const hasAnswered = answer !== null;
  //in the styles of the button we check for an answer and if it's incorrect we
  //highlight the answer as wrong and highlight the correct answer - it was becoming
  //a mess of nested ternary operators so let's pull it out into a function
  function handleStyling(i) {
    let returnStr = '';
    if (hasAnswered) {
      if (i === answer) {
        //entered an answer so style it as such
        returnStr += 'answer';
        //then check whether it was a correct answer and if not apply the wrong answer styling
        if (answer !== question.correctOption) {
          returnStr += ' wrong';
        }
      }
      //whether it's the answer given or just as a hint style the correct answer
      if (i === question.correctOption) {
        returnStr += ' correct';
      }
    }
    return returnStr;
  }
  return (
    <div>
      <div className="options">
        {question.options.map((option, i) => (
          <button
            className={`btn btn-option ${hasAnswered ? handleStyling(i) : ''}`}
            key={option}
            disabled={hasAnswered}
            onClick={() => dispatch({ type: 'answer', payload: i })}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Options;
