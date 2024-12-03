import { createContext, useContext, useEffect, useReducer } from 'react';

const QuizContext = createContext();

//for the useReducer functionality we form a state object
const initialState = {
  questions: [],
  questionIndex: 0,
  answer: null,
  points: 0,
  highScore: 0,
  //moved the time remaining state into the timer to avoid complete re-renders every second
  //however I'll centralise the time per question up here so we don't have to dig around
  secondsPerQuestion: 20,
  //status can be: 'loading', 'error','ready','active', or 'finished' to save on having isLoading etc states
  status: 'loading',
};

function reducer(state, action) {
  //this now acts as a centralised state management system with useReducer implemented
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
      const question = state.questions.at(state.questionIndex);
      //now award points associated with the question if the user has got it correct
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
          : 0; //avoid accidental out-of-bounds error
      return { ...state, questionIndex: nextIndex, answer: null };

    case 'finish':
      return {
        ...state,
        status: 'finished',
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };

    default:
      throw new Error('Quiz dispatched an unrecognised action');
  }
}

function QuizContextProvider({ children }) {
  //destructure the state in place
  const [
    {
      questions,
      questionIndex,
      status,
      answer,
      points,
      highScore,
      secondsPerQuestion,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  //remember that reduce is (previous value (or accumulator), current object reference)
  const maxPoints = questions.reduce((acc, q) => acc + q.points, 0);
  //passing this around all over the place so make it a derived state to save on all the calls
  const numQuestions = questions.length;

  //we've set up a fake API with the json-server which runs on the data folder so we'll grab our questions from it by doing -
  /* We're faking an API server by installing json-server with the terminal command npm i json-server, then we add "server": "json-server --watch data/questions.json --port 8000" to the package.json file and finally type npm run server into the terminal and we find our object that holds an array called questions at the url localhost:8000/questions. */
  useEffect(function () {
    //as it's being fetched from local just quickly chain the response handlers
    fetch('http://localhost:8000/questions')
      .then((res) => res.json())
      .then((data) => dispatch({ type: 'data received', payload: data }))
      .catch((err) => dispatch({ type: 'data failed', payload: err }));
  }, []);

  return (
    <QuizContext.Provider
      value={{
        questions,
        questionIndex,
        status,
        answer,
        points,
        highScore,
        secondsPerQuestion,
        maxPoints,
        numQuestions,
        dispatch,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
}

function useQuizContext() {
  const context = useContext(QuizContext);
  if (context === undefined)
    throw new Error(
      'useQuizContext called outside the scope of the QuizContextProvider'
    );
  return context;
}

export { QuizContextProvider, useQuizContext };
