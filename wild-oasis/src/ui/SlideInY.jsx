import styled from 'styled-components';

const SlideInY = styled.div`
  @keyframes slide-in {
    0% {
      opacity: 0;
      transform: translateY(68rem);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  animation: slide-in 1s ease-out;
`;

export default SlideInY;
