import { useQuizContext } from '../contexts/QuizContext';
import Options from './Options';

function Question() {
  const { questions, questionIndex } = useQuizContext();
  const question = questions[questionIndex];
  return (
    <div>
      <h4>{question.question}</h4>
      <Options />
    </div>
  );
}

export default Question;
