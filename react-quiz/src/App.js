import { useEffect, useReducer } from 'react';
import Header from './Header';
import Main from './Main';
import Loader from './Loader';
import Error from './Error';
import StartScreen from './StartScreen';

//for the useReducer functionality we form a state object
const initialState = {
  questions: [],
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
    default:
      throw new Error('React Quiz dispatched an unrecognised action');
  }
}

export default function App() {
  //state is {questions, status}
  const [{ questions, status }, dispatch] = useReducer(reducer, initialState);

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
        {status === 'ready' && <StartScreen qNum={questions.length} />}
      </Main>
    </div>
  );
}
