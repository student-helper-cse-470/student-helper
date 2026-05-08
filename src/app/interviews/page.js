"use client";

import { useState, useEffect } from "react";

export default function InterviewPrepPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState("");

  // Form State
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("Technical");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionText, setQuestionText] = useState("");

  useEffect(() => {
    fetchQuestions();
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/interviews");
      if (!response.ok) throw new Error("Failed to fetch prep bank");
      setQuestions(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to contribute.");
    
    const newEntry = { 
      company, role, type, difficulty, question: questionText, 
      author: user.name, userEmail: user.email 
    };

    try {
      const response = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });

      if (!response.ok) throw new Error("Failed to post");

      setCompany(""); setRole(""); setType("Technical"); setDifficulty("Medium"); setQuestionText("");
      fetchQuestions(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;
    try {
      await fetch(`/api/interviews?id=${id}`, { method: "DELETE" });
      setQuestions((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredQuestions = questions.filter(q => 
    q.company.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDifficultyColor = (level) => {
    switch (level) {
      case "Easy": return "bg-green-100 text-green-800 border-green-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Interview Prep Bank</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Share Experience */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Share an Interview Question</h2>
          
          {!user && (
            <div className="mb-4 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
              <a href="/login" className="font-bold underline">Log in</a> to help your peers prep.
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input type="text" required disabled={!user} value={company} onChange={(e) => setCompany(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 font-bold" placeholder="e.g., Meta, Local Startup" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role Interviewed For</label>
              <input type="text" required disabled={!user} value={role} onChange={(e) => setRole(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., Backend Engineering Intern" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select disabled={!user} value={type} onChange={(e) => setType(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="Technical">Technical</option>
                  <option value="Behavioral">Behavioral</option>
                  <option value="System Design">System Design</option>
                  <option value="General Experience">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                <select disabled={!user} value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2">
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">The Question / Experience</label>
              <textarea required disabled={!user} rows="5" value={questionText} onChange={(e) => setQuestionText(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 resize-none text-sm" placeholder="What did they ask you? How did you solve it?" />
            </div>
            <button type="submit" disabled={!user} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">
              Add to Bank
            </button>
          </form>
        </div>

        {/* Right Column: Database Feed */}
        <div className="lg:col-span-2">
          
          <div className="mb-6">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search by company or role..." 
              className="w-full border border-gray-300 rounded-lg px-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
          </div>

          {loading ? (
            <p className="text-gray-500">Querying prep bank...</p>
          ) : questions.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">The bank is empty. Be the first to share your interview experience!</p>
            </div>
          ) : filteredQuestions.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No questions match your search.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative group transition-shadow hover:shadow-md">
                  
                  {user && user.email === q.userEmail && (
                    <button onClick={() => handleDelete(q._id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-2 rounded">✕</button>
                  )}
                  
                  <div className="flex justify-between items-start mb-3 pr-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{q.company}</h3>
                      <p className="text-sm font-semibold text-blue-700">{q.role}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getDifficultyColor(q.difficulty)}`}>{q.difficulty}</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded text-xs font-medium border border-gray-200">{q.type}</span>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded text-gray-800 text-sm whitespace-pre-wrap mb-3 font-mono">
                    {q.question}
                  </div>
                  
                  <p className="text-xs text-gray-500 text-right">Shared by {q.author}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}