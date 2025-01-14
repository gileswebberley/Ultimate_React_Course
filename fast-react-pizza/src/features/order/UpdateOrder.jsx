/* This is to implement use of the fetcher to change the form data by tying together a PATCH form request (which is used to update a piece of data within a form rather than PUT which is used to add another piece of data entirely, ie we change the priority field value rather than adding it as new) */

import { useFetcher } from "react-router-dom";
import Button from "../../ui/Button";
import { updateOrder } from "../../services/apiRestaurant";

function UpdateOrder() {
  const fetcher = useFetcher();
  //By using the fetcher.Form we can change data and force a revalidation of the overall page without navigating to a new route - when this is included in a page the react router will be aware that this is happening
  return (
    <fetcher.Form method="PATCH" className="text-right">
      <Button type="primary">Make Priority</Button>
    </fetcher.Form>
  );
}

export async function action({ request, params }) {
  const data = { priority: true };
  await updateOrder(params.orderId, data);
  return null;
}

export default UpdateOrder;
