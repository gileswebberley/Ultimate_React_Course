import { Link } from "react-router-dom";
//First bit of Flexbox implementation with Tailwind
const stylingP = "space-x-2 font-semibold";

function CartOverview() {
  return (
    <div className="flex items-center justify-between">
      <p className={stylingP}>
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
