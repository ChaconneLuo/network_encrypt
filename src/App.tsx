import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [numberList, setNumberList] = useState([]);
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  async function generate_number_list(length: number, min: number, max: number) {
    setNumberList(await invoke("generate_random_number_list", { length, min, max }));
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!</h1>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
          generate_number_list(10, 1, 100);
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
    </div>
  );
}

export default App;
