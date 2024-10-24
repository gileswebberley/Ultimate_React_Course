function StartScreen({ qNum }) {
  return (
    <div className="start">
      <h2>Welcome to the Quiz</h2>
      <p>
        {qNum} questions to test your react knowledge
        <br />
      </p>
      <button>Let's Start</button>
    </div>
  );
}

export default StartScreen;
