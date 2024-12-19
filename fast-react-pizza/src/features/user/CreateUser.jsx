import { useState } from "react";
import Button from "../../ui/Button";

function CreateUser() {
  const [username, setUsername] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
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
