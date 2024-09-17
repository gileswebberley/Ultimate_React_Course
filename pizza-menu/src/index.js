import React from 'react';
import ReactDOM from 'react-dom/client';
//and now let's get some styling injected into this single page app using the webpack import
//WHEN STYLING INSTEAD OF USING THE HTML class ATTRIBUTE YOU MUST INSTEAD USE className IN JSX (also css names are camelCase too eg background-color is backgroundColor)
import './index.css';
//try to get the pizza data in here more neatly than copy and paste
import { pizzaData } from './data.js';

function App() {
  //Be aware that a React Component can only return one element so wrap it all in a <div> like here
  //This is the content that will be rendered by the root.render method below
  return (
    <div className="container">
      <PizzaHeader />
      <Footer />
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
      Please note that I tried using a forEach loop but map is the way to go as JSX needs a new array (of pizzas) to render
      
      SEE RENDERING LISTS TUTORIAL
      All list items should have a unique key (here we just use it's name) for react performance reasons
      Remeber symantic markup - eg we are producing a list so we should make the container an unordered list <ul> and then each pizza a list item <li>*/}
      <ul className="pizzas">
        {pizzaData.map((element) => {
          //return some JSX in here
          return <Pizza data={element} key={element.name} />;
        })}
      </ul>
      {/** We use javascript mode {} to pass in anything that is not a string, from numbers to entire js objects */}
    </main>
  );
}
//accept the props parameter as an argument and the properties defined by the call to this component 'constructor'
function Pizza(props) {
  //use the object destructuring we learnt to grab what we need from the element passed through as 'data'
  const { photoName, name, ingredients, price, soldOut } = props.data;

  //You can use all your javascript statements in here as this is not JSX!!
  //for example we could have this component return null if it is sold out by using an 'early return' eg
  //if(soldOut) return null;
  return (
    <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
      <img src={photoName} alt={name} />
      <div>
        <h3>{name}</h3>
        <p>{ingredients}</p>
        <span>£{price + 0.95}</span>
        {/**Because we passed in a number using javascript mode {} above we can use it as a number and so add a fixed amount (due to costs perhaps)*/}
      </div>
    </li>
  );
}

//or for a very simple component like a header we could write arrow functions eg -
const PizzaHeader = () => (
  <header className="header">
    <h1>Fast React Pizza Co.</h1>
  </header>
);

//using the simplicity of JSX to combine javascript into the html
function Footer() {
  /** We can use this Conditional Rendering in place of
   * <p>{openHoursString()}</p>
   * due to the fact that JSX will not render the boolean from isOpen()
   *
   * Remember even though we can't use an if/else (because it does not return a value) we can use the ternary operator instead as that returns it's true or false statement which is a safer way to do Conditional Rendering (in case it's a truey/falsey rather than true/false eg 0 or null)
   */
  return (
    <footer className="footer">
      {
        //Logical AND (&&) will return second statement if first is boolean true
        isOpen() && <OpenMessage />
      }
      {
        //whilst Logical OR (||) will return the second statement if the first is boolean false
        isOpen() || <ClosedMessage />
      }
    </footer>
  );
}

//We're just creating these seperate components as the Footer was getting quite scruffy and bloated
function OpenMessage() {
  return (
    <div className="order">
      <p>
        Blessed be, we're open until {tradingHours.close}:00 to take your order
      </p>
      <button className="btn">Order Now</button>
    </div>
  );
}

function ClosedMessage() {
  return (
    <div className="order">
      <p>
        Unfortunately We're Closed At The Moment Come Back Between{' '}
        {tradingHours.open}:00 and {tradingHours.close}:00
      </p>
    </div>
  );
}

//----------------------------------------------------------------------
//OPENING TIME FUNCTIONALITY
//----------------------------------------------------------------------
//Add a bit of functionality regarding opening hours (not time, just hours!!)
const tradingHours = { open: 18, close: 23 };
function isOpen() {
  const nowHour = new Date().getHours();
  return nowHour >= tradingHours.open && nowHour < tradingHours.close;
}

function openHoursString() {
  //simple ternary operator ie ask the question, if true first value else second one
  //this is now actually be done in Footer component with a conditional as JSX does not render booleans
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
