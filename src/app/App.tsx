import { useState } from "react";
import { Login } from "./Screens/Login";
import { Home } from "./Screens/Home";

interface User {
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);


  return !user ? (
    <Login setUser={setUser} />
  ) : (
    <Home setUser={setUser} user={user} />
  );
}