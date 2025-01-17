import styled, { css } from 'styled-components';

const sizes = {
  small: css`
    font-size: 1.2rem;
    padding: 0.4rem 0.8rem;
    text-transform: uppercase;
    font-weight: 600;
    text-align: center;
  `,
  medium: css`
    font-size: 1.4rem;
    padding: 1.2rem 1.6rem;
    font-weight: 500;
  `,
  large: css`
    font-size: 1.6rem;
    padding: 1.2rem 2.4rem;
    font-weight: 500;
  `,
};

const variations = {
  primary: css`
    color: var(--color-brand-50);
    background-color: var(--color-brand-600);

    &:hover {
      background-color: var(--color-brand-700);
    }
  `,
  secondary: css`
    color: var(--color-grey-600);
    background: var(--color-grey-0);
    border: 1px solid var(--color-grey-200);

    &:hover {
      background-color: var(--color-grey-50);
    }
  `,
  danger: css`
    color: var(--color-red-100);
    background-color: var(--color-red-700);

    &:hover {
      background-color: var(--color-red-800);
    }
  `,
};

//Above was provided to us but this is our first styled component proper, so now we can use Button in place of the html button tag and it will be styled appropriately (according to this centralised definition)
const Button = styled.button`
  font-size: 1.4rem;
  padding: 1.2rem 1.6rem; //x and y
  font-weight: 500;
  border: none;
  //now use some of those globally defined css variables in GlobalStyles
  border-radius: var(--border-radius-sm);
  background-color: var(--color-brand-600);
  color: var(--color-brand-50);
  box-shadow: var(--shadow-sm);
  cursor: pointer;

  //to select the element that this styling is connected to we can use the ampersand (asCss), here we want to define the hover behaviour using the css pseudo-class like so
  &:hover {
    background-color: var(
      --color-brand-700
    ); //the transition behaviour is already defined in GlobalStyles, ie transition: background-color 0.3s
  }
`;

//finally default export this styled component
export default Button;
