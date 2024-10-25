import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';
import Question from './Question';
import NextButton from './NextButton';
import Progress from './Progress';
import FinishScreen from './FinishScreen';

//for the useReducer functionality we form a state object
const initialState = {
  questions: [],
  questionIndex: 0,
  answer: null,
  points: 0,
  highScore: 0,
  //status can be: 'loading', 'error','ready','active', or 'finished' to save on having isLoading etc states
  status: 'loading',
};
function reducer(state, action) {
  switch (action.type) {
    case 'data received':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'data failed':
      console.log(
        'Error from data failed in reducer(): ' + action.payload.message
      );
      return { ...state, status: 'error' };
    case 'start':
      //called from StartScreen
      return {
        ...state,
        questionIndex: 0,
        status: 'active',
        points: 0,
        answer: null,
      };
    case 'answer':
      //
      const question = state.questions.at(state.questionIndex);
      const pointsAwarded =
        action.payload === question.correctOption ? question.points : 0;
      return {
        ...state,
        answer: action.payload,
        points: state.points + pointsAwarded,
      };
    case 'nextQuestion':
      const nextIndex =
        state.questionIndex < state.questions.length - 1
          ? state.questionIndex + 1
          : 0; //want to move the status onto complete, not sure how to just yet so loop round for now
      return { ...state, questionIndex: nextIndex, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    default:
      throw new Error('React Quiz dispatched an unrecognised action');
  }
}

export default function App() {
  //state is {questions, status}
  const [
    { questions, questionIndex, status, answer, points, highScore },
    dispatch,
  ] = useReducer(reducer, initialState);

  const maxPoints = questions.reduce((acc, q) => acc + q.points, 0);
  //passing this around all over the place so make it a derived state to save on all the calls
  const numQuestions = questions.length;

  //we've set up a fake API with the json-server which runs on the data folder so we'll grab our questions
  useEffect(function () {
    //as it's being fetched from local just quickly chain the response handlers that receive a Promise
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'data received', payload: data }))
      .catch((err) => dispatch({ type: 'data failed', payload: err }));
  }, []);
  return (
    <div className="app">
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen qNum={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <>
            <Progress
              index={questionIndex}
              numQuestions={numQuestions}
              points={points}
              totalPoints={maxPoints}
              answer={answer}
            />
            <Question
              question={questions[questionIndex]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={questionIndex}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            totalPoints={maxPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}
