"use client";

import { useState, useEffect } from "react";

export default function ForumPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NEW: Store the logged-in user
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [body, setBody] = useState("");
  const [replyInputs, setReplyInputs] = useState({});

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/questions");
      if (!response.ok) throw new Error("Failed to fetch forum threads");
      setQuestions(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // NEW: Fetch both the questions AND the logged-in user on load
  useEffect(() => {
    fetchQuestions();
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleAskSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // NEW: Automatically grab the user's name, or default to Anonymous if logged out
    const authorName = user ? user.name : "Anonymous Student";
    const newQuestion = { title, courseCode, body, author: authorName };

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion),
      });

      if (!response.ok) throw new Error("Failed to post question");

      setTitle("");
      setCourseCode("");
      setBody("");
      fetchQuestions();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReplyChange = (questionId, text) => {
    setReplyInputs((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleReplySubmit = async (e, questionId) => {
    e.preventDefault();
    const replyText = replyInputs[questionId];
    if (!replyText || replyText.trim() === "") return;

    // NEW: Automatically grab the user's name for replies too
    const authorName = user ? user.name : "Anonymous Student";

    try {
      const response = await fetch("/api/questions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId, text: replyText, author: authorName }),
      });

      if (!response.ok) throw new Error("Failed to post reply");

      setReplyInputs((prev) => ({ ...prev, [questionId]: "" }));
      fetchQuestions();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Q&A Discussion Forum</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ask a Question Form */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Ask a Question</h2>
          
          {/* NEW: Prompt users to log in if they want their name attached */}
          {!user && (
            <div className="mb-4 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
              You are posting anonymously. <a href="/login" className="font-bold underline">Log in</a> to post as yourself.
            </div>
          )}

          <form onSubmit={handleAskSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input type="text" required value={courseCode} onChange={(e) => setCourseCode(e.target.value.toUpperCase())} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., PHY101" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., Need help with Newton's 3rd Law" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea required rows="4" value={body} onChange={(e) => setBody(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 resize-none" placeholder="Explain what you are struggling with..." />
            </div>
            
            {/* The "Your Name" input has been completely removed! */}
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors">
              Post Question {user && `as ${user.name}`}
            </button>
          </form>
        </div>

        {/* Forum Feed (Unchanged) */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading discussion threads...</p>
          ) : questions.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No questions asked yet. Be the first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q) => (
                <div key={q._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-bold mr-3">{q.courseCode}</span>
                    <span className="text-sm text-gray-500">Posted by <strong>{q.author}</strong> on {new Date(q.createdAt).toLocaleDateString()}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2">{q.title}</h3>
                    <p className="text-gray-700 mt-2 whitespace-pre-wrap">{q.body}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 mt-4 border border-gray-100">
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-3">{q.replies.length} {q.replies.length === 1 ? 'Reply' : 'Replies'}</h4>
                    <div className="space-y-3 mb-4 max-h-[300px] overflow-y-auto pr-2">
                      {q.replies.map((reply, index) => (
                        <div key={index} className="bg-white p-3 rounded shadow-sm border border-gray-100 text-sm">
                          <p className="text-gray-800 whitespace-pre-wrap">{reply.text}</p>
                          <p className="text-gray-400 text-xs mt-2 text-right">— {reply.author} at {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
                      ))}
                    </div>
                    <form onSubmit={(e) => handleReplySubmit(e, q._id)} className="flex gap-2">
                      <input type="text" value={replyInputs[q._id] || ""} onChange={(e) => handleReplyChange(q._id, e.target.value)} placeholder="Type your reply here..." className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm" />
                      <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded text-sm">Reply</button>
                    </form>
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