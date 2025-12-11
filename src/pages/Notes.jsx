import React, { useEffect, useState } from "react";

const Notes = ({ username }) => {
  const [details, setDetails] = useState("");
  const [title, setTitle] = useState("");
  const [task, setTask] = useState([]);

  const [editId, setEditId] = useState(null);
  const [editDetails, setEditDetails] = useState("");
  const [editTitle, setEditTitle] = useState("");

  const logout = () => {
    window.location.href = "https://notesapp-backend-576p.onrender.com/logout";
  };

  // FETCH NOTES
  const fetchNotes = async () => {
    try {
      const res = await fetch(
        "https://notesapp-backend-576p.onrender.com/api/notes",
        {
          credentials: "include"   // ✅ REQUIRED
        }
      );
      const data = await res.json();
      setTask(data);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // ADD NOTE
  const submitt = async (e) => {
    e.preventDefault();

    if (!details || !title) return alert("Fill both fields");

    try {
      const res = await fetch(
        "https://notesapp-backend-576p.onrender.com/api/notes",
        {
          method: "POST",
          credentials: "include",    // ✅ REQUIRED
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heading: details,
            content: title,
          }),
        }
      );

      const data = await res.json();
      setTask([...task, data.newNote]);

      setDetails("");
      setTitle("");
    } catch (err) {
      console.log("Save error:", err);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      await fetch(
        `https://notesapp-backend-576p.onrender.com/api/notes/${id}`,
        {
          method: "DELETE",
          credentials: "include",  // ✅ REQUIRED
        }
      );

      setTask(task.filter((note) => note._id !== id));
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  // EDIT NOTE
  const startEdit = (note) => {
    setEditId(note._id);
    setEditDetails(note.heading);
    setEditTitle(note.content);
  };

  const saveEdit = async () => {
    try {
      const res = await fetch(
        `https://notesapp-backend-576p.onrender.com/api/notes/${editId}`,
        {
          method: "PUT",
          credentials: "include",   // ✅ REQUIRED
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            heading: editDetails,
            content: editTitle,
          }),
        }
      );

      const data = await res.json();

      setTask(
        task.map((note) => (note._id === editId ? data.updatedNote : note))
      );

      setEditId(null);
      setEditDetails("");
      setEditTitle("");
    } catch (err) {
      console.log("Edit error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 flex justify-center items-start py-10 px-4">
      <div className="w-full max-w-xl bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            Welcome, <span className="text-pink-300 font-bold">{username}</span>
          </h2>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        {/* FORM + LIST SAME AS YOUR CODE */}
        ...
      </div>
    </div>
  );
};

export default Notes;
