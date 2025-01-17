import styled from 'styled-components';
import GlobalStyles from './styles/GlobalStyles';
import Button from './ui/Button';
//first example of a styled component
const H1 = styled.h1`
  font-size: 30px;
  font-weight: 600;
`;

function App() {
  //We are using styled components global styles for the first time, here we make our GlobalStyles component a sibling of our App
  return (
    <>
      <GlobalStyles />
      <div>
        App
        <Button>temp button</Button>
      </div>
    </>
  );
}

export default App;
