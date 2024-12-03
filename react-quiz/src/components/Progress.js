import { useQuizContext } from '../contexts/QuizContext';

function Progress() {
  const { questionIndex, numQuestions, points, totalPoints, answer } =
    useQuizContext();
  return (
    <header className="progress">
      <progress
        max={numQuestions}
        value={questionIndex + Number(answer !== null)}
      ></progress>
      <p>
        Question <strong>{questionIndex + 1}</strong> / {numQuestions}
      </p>
      <p>
        Points <strong>{points}</strong> / {totalPoints}
      </p>
    </header>
  );
}

export default Progress;
