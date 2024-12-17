import CreateUser from "../features/user/CreateUser";

function Home() {
  return (
    <div className="my-8 px-4 text-center">
      {/* Start using a bit of Tailwind for our css, with the tailwind intellisense extension installed it means you can hover on class names to see what raw css is behind them 
      See the documentation for the pre-built colour palettes*/}
      <h1 className="mb-5 text-3xl font-semibold text-stone-600 sm:text-4xl md:text-5xl lg:text-6xl">
        The best pizza
        <br />
        <span className="text-amber-600">
          Out of the oven
          <br /> and straight to you
        </span>
      </h1>

      <CreateUser />
    </div>
  );
}

export default Home;
