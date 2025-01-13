import { useDispatch } from "react-redux";
import Button from "../../ui/Button";
import { decreaseItemQuantity, removeFromCart } from "./cartSlice";

/**
 *
 * @param {(pizzaId : number, quantity : number)} pizzaId unique identifier of the cart item
 * @param {} quantity - number of items to remove (if ommited or equal to 1 the item will be deleted from cart)
 * @returns a Button component with type 'small' that removes items from the cart
 */
function RemoveFromCart({ children, pizzaId, quantity = 1 }) {
  //   const quantity = useSelector(getCurrentQuantityById(pizzaId));
  const dispatch = useDispatch();

  function handleRemoveFromCart() {
    //if there's more than one just decrease the number of items, actually I've put this use-case into the decreaseItemQuantity so let's leave it to that
    dispatch(decreaseItemQuantity(pizzaId));
    // if (quantity > 1) dispatch(decreaseItemQuantity(pizzaId));
    // else dispatch(removeFromCart(pizzaId));
  }

  return (
    <Button type="small" onClick={() => handleRemoveFromCart(pizzaId)}>
      {children}
    </Button>
  );
}

export default RemoveFromCart;
