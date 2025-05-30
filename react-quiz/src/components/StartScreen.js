import { useQuizContext } from '../contexts/QuizContext';

function StartScreen() {
  const { numQuestions, dispatch } = useQuizContext();
  return (
    <div className="start">
      <h2>Welcome to the Quiz</h2>
      <h3>{numQuestions} questions to test your React knowledge</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Let's Start
      </button>
    </div>
  );
}

export default StartScreen;
