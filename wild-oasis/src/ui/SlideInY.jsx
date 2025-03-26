import { useInView } from 'react-intersection-observer';
import styled, { css } from 'styled-components';

const SlideInYTransition = styled.div`
  opacity: 0;
  /* min-height: 0 is to fix a firefox quirk where the cabins were scrolling off the top of the page */
  min-height: 0;
  max-width: fit-content;
  justify-content: center;
  transition: opacity 1.8s ease-out;
  ${(props) =>
    props.$inView &&
    css`
      opacity: 1;
    `};
  @keyframes slide-in {
    0% {
      transform: translateY(110dvh);
    }
    100% {
      transform: translateY(0);
    }
  }

  animation: ${(props) => (props.$inView ? 'slide-in 1.2s ease-out' : '')};
`;

function SlideInY({ children }) {
  const { ref, inView } = useInView({ triggerOnce: true });
  // console.log(inView);
  return (
    <SlideInYTransition $inView={inView} ref={ref}>
      {children}
    </SlideInYTransition>
  );
}
export default SlideInY;
