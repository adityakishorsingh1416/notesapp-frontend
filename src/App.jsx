import Notes from "./pages/Notes.jsx";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("https://notesapp-backend-576p.onrender.com/check", {
      credentials: "include"
    })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.loggedIn);

        if (data.username) {
          setUsername(data.username);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-white p-5">Checking session...</div>;
  }

  if (!loggedIn) {
    window.location.href =
      "https://notesapp-backend-576p.onrender.com/login";
    return null;
  }

  return <Notes username={username} />;
}

export default App;
