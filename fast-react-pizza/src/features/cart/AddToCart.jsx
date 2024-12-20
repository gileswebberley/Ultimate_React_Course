import { useDispatch } from "react-redux";
import { addToCart } from "./cartSlice";
import Button from "../../ui/Button";

function AddToCart({ children, pizza }) {
  const { id, name, unitPrice } = pizza;
  const dispatch = useDispatch();

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice,
    };
    dispatch(addToCart(newItem));
  }

  return (
    <Button type="small" onClick={handleAddToCart}>
      {children}
    </Button>
  );
}

export default AddToCart;
