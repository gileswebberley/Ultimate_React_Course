import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi2';
import Button from './Button';
import ButtonGroup from './ButtonGroup';
import { useDarkMode } from '../context/darkModeContext';

function DarkModeToggle() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <ButtonGroup>
      <Button onClick={toggleDarkMode} size="small" variation="secondary">
        {isDarkMode ? <HiOutlineSun /> : <HiOutlineMoon />}
      </Button>
    </ButtonGroup>
  );
}

export default DarkModeToggle;
