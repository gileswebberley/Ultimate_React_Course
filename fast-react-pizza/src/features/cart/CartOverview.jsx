import { Link } from "react-router-dom";
const stylingDiv =
  "absolute inset-x-0 bottom-0 ml-6 rounded-tl-2xl border-l-2 border-t-2 border-stone-700 bg-stone-600 px-5 py-3 text-stone-300";
const stylingP = "space-x-2 font-semibold";

function CartOverview() {
  return (
    <div className={stylingDiv}>
      <p className={stylingP}>
        <span>23 pizzas</span>
        <span>$23.45</span>
      </p>
      <Link to="/cart">Open cart &rarr;</Link>
    </div>
  );
}

export default CartOverview;
