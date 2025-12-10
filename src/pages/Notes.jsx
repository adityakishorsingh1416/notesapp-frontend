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
      const res = await fetch("https://notesapp-backend-576p.onrender.com/api/notes");
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
      const res = await fetch("https://notesapp-backend-576p.onrender.com/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: details,
          content: title,
        }),
      });

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
      await fetch(`https://notesapp-backend-576p.onrender.com/api/notes/${id}`, {
        method: "DELETE",
      });

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
      const res = await fetch(`https://notesapp-backend-576p.onrender.com/api/notes/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: editDetails,
          content: editTitle,
        }),
      });

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

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white text-xl font-semibold">
            Welcome,{" "}
            <span className="text-pink-300 font-bold">
              {username ? username : "User"}
            </span>
          </h2>

          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <h1 className="text-center text-white text-3xl font-bold mb-6 tracking-wide drop-shadow-lg">
          🌈 Notes Creator
        </h1>

        {/* ADD FORM */}
        <form onSubmit={submitt} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter notes heading..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 focus:bg-white text-gray-700 shadow-md transition-all"
          />
          <input
            type="text"
            placeholder="Enter the details..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-xl bg-white/70 focus:bg-white text-gray-700 shadow-md transition-all"
          />

          <button
            className="px-4 py-3 mt-1 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-bold shadow-lg hover:shadow-2xl transition-all"
          >
            Add Notes
          </button>
        </form>

        {/* NOTES LIST */}
        <div className="mt-8 space-y-4">
          {task.map((note) => (
            <div
              key={note._id}
              className="p-5 rounded-2xl bg-white/20 backdrop-blur-lg shadow-lg border border-white/30"
            >
              {editId === note._id ? (
                <div className="space-y-3">
                  <input
                    className="p-3 rounded-lg w-full text-black"
                    value={editDetails}
                    onChange={(e) => setEditDetails(e.target.value)}
                  />
                  <input
                    className="p-3 rounded-lg w-full text-black"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />

                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mr-3"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => setEditId(null)}
                    className="px-4 py-2 bg-gray-400 text-white rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div>
                  <h2 className="text-white font-bold text-xl">{note.heading}</h2>
                  <p className="text-white/90 mt-1">{note.content}</p>

                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => startEdit(note)}
                      className="px-4 py-2 bg-yellow-400 text-black font-semibold rounded-lg shadow transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteNote(note._id)}
                      className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Notes;
