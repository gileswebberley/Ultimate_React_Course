import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import { HiKey } from 'react-icons/hi2';
import ButtonGroup from '../../ui/ButtonGroup';

function Login() {
  const navigate = useNavigate();
  return (
    <ButtonGroup>
      <Button
        size="small"
        variation="secondary"
        onClick={() => navigate('../login')}
      >
        <HiKey />
      </Button>
    </ButtonGroup>
  );
}

export default Login;
