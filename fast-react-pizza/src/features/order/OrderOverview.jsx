import OrderItem from "./OrderItem";

function OrderOverview({ cart }) {
  return (
    <ul className="divide-y divide-stone-500 border-b border-t border-stone-400 px-10">
      {cart.map((item, i) => (
        <OrderItem item={item} key={i} />
      ))}
    </ul>
  );
}

export default OrderOverview;
