import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "./userSlice";
import Button from "../../ui/Button";
import { clearCart } from "../cart/cartSlice";

function Logout() {
  const navigate = useNavigate();
  //const username = useSelector((state) => state.user.username);
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/");
  }
  return (
    <Button type="vsmall" onClick={handleLogout}>
      logout
    </Button>
  );
}

export default Logout;
