import { useQuizContext } from '../contexts/QuizContext';

function NextButton() {
  const { dispatch, answer, questionIndex, numQuestions } = useQuizContext();
  //hide if no answer has been provided
  if (answer === null) return;
  //usual behaviour if not at the end of the questions
  if (questionIndex < numQuestions - 1) {
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
