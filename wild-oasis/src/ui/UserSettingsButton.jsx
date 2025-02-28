import { useNavigate } from 'react-router-dom';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { HiOutlineUser } from 'react-icons/hi2';

function UserSettingsButton() {
  const navigate = useNavigate();
  return (
    <ButtonGroup>
      <Button
        onClick={() => navigate('../account')}
        size="small"
        variation="secondary"
      >
        <HiOutlineUser /> Account
      </Button>
    </ButtonGroup>
  );
}

export default UserSettingsButton;
