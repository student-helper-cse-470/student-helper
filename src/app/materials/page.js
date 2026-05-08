"use client";

import { useState, useEffect } from "react";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [title, setTitle] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [category, setCategory] = useState("Lecture Notes");
  const [link, setLink] = useState("");

  // Filter State
  const [filterCode, setFilterCode] = useState("");

  const fetchMaterials = async (code = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = code ? `/api/materials?courseCode=${code}` : "/api/materials";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to fetch materials");
      }
      const data = await response.json();
      setMaterials(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchMaterials(filterCode);
  };

  const handleClearFilter = () => {
    setFilterCode("");
    fetchMaterials("");
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const newMaterial = { title, courseCode, category, link };

    try {
      const response = await fetch("/api/materials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMaterial),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload material");
      }

      // Clear form and refresh the list
      setTitle("");
      setCourseCode("");
      setCategory("Lecture Notes");
      setLink("");
      fetchMaterials(filterCode);
    } catch (err) {
      setError(err.message);
    }
  };

  // NEW: Handle Upvoting and Downvoting
  const handleVote = async (id, action) => {
    try {
      const response = await fetch("/api/materials", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, action }),
      });

      if (!response.ok) {
        throw new Error("Failed to register vote");
      }

      const updatedMaterial = await response.json();

      // Instantly update the UI by replacing the old material data with the newly fetched data
      setMaterials((prevMaterials) =>
        prevMaterials.map((mat) => (mat._id === id ? updatedMaterial : mat))
      );
    } catch (err) {
      // Use a simple alert for voting errors so it doesn't disrupt the whole page layout
      alert(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Course Material Repository</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Upload Form */}
        <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md border border-gray-200 h-fit">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Upload Material</h2>
          <form onSubmit={handleUploadSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Midterm Review Guide"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input
                type="text"
                required
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value.toUpperCase())}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., CS101"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Past Exams">Past Exams</option>
                <option value="Syllabus">Syllabus</option>
                <option value="Study Guides">Study Guides</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
              <input
                type="url"
                required
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://drive.google.com/..."
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Upload Resource
            </button>
          </form>
        </div>

        {/* Right Column: Material List & Filter */}
        <div className="md:col-span-2">
          <div className="bg-white p-4 rounded-lg shadow-md border border-gray-200 mb-6 flex items-end gap-4">
            <form onSubmit={handleFilterSubmit} className="flex-1 flex gap-2 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Course Code</label>
                <input
                  type="text"
                  value={filterCode}
                  onChange={(e) => setFilterCode(e.target.value.toUpperCase())}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., MATH200"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded"
              >
                Filter
              </button>
            </form>
            <button
              onClick={handleClearFilter}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Clear
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading materials...</p>
          ) : materials.length === 0 ? (
            <div className="bg-gray-50 p-8 text-center rounded border border-dashed border-gray-300">
              <p className="text-gray-500">No materials found. Be the first to upload!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map((mat) => (
                <div key={mat._id} className="bg-white p-5 rounded-lg shadow border border-gray-100 flex flex-col sm:flex-row sm:items-center gap-4">
                  
                  {/* Voting Block */}
                  <div className="flex sm:flex-col items-center justify-center gap-1 bg-gray-50 p-2 rounded border border-gray-200 min-w-[50px]">
                    <button
                      onClick={() => handleVote(mat._id, "upvote")}
                      className="text-gray-400 hover:text-blue-600 font-bold px-2 py-1 transition-colors text-lg"
                      title="Upvote"
                    >
                      ▲
                    </button>
                    {/* Displaying Net Score (Upvotes - Downvotes) */}
                    <span className={`font-bold text-sm ${(mat.upvotes || 0) - (mat.downvotes || 0) >= 0 ? 'text-gray-700' : 'text-red-600'}`}>
                      {(mat.upvotes || 0) - (mat.downvotes || 0)}
                    </span>
                    <button
                      onClick={() => handleVote(mat._id, "downvote")}
                      className="text-gray-400 hover:text-red-600 font-bold px-2 py-1 transition-colors text-lg"
                      title="Downvote"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Material Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-blue-700">{mat.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                        {mat.courseCode}
                      </span>
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                        {mat.category}
                      </span>
                      <span className="text-gray-400 text-xs flex items-center">
                        Uploaded: {new Date(mat.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={mat.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded transition-colors text-center whitespace-nowrap"
                  >
                    View Material
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}