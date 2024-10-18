/*This is the first time we are creating an entirely reusable component from scratch
check out the changes to the index page
As it is standalone we add a bit of inline styling but if not flexible we create the style objects outside of the component so that it only has to be initialised once when the file loads rather than every time the component is re-rendered (!!Handy tip!!)
*/
/**
 * As a component that is going to be used by other consumers (even if it's just you) it requires essentially an API so we encapsulate the logic but allow the props to be flexible
 * Remember to not make it over complex but with a decent amount of flexibility
 * It's also good to externalise the state to some degree, here we will allow an onSetRating function to be passed in (check out the index page for usage)
 */

import { useState } from 'react';
import PropTypes from 'prop-types';

//need to swat up on css as I've forgotten most of what I knew

const starContainerStyling = {
  display: 'flex',
  //gap: '2px',
};

//This is a bit old fashioned and it might be worth looking into typescript but,
//here's how to type check the properties that you leave open
StarRating.propTypes = {
  //isRequired as an example, therefore you could forgoe the need for a default?
  //best practice to set a default apparently
  maxRating: PropTypes.number.isRequired,
  currentRating: PropTypes.number,
  color: PropTypes.string,
  size: PropTypes.number,
  onSetRating: PropTypes.func,
};

//we can set a default value to a property as shown here, very important when building the props based API
export default function StarRating({
  maxRating,
  currentRating = 0,
  colour = '#000',
  size = 16,
  onSetRating,
}) {
  //state for the star click functionality
  const [rating, setRating] = useState(currentRating);
  //state for the star mouse over functionality
  const [hoverRating, setHoverRating] = useState(0);
  //styling in here now because we've opened them up to the 'api'
  const containerStyling = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    color: colour,
  };

  //as we are opening this up as part of the API let's make it a standalone function
  function handleSetRating(rating) {
    setRating(rating);
    //check whether a callback function has been supplied and call it if so
    if (onSetRating != null) onSetRating(rating);
  }

  return (
    <div style={containerStyling}>
      {/* Using .from() which takes an object and a function as parameters */}
      <div style={starContainerStyling}>
        {Array.from({ length: maxRating }, (acc, i) => (
          <Star
            colour={colour}
            size={`${size}px`}
            key={i + 1}
            onRating={() => handleSetRating(i + 1)}
            onHoverIn={() => setHoverRating(i + 1)}
            onHoverOut={() => setHoverRating(0)}
            full={hoverRating ? hoverRating >= i + 1 : rating >= i + 1}
          />
        ))}
      </div>
      <p>{hoverRating || rating || '0'}</p>
    </div>
  );
}

function Star({
  onRating,
  onHoverIn,
  onHoverOut,
  full,
  size = 16,
  colour = '#000',
}) {
  //For the stars the course provides an svg component which simply needs styling
  const starStyle = {
    width: size,
    height: size,
    cursor: 'pointer',
    display: 'block',
    //color: colour,
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill={full ? colour : 'none'}
      viewBox="0 0 24 24"
      stroke={full ? 'none' : colour}
      style={starStyle}
      onClick={onRating}
      onMouseEnter={onHoverIn}
      onMouseLeave={onHoverOut}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="{2}"
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </svg>
  );
}
