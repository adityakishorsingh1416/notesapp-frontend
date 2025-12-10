import Notes from "./pages/Notes.jsx";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    fetch("https://notesapp-backend-576p.onrender.com", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setLoggedIn(data.loggedIn);

        if (data.username) {
          setUsername(data.username);
        }

        setLoading(false);  // stop loading
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // 🔥 WAIT for backend — don't redirect immediately
  if (loading) {
    return <div className="text-white p-5">Checking session...</div>;
  }

  // ❌ Only redirect AFTER backend confirms loggedOut
  if (!loggedIn) {
    window.location.href = "https://notesapp-backend-576p.onrender.com/login";
    return null;
  }

  return <Notes username={username} />;
}

export default App;
