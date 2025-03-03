import { useState } from "react";
import { Login } from "./Screens/Login";
import { Home } from "./Screens/Home";
import { User } from "firebase/auth";


export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [password, setPassword] = useState<string>("");


  return !user ? (
    <Login setUser={setUser} setPassword={setPassword} />
  ) : (
    <Home setUser={setUser} user={user} password={password} />
  );
}