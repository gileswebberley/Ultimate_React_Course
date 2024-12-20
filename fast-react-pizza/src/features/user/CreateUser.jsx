import { useState } from "react";
import Button from "../../ui/Button";
import { useDispatch } from "react-redux";
import { updateName } from "./userSlice";
import { useNavigate } from "react-router-dom";

function CreateUser() {
  //Do this - never update the Redux store from a controlled element
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (!username) return;
    dispatch(updateName(username));
    navigate("/menu");
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="pb-1 text-sm text-stone-700 md:text-base">
        <span className="text-2xl font-bold text-stone-600">Welcome</span>
        <br />
        Please start by telling us your name
      </p>

      <input
        type="text"
        placeholder="Your full name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="input w-64"
      />

      {username !== "" && (
        <div className="mt-2">
          <Button>Start ordering</Button>
        </div>
      )}
    </form>
  );
}

export default CreateUser;
