import { useState } from "react";
import { Login } from "./Login";
import { Home } from "./Home";

export default function App() {
  const [user, setUser] = useState();

  return !user ? <Login setUser={setUser} /> : <Home />;
}
