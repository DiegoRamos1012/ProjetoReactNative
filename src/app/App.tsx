import { useState } from "react";
import { User } from "firebase/auth";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  return <AppNavigator user={user} setUser={setUser} />;
}
