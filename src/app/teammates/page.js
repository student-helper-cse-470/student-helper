"use client";

import { useState, useEffect } from "react";

export default function TeammatesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [skills, setSkills] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  useEffect(() => {
    fetchPosts();
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setContactInfo(parsedUser.email); // Auto-fill their email as default contact
    }
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/teammates");
      if (!response.ok) throw new Error("Failed to fetch posts");
      setPosts(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to post.");
    
    setError(null);
    const newPost = { 
      title, 
      description, 
      skills, 
      author: user.name, 
      userEmail: user.email,
      contactInfo 
    };

    try {
      const response = await fetch("/api/teammates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error("Failed to post request");

      setTitle("");
      setDescription("");
      setSkills("");
      fetchPosts(); 
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Did you find your team? Delete this post?")) return;
    try {
      const response = await fetch(`/api/teammates?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete");
      setPosts((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Project Teammate Finder</h1>

      {error && <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-6">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Post a Request */}
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit sticky top-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Find a Partner</h2>
          
          {!user && (
            <div className="mb-4 text-sm text-amber-700 bg-amber-50 p-3 rounded border border-amber-200">
              <a href="/login" className="font-bold underline">Log in</a> to recruit teammates.
            </div>
          )}

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project / Request Title</label>
              <input type="text" required disabled={!user} value={title} onChange={(e) => setTitle(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., Need UI Designer for Hackathon" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills (Comma separated)</label>
              <input type="text" required disabled={!user} value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="e.g., React, Node.js, Figma" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <textarea required disabled={!user} rows="4" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 resize-none" placeholder="What are you building? What is the timeline?" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Method</label>
              <input type="text" required disabled={!user} value={contactInfo} onChange={(e) => setContactInfo(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2" placeholder="Email or Discord ID" />
            </div>
            <button type="submit" disabled={!user} className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded transition-colors">
              Post Request
            </button>
          </form>
        </div>

        {/* Right Column: Recruitment Feed */}
        <div className="lg:col-span-2">
          {loading ? (
            <p className="text-gray-500">Loading open requests...</p>
          ) : posts.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No open requests. Pitch your project first!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 relative group transition-all hover:shadow-md">
                  
                  {user && user.email === post.userEmail && (
                    <button onClick={() => handleDelete(post._id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-white" title="Remove Post">✕</button>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-1 pr-6">{post.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">Posted by <strong>{post.author}</strong></p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.skills.split(',').map((skill, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-1 rounded text-xs font-bold tracking-wide">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>

                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.description}</p>
                  
                  <div className="bg-gray-50 border border-gray-100 p-3 rounded flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-600">Interested? Contact:</span>
                    <span className="text-sm font-bold text-gray-800">{post.contactInfo}</span>
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