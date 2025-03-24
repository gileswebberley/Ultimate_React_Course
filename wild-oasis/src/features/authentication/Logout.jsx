import { HiArrowRightOnRectangle } from 'react-icons/hi2';
import Button from '../../ui/Button';
import SpinnerTiny from '../../ui/SpinnerTiny';
import ButtonGroup from '../../ui/ButtonGroup';
import { useLogout } from './useLogout';

function Logout() {
  const { logout, isLoggingOut } = useLogout();

  return (
    <ButtonGroup>
      <Button
        size="small"
        variation="secondary"
        onClick={logout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? <SpinnerTiny /> : <HiArrowRightOnRectangle />}
        {/* Log-Out */}
      </Button>
    </ButtonGroup>
  );
}

export default Logout;
