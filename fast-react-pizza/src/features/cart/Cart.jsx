import Button from "../../ui/Button";
import CartItem from "./CartItem";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, getCart } from "./cartSlice";
import { getUsername } from "../user/userSlice";
import { useNavigate } from "react-router-dom";

function Cart() {
  const cart = useSelector(getCart);
  const username = useSelector(getUsername);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleClearCart() {
    if (cart.length === 0) return;
    if (
      window.confirm(
        "Are you sure you want to empty your cart? This action cannot be undone",
      )
    ) {
      dispatch(clearCart());
      //navigate("/menu");
    }
  }

  return (
    <div className="flex w-full min-w-72 flex-col px-4 py-2 md:min-w-96">
      {/* This is now programatically shown within AppLayout everywhere other than home or menu to avoid it affecting layout of individual pages
      <BackToMenu /> */}

      <h2 className="mt-5 text-balance text-center text-2xl font-semibold">
        Cart for {username}
      </h2>
      {/* Only show the cart contents and buttons when there's something in the cart */}
      {cart.length > 0 ? (
        <>
          <ul className="mx-2 my-6 divide-y divide-stone-500 border-y border-stone-500">
            {cart.map((item, i) => (
              <CartItem item={item} key={i} />
            ))}
          </ul>

          <div className="flex items-center justify-between space-x-2">
            <Button to="/order/new">Order pizzas</Button>
            <Button type="secondary" onClick={handleClearCart}>
              Clear cart
            </Button>
          </div>
        </>
      ) : (
        <h1 className="mt-4 w-80 place-self-center text-pretty border-y border-stone-400 py-2 text-center font-medium">
          Your cart is empty {username}, please go back to the menu and add some
          delicious pizzas
        </h1>
      )}
    </div>
  );
}

export default Cart;
