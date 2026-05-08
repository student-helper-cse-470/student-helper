"use client";

import { useState, useEffect } from "react";
// Import KaTeX for rendering equations
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

export default function LatexPage() {
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [latexCode, setLatexCode] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSnippets();
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const fetchSnippets = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/latex");
      if (!response.ok) throw new Error("Failed to fetch snippets");
      setSnippets(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to share a snippet.");
    
    setError(null);
    const newSnippet = { 
      title, 
      latexCode, 
      description, 
      author: user.name, 
      userEmail: user.email 
    };

    try {
      const response = await fetch("/api/latex", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSnippet),
      });

      if (!response.ok) throw new Error("Failed to post snippet");

      setTitle("");
      setLatexCode("");
      setDescription("");
      fetchSnippets(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this snippet?")) return;
    try {
      const response = await fetch(`/api/latex?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setSnippets((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("LaTeX code copied to clipboard!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">LaTeX Snippet Library</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Post a Snippet */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Share a Snippet</h2>
          
          {!user && (
            <div className="mb-4 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
              <a href="/login" className="font-bold underline">Log in</a> to share your formulas.
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Equation Title</label>
              <input type="text" required disabled={!user} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., Quadratic Formula" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LaTeX Code</label>
              <textarea required disabled={!user} rows="4" value={latexCode} onChange={(e) => setLatexCode(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm bg-gray-50" placeholder="x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input type="text" required disabled={!user} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="What is this used for?" />
            </div>
            <button type="submit" disabled={!user} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">
              Save Snippet
            </button>
          </form>
        </div>

        {/* Right Column: Snippet Feed */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading library...</p>
          ) : snippets.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">The library is empty. Be the first to share an equation!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {snippets.map((snippet) => (
                <div key={snippet._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative group">
                  
                  {/* Delete Button (Only shows if the logged-in user owns the post) */}
                  {user && user.email === snippet.userEmail && (
                    <button onClick={() => handleDelete(snippet._id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                  )}
                  
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{snippet.title}</h3>
                    <button onClick={() => copyToClipboard(snippet.latexCode)} className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded transition-colors">
                      Copy Code
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">By {snippet.author} • {snippet.description}</p>
                  
                  {/* Rendered Equation Block */}
                  <div className="bg-slate-50 border border-slate-200 rounded p-4 mb-4 overflow-x-auto text-lg text-slate-800">
                    <BlockMath math={snippet.latexCode} />
                  </div>
                  
                  {/* Raw Code Block */}
                  <div className="bg-gray-900 text-green-400 font-mono text-sm p-3 rounded overflow-x-auto">
                    <code>{snippet.latexCode}</code>
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