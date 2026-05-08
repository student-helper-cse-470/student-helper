"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [urgency, setUrgency] = useState("Medium");

  // Load the user from local storage first, then fetch their specific assignments
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchAssignments(parsedUser.email);
    } else {
      setLoading(false); // Stop loading if not logged in
    }
  }, []);

  // Pass the email into the API call
  const fetchAssignments = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/assignments?userEmail=${email}`);
      if (!response.ok) throw new Error("Failed to fetch assignments");
      const data = await response.json();
      setAssignments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    
    setError(null);
    const newAssignment = { title, courseCode, dueDate, urgency, userEmail: user.email };

    try {
      const response = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAssignment),
      });

      if (!response.ok) throw new Error("Failed to add assignment");

      setTitle("");
      setCourseCode("");
      setDueDate("");
      setUrgency("Medium");
      fetchAssignments(user.email); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch("/api/assignments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isCompleted: !currentStatus }),
      });
      if (!response.ok) throw new Error("Failed to update status");
      const updatedAssignment = await response.json();
      setAssignments((prev) => prev.map((item) => (item._id === id ? updatedAssignment : item)));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    try {
      const response = await fetch(`/api/assignments?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete assignment");
      setAssignments((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const getUrgencyColor = (level) => {
    switch (level) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // LOGGED OUT VIEW
  if (!user && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-20 text-center font-sans">
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-200">
          <div className="text-4xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Personal Dashboard</h1>
          <p className="text-gray-600 mb-8">
            The deadline tracker is a personal tool. Please log in to manage your upcoming assignments and exams.
          </p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Log In to Continue
          </Link>
        </div>
      </div>
    );
  }

  // LOGGED IN VIEW
  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">{user?.name}'s Deadlines</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Assignment</h2>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., Final Essay" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value.toUpperCase())} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., HIST101" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" required value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Urgency</label>
              <select value={urgency} onChange={(e) => setUrgency(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Add Deadline
            </button>
          </form>
        </div>

        <div className="md:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading your assignments...</p>
          ) : assignments.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No upcoming deadlines. Enjoy your free time!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignments.map((task) => (
                <div key={task._id} className={`p-5 rounded-lg shadow border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${task.isCompleted ? "bg-gray-100 border-gray-200 opacity-60" : "bg-white border-gray-100"}`}>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-lg font-bold ${task.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>{task.title}</h3>
                      {!task.isCompleted && <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getUrgencyColor(task.urgency)}`}>{task.urgency}</span>}
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">{task.courseCode}</span>
                      <span className="bg-gray-200 px-2 py-1 rounded text-xs flex items-center">📅 Due: {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleToggleComplete(task._id, task.isCompleted)} className={`px-4 py-2 rounded text-sm font-bold transition-colors ${task.isCompleted ? "bg-gray-300 hover:bg-gray-400 text-gray-800" : "bg-green-600 hover:bg-green-700 text-white"}`}>
                      {task.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button onClick={() => handleDelete(task._id)} className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm font-bold transition-colors" title="Delete">✕</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}