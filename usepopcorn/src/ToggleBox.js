import { useState } from 'react';
import { ToggleButton } from './ToggleButton';

//The box component that utilises the ToggleButton functionality to show/hide it's children
export function ToggleBox({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <ToggleButton toggleFunction={setIsOpen} toggleVariable={isOpen} />
      {/* Notice that we have not stated {children} as we are already in 'js-mode' */}
      {isOpen && children}
    </div>
  );
}
