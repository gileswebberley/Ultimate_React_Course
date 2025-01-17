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
    //to select the element that this styling is connected to we can use the ampersand (asCss), here we want to define the hover behaviour using the css pseudo-class like so
    &:hover {
      background-color: var(
        --color-brand-700
      ); //the transition behaviour is already defined in GlobalStyles, ie transition: background-color 0.3s
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

//this is our first styled component proper, so now we can use Button in place of the html button tag and it will be styled appropriately (according to this centralised definition) but still have all of the built in props of an html button. We also make it more flexible by using the props functionality of the styled component model. Use the callback function to access the props object that is passed in.
const Button = styled.button`
  border: none;
  border-radius: var(--border-radius-sm);
  box-shadow: var(--shadow-sm);
  ${(props) => sizes[props.size]}
  ${(props) => variations[props.variation]}
`;

//now that we're using the props functionality we'll set up some defaults like so, this way if we don't pass in the expected props it will fallback onto this styling
Button.defaultProps = {
  variation: 'primary',
  size: 'medium',
};

//finally default export this styled component
export default Button;
