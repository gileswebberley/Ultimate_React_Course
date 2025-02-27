import styled from 'styled-components';
import { forwardRef, useState } from 'react';
import Input from './Input';
import { HiEye, HiEyeSlash } from 'react-icons/hi2';

//After a hell of a lot of head scratching it became apparent that I had to use forwardRef for this component if I wanted to be able to use it within a react-hook-form. It appears to be working as I am now getting the validation and error messages. React 19 says it is deprecating it but it seems that this will be automagically converted to accept the ref as a prop
const PasswordInput = forwardRef(function PasswordInput(inputProps, ref) {
  //   console.table({ ...inputProps });
  //make password visible or not
  const [isVisible, setIsVisible] = useState(false);
  //visibility icon holder
  const Icon = styled.span`
    position: absolute;
    z-index: 10;
    transform: translate(-2.6rem, 0.8rem);
    cursor: pointer;
    & svg {
      width: 2.2rem;
      height: 2.2rem;
      color: var(--color-brand-600);
    }
  `;
  const InputHolder = styled.div`
    position: relative;
    width: 100%;
  `;
  return (
    <InputHolder>
      <Input
        type={isVisible ? 'text' : 'password'}
        //for auto-complete functionality
        autoComplete="current-password"
        {...inputProps}
        ref={ref}
      ></Input>
      <Icon
        onClick={(e) => {
          e.preventDefault();
          setIsVisible((vis) => !vis);
        }}
      >
        {isVisible ? <HiEye /> : <HiEyeSlash />}
      </Icon>
    </InputHolder>
  );
});

export default PasswordInput;
