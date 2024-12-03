import { useNavigate } from 'react-router-dom';
import Button from './Button';

function BackButton() {
  const navigate = useNavigate();
  /* By passing a number to the useNavigate instance we can step back through the navigation history, so here for a back button we want to step back to the last page and so pass it the value of -1 
  Also note that we are actually inside a Form element and so we have to use preventDefault() so that it is not treated as a submit button*/
  return (
    <Button
      type="back"
      onClick={(e) => {
        e.preventDefault();
        navigate(-1);
      }}
    >
      &larr; Back
    </Button>
  );
}

export default BackButton;
