import React from 'react';
import ReactDOM from 'react-dom/client';
//and now let's get some styling injected into this single page app using the webpack import
//WHEN STYLING INSTEAD OF USING THE HTML class ATTRIBUTE YOU MUST INSTEAD USE className IN JSX
import './index.css';
//try to get the pizza data in here more neatly than copy and paste
import { pizzaData } from './data.js';

function App() {
  //Be aware that a React Component can only return one element so wrap it all in a <div> like here
  //This is the content that will be rendered by the root.render method below
  return (
    <div className="container">
      <PizzaHeader />
      <PizzaOpeningCheck />
      <Menu />
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
      {/*Now we can place an instance of our Pizza Component in here (ps this is a JSX comment
      We're creating key/value pairs that are added to the props argument in their 'constructor'
      Please note that I tried using a forEach loop but map is the way to go*/}
      <div className="pizzas">
        {pizzaData.map((element) => {
          console.log('element name:' + element.name);
          return <Pizza data={element} />;
        })}
      </div>
      {/** We use javascript mode {} to pass in anything that is not a string, from numbers to entire js objects */}
    </main>
  );
}
//accept the props parameter as an argument and the properties defined by the call to this component 'constructor'
function Pizza(props) {
  //use the object destructuring we learnt to grab what we need from the element passed through as 'data'
  const { photoName, name, ingredients, price, soldOut } = props.data;
  return (
    <div className={`pizza ${soldOut ? 'sold-out' : ''}`}>
      <img src={photoName} alt={name} />
      <h1>{name}</h1>
      <p>{ingredients}</p>
      <span>£{price + 0.95}</span>
      {/**Because we passed in a number using javascript mode {} above we can use it as a number and so add a fixed amount (due to costs perhaps)*/}
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
const tradingHours = { open: 17, close: 23 };
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
