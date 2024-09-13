import React from 'react';
import ReactDOM from 'react-dom/client';
//and now let's get some styling injected into this single page app using the webpack import
//WHEN STYLING INSTEAD OF USING THE HTML class ATTRIBUTE YOU MUST INSTEAD USE className IN JSX
import './index.css';

function App() {
  //Be aware that a React Component can only return one element so wrap it all in a <div> like here
  //This is the content that will be rendered by the root.render method below
  return (
    <div className="container">
      <PizzaHeader />
      <Menu />
      <PizzaOpeningCheck />
    </div>
  );
}
//----------------------------------------------------------------------
//COMPONENTS
//----------------------------------------------------------------------
//Let's create a new Component - remember the name starts with a capital letter and
//the function must return some JSX Mark-Up language (NOT MULTIPLE ELEMENTS so wrap it in a div if you need more)
function Menu() {
  return (
    <main className="menu">
      <h2>Our Menu</h2>
      {/*Now we can place an instance of our Pizza Component in here too (ps this is a JSX comment*/}
      <Pizza name="Vegan Glory" />
    </main>
  );
}
function Pizza(props) {
  return (
    <div>
      <img src="pizzas/spinaci.jpg" alt="Picture of the spinach pizza" />
      <h3>{props.name}</h3>
      <p>{props.ingredients}</p>
    </div>
  );
}

//or for a very simple component like a header we could write arrow functions eg -
const PizzaHeader = () => (
  <header className="header">
    <h1>Fast React Pizza Co.</h1>
  </header>
);
//using the simplicity of JSX to combine javascript into the html
const PizzaOpeningCheck = () => (
  <footer className="footer">{openHoursString()}</footer>
);

//----------------------------------------------------------------------
//OPENING TIME FUNCTIONALITY
//----------------------------------------------------------------------
//Add a bit of functionality regarding opening hours (not time, just hours!!)
const tradingHours = { open: 16, close: 23 };
function isOpen() {
  const nowHour = new Date().getHours();
  return nowHour >= tradingHours.open && nowHour < tradingHours.close;
}

function openHoursString() {
  //simple ternary operator ie ask the question, if true first value else second one
  return isOpen()
    ? "Blessed Be, We're Open To Take Your Order"
    : `Unfortunately We're Closed At The Moment Come Back Between ${tradingHours.open}:00 and ${tradingHours.close}:00`;
}

//----------------------------------------------------------------------
//RENDER
//----------------------------------------------------------------------
//Strict mode is an inbuilt component that will check for problems during development
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
