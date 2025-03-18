import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import { HiKey } from 'react-icons/hi2';

function Login() {
  const navigate = useNavigate();
  return (
    <ButtonGroup justify="end">
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
