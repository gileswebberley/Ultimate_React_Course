import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getNumberOfPizzas, getTotalCartPrice } from "./cartSlice";
import { formatCurrency } from "../../utils/helpers";

function CartOverview() {
  //here we work out the total pizzas but it is actually better to put this in the cart slice (so any functionality to do with the relative state)
  // const numberOfPizzas = useSelector((state) => ....
  const numberOfPizzas = useSelector(getNumberOfPizzas);
  const totalCartPrice = useSelector(getTotalCartPrice);

  //hide this overview when the cart is empty...no need, it's in the Footer

  return (
    <div className="flex items-center justify-between">
      <p className="space-x-2 font-semibold">
        <span>{numberOfPizzas} pizzas</span>
        <span>{formatCurrency(totalCartPrice)}</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
