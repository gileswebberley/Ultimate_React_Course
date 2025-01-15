import { useFetcher } from "react-router-dom";
import OrderItem from "./OrderItem";
import { useEffect } from "react";

function OrderOverview({ cart }) {
  //sometimes we might wanty to use data from another route without navigating to the relevant path, that's wehen a fetcher is useful
  const fetcher = useFetcher();

  //here we are going to get the ingredients information from the menu route using the fetcher - this essentially runs the loader function on the Menu component
  useEffect(
    function () {
      if (!fetcher.data && fetcher.state === "idle") {
        fetcher.load("/menu");
      }
    },
    [fetcher],
  );

  if (fetcher.data) console.table(fetcher.data);

  return (
    <ul className="divide-y divide-stone-500 border-b border-t border-stone-400 px-10">
      {cart.map((item, i) => (
        <OrderItem
          item={item}
          key={i}
          ingredients={
            fetcher.data?.find((el) => el.id === item.pizzaId).ingredients
          }
          isLoadingIngredients={fetcher.state === "loading" && !fetcher.data}
        />
      ))}
    </ul>
  );
}

export default OrderOverview;
