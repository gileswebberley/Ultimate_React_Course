import { useSelector } from "react-redux";

import Logout from "./Logout";
import { getUsername } from "./userSlice";

function UserName() {
  const username = useSelector(getUsername);

  if (!username) return null;
  //Tailwind to hide username on a smaller screen
  return (
    <div className="hidden text-xs uppercase md:flex md:w-fit md:place-items-end md:items-center lg:text-sm">
      <span className="text-balance px-2 text-right">{username}</span>
      <span className="flex-initial">
        <Logout />
      </span>
    </div>
  );
}

export default UserName;
