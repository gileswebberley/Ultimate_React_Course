import { useNavigate } from 'react-router-dom';
import Button from '../../ui/Button';
import ButtonGroup from '../../ui/ButtonGroup';
import { HiChartBar } from 'react-icons/hi2';

function UserHome() {
  const navigate = useNavigate();
  return (
    <ButtonGroup justify="end">
      <Button
        size="small"
        variation="secondary"
        onClick={() => navigate('../dashboard')}
      >
        <HiChartBar />
      </Button>
    </ButtonGroup>
  );
}

export default UserHome;
