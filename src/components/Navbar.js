"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/"; 
  };

  const menuGroups = [
    {
      title: "Academic",
      links: [
        { label: "Course Materials", href: "/materials" },
        { label: "Peer Tutors", href: "/tutors" },
        { label: "LaTeX Library", href: "/latex" },
        { label: "Office Hours", href: "/office-hours" },
        { label: "Thesis Repository", href: "/thesis" },
      ]
    },
    {
      title: "Community",
      links: [
        { label: "Q&A Forum", href: "/forum" },
        { label: "Study Groups", href: "/study-groups" },
        { label: "Teammate Finder", href: "/teammates" },
        { label: "Skill Exchange", href: "/skill-exchange" },
        { label: "Course Reviews", href: "/reviews" },
        { label: "Alumni Mentors", href: "/alumni" },
        { label: "Interview Prep", href: "/interviews" },
      ]
    },
    // The Campus category is back!
    {
      title: "Campus",
      links: [
        { label: "Event Calendar", href: "/events" },
        { label: "Marketplace", href: "/textbooks" },
        { label: "Lost & Found", href: "/lost-and-found" },
        { label: "Campus Directory", href: "/directory" },
      ]
    }
  ];

  return (
    <nav className="bg-blue-600 text-white shadow-md relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-100 transition-colors">
            Student Helper
          </Link>
          
          <div className="hidden md:flex items-center">
            
            <div className="flex items-center space-x-6 pr-6 border-r border-blue-400 h-8">
              {menuGroups.map((group) => (
                <div key={group.title} className="relative group py-4">
                  <button className="flex items-center gap-1 font-medium hover:text-blue-200 transition-colors">
                    {group.title} <span className="text-[10px] opacity-70">▼</span>
                  </button>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-48 bg-white rounded-md shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top -translate-y-2 group-hover:translate-y-0">
                    <div className="py-2">
                      {group.links.map((link) => (
                        <Link key={link.href} href={link.href} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors">
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="text-sm font-bold bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-lg transition-colors shadow-inner">
                    Dashboard
                  </Link>
                  <button onClick={handleLogout} className="text-sm hover:text-blue-200 px-2 py-1.5 transition-colors">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium hover:text-blue-200 transition-colors">Login</Link>
                  <Link href="/register" className="text-sm font-bold bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded transition-colors shadow-sm">Sign Up</Link>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}