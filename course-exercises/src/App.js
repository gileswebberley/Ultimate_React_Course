import { useEffect } from 'react';
import TextExpanderApp from './TextExpanderApp';
import StarRating from './StarRating';
import { PracticeCounter } from './PracticeCounter';
import { TipChallenge } from './TipChallenge';
import BankAccount from './BankAccount';

function testRating(rating) {
  console.log(rating);
}

export default function App() {
  return (
    <>
      <div>
        <b>Bank Account</b>
      </div>
      <BankAccount />
      <div>
        <b>
          <u>Practice Counter</u>
        </b>
      </div>
      <PracticeCounter />
      <div>
        <b>
          <u>Tip Calculator</u>
        </b>
      </div>
      <TipChallenge />
      <div>
        <b>
          <u>Text Expander</u>
        </b>
      </div>
      <TextExpanderApp />
      <div>
        <b>
          <u>Star Rating</u>
        </b>
      </div>
      <div className="rating">
        <section>
          <StarRating
            maxRating={10}
            colour="#ff0000"
            size={16}
            onSetRating={testRating}
          />
        </section>
      </div>
    </>
  );
}
