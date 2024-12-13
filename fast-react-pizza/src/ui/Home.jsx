function Home() {
  return (
    <div>
      {/* Start using a bit of Tailwind for our css, with the tailwind intellisense extension installed it means you can hover on class names to see what raw css is behind them 
      See the documentation for the pre-built colour palettes*/}
      <h1 className="text-center text-2xl font-semibold text-amber-600">
        The best pizza.
        <br />
        Straight out of the oven, straight to you.
      </h1>
    </div>
  );
}

export default Home;
