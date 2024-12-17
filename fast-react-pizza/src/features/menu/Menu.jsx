import { useLoaderData } from "react-router-dom";
import { getMenu } from "../../services/apiRestaurant";
import MenuItem from "./MenuItem";

function Menu() {
  //now to inject the data that we recieve from our loader function we do...
  //this is a fetch-while-render rather than the useEffect way of fetch-after-render
  const menuData = useLoaderData();
  return (
    // divide gives you a line between each list item, use padding in the li to keep this line in the middle of the two items
    <ul className="divide-y divide-stone-400 p-3">
      {menuData.map((pizza) => (
        <MenuItem pizza={pizza} key={pizza.id} />
      ))}
    </ul>
  );
}
//implementing react router data loading, suggested to put this function within the file that the data is going to be consumed in
export async function loader() {
  const menu = await getMenu();
  return menu;
}

export default Menu;
