import { Link } from "react-router-dom";
import Button from "../../ui/Button";
import SimpleLink from "../../ui/SimpleLink";
import CartItem from "./CartItem";
import BackToMenu from "../../ui/BackToMenu";

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function Cart() {
  const cart = fakeCart;

  return (
    <div className="w-full min-w-72 px-4 py-2 md:w-96">
      {/* This is now programatically shown within AppLayout everywhere other than home or menu to avoid it affecting layout of individual pages
      <BackToMenu /> */}

      <h2 className="mt-5 text-center text-2xl font-semibold">
        Your cart, %NAME%
      </h2>

      <ul className="divide-y divide-stone-500 p-2">
        {cart.map((item, i) => (
          <CartItem item={item} key={i} />
        ))}
      </ul>

      <div className="flex items-center justify-between space-x-2">
        <Button to="/order/new">Order pizzas</Button>
        <Button type="secondary">Clear cart</Button>
      </div>
    </div>
  );
}

export default Cart;
