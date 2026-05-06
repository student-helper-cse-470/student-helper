"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Sticky Note State
  const [notes, setNotes] = useState([]);
  const [noteContent, setNoteContent] = useState("");
  const [noteColor, setNoteColor] = useState("bg-yellow-200");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchNotes(parsedUser.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotes = async (email) => {
    try {
      const response = await fetch(`/api/notes?userEmail=${email}`);
      if (response.ok) {
        setNotes(await response.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!user || !noteContent.trim()) return;

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: noteContent, color: noteColor, userEmail: user.email }),
      });

      if (response.ok) {
        setNoteContent("");
        fetchNotes(user.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await fetch(`/api/notes?id=${id}`, { method: "DELETE" });
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return null;

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-20 text-center font-sans">
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-200">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to view your private dashboard.</p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">Log In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      
      {/* Profile Header */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold border-2 border-blue-200">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Welcome back, {user.name}</h1>
          <p className="text-gray-500 font-medium">Student ID / Email: {user.email}</p>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Private Tools</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link href="/assignments" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-red-300 transition-all flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">📅</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Deadlines</h3>
          <p className="text-gray-500 text-sm">Track your upcoming assignments and exams.</p>
        </Link>
        <Link href="/progress" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-emerald-300 transition-all flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Degree Progress</h3>
          <p className="text-gray-500 text-sm">Manage your completed credits and core requirements.</p>
        </Link>
        <Link href="/extracurriculars" className="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-purple-300 transition-all flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">🏆</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Experience Log</h3>
          <p className="text-gray-500 text-sm">Build your digital resume with clubs and hackathons.</p>
        </Link>
      </div>

      {/* Sticky Notes Section */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-inner">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">📌 Scratchpad Wall</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          
          {/* Add Note Form */}
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 flex flex-col h-64">
            <textarea 
              value={noteContent} 
              onChange={(e) => setNoteContent(e.target.value)} 
              placeholder="Jot down a quick thought, reminder, or grocery item..." 
              className="w-full flex-1 resize-none outline-none text-gray-800 mb-3"
            />
            <div className="flex justify-between items-center mt-auto border-t pt-3">
              <div className="flex gap-1">
                <button onClick={() => setNoteColor("bg-yellow-200")} className={`w-5 h-5 rounded-full bg-yellow-200 border-2 ${noteColor === "bg-yellow-200" ? "border-gray-800" : "border-transparent"}`}></button>
                <button onClick={() => setNoteColor("bg-blue-200")} className={`w-5 h-5 rounded-full bg-blue-200 border-2 ${noteColor === "bg-blue-200" ? "border-gray-800" : "border-transparent"}`}></button>
                <button onClick={() => setNoteColor("bg-pink-200")} className={`w-5 h-5 rounded-full bg-pink-200 border-2 ${noteColor === "bg-pink-200" ? "border-gray-800" : "border-transparent"}`}></button>
                <button onClick={() => setNoteColor("bg-green-200")} className={`w-5 h-5 rounded-full bg-green-200 border-2 ${noteColor === "bg-green-200" ? "border-gray-800" : "border-transparent"}`}></button>
              </div>
              <button onClick={handleAddNote} className="bg-gray-900 hover:bg-gray-700 text-white text-xs font-bold py-1.5 px-3 rounded transition-colors">Post</button>
            </div>
          </div>

          {/* Rendered Notes */}
          {notes.map((note) => (
            <div key={note._id} className={`${note.color} p-4 rounded-lg shadow-md flex flex-col h-64 relative group transform hover:-translate-y-1 transition-transform`}>
              <button onClick={() => handleDeleteNote(note._id)} className="absolute top-2 right-2 text-gray-600 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">✕</button>
              <p className="text-gray-900 font-medium whitespace-pre-wrap overflow-y-auto mt-4">{note.content}</p>
              <span className="text-xs text-gray-600 mt-auto pt-2 opacity-50">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}