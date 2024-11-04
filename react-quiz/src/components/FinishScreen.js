function FinishScreen({ points, totalPoints, highScore, dispatch }) {
  const percentage = Math.ceil((points / totalPoints) * 100);
  //simply give different messages to the user based on how well they scored
  return (
    <>
      <p className="result">
        {points === totalPoints
          ? 'Amazing Job '
          : points > (totalPoints / 4) * 3
          ? 'Good Stuff, you got close '
          : points > totalPoints / 2
          ? 'Not Bad, you got more than half the points available '
          : 'Try Again Soon, it shows you have some gaps in your knowledge '}{' '}
        scoring {points} out of {totalPoints} ({percentage}%)
      </p>
      <p className="highscore">
        {points === highScore
          ? 'You set the High Score of ' + highScore
          : `Aim for the High Score of ${highScore} next time`}
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: 'start' })}
      >
        Restart
      </button>
    </>
  );
}

export default FinishScreen;
