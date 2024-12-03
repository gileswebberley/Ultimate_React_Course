function NextButton({ dispatch, answer, index, numQuestions }) {
  //hide if no answer has been provided
  if (answer === null) return;
  //usual behaviour if not at the end of the questions
  if (index < numQuestions - 1) {
    return (
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'nextQuestion' })}
      >
        Next
      </button>
    );
  }
  //else we're at the end of the quiz so make it a finish button instead
  return (
    <button className="btn btn-ui" onClick={() => dispatch({ type: 'finish' })}>
      Finish
    </button>
  );
}

export default NextButton;
