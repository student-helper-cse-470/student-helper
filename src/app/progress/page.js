"use client";

import { useState, useEffect } from "react";

export default function ProgressPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Dashboard State
  const [totalCredits, setTotalCredits] = useState(120);
  const [completedCredits, setCompletedCredits] = useState(0);
  const [requirements, setRequirements] = useState([]);
  
  // Input for new requirement
  const [reqName, setReqName] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchProgress(parsedUser.email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProgress = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/progress?userEmail=${email}`);
      const data = await response.json();
      if (!data.error) {
        setTotalCredits(data.totalCredits || 120);
        setCompletedCredits(data.completedCredits || 0);
        setRequirements(data.requirements || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAll = async () => {
    if (!user) return;
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userEmail: user.email, 
          totalCredits, 
          completedCredits, 
          requirements 
        }),
      });
      alert("Progress saved successfully!");
    } catch (err) {
      alert("Failed to save progress.");
    }
  };

  const handleAddRequirement = (e) => {
    e.preventDefault();
    if (!reqName.trim()) return;
    setRequirements([...requirements, { name: reqName, isCompleted: false }]);
    setReqName("");
  };

  const toggleRequirement = (index) => {
    const newReqs = [...requirements];
    newReqs[index].isCompleted = !newReqs[index].isCompleted;
    setRequirements(newReqs);
  };

  const removeRequirement = (index) => {
    const newReqs = [...requirements];
    newReqs.splice(index, 1);
    setRequirements(newReqs);
  };

  // Math for the progress bar
  const percent = totalCredits > 0 ? Math.min(100, Math.round((completedCredits / totalCredits) * 100)) : 0;

  // Logged out view
  if (!user && !loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 mt-20 text-center font-sans">
        <div className="bg-white p-10 rounded-xl shadow-md border border-gray-200">
          <div className="text-4xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Academic Progress Tracker</h1>
          <p className="text-gray-600 mb-8">Log in to track your credits, manage degree requirements, and visualize your path to graduation.</p>
          <a href="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">Log In to Continue</a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">My Degree Progress</h1>
          <p className="text-gray-500">Track your journey to graduation.</p>
        </div>
        <button onClick={handleSaveAll} className="bg-gray-900 hover:bg-gray-800 text-white font-bold py-2 px-6 rounded shadow transition-colors">
          Save All Changes
        </button>
      </div>

      {/* Credit Progress Bar Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Overall Credits</h2>
          <span className="text-2xl font-extrabold text-blue-600">{percent}%</span>
        </div>
        
        {/* The visual bar */}
        <div className="w-full bg-gray-200 rounded-full h-6 mb-6 overflow-hidden border border-gray-300">
          <div className="bg-blue-600 h-6 transition-all duration-500 ease-out flex items-center justify-end px-2" style={{ width: `${percent}%` }}>
            {percent > 5 && <span className="text-xs font-bold text-white">{completedCredits} / {totalCredits}</span>}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Completed Credits</label>
            <input type="number" min="0" value={completedCredits} onChange={(e) => setCompletedCredits(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-lg font-bold" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Total Required</label>
            <input type="number" min="1" value={totalCredits} onChange={(e) => setTotalCredits(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-lg text-gray-500" />
          </div>
        </div>
      </div>

      {/* Checklist Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Core Major Requirements</h2>
        
        <form onSubmit={handleAddRequirement} className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={reqName} 
            onChange={(e) => setReqName(e.target.value)} 
            placeholder="e.g., Intro to Algorithms, Physics II Lab..." 
            className="flex-1 border border-gray-300 rounded px-3 py-2"
          />
          <button type="submit" className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold py-2 px-4 rounded transition-colors">Add</button>
        </form>

        {requirements.length === 0 ? (
          <p className="text-gray-500 italic text-center p-4">No core requirements added yet.</p>
        ) : (
          <div className="space-y-2">
            {requirements.map((req, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded border transition-colors ${req.isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => toggleRequirement(index)}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${req.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-400 bg-white'}`}>
                    {req.isCompleted && "✓"}
                  </div>
                  <span className={`text-lg ${req.isCompleted ? 'text-gray-500 line-through' : 'text-gray-800 font-medium'}`}>{req.name}</span>
                </div>
                <button onClick={() => removeRequirement(index)} className="text-gray-400 hover:text-red-500 font-bold px-2">✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}