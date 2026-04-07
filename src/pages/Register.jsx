import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiPost } from "../services/api";

/**
 * Anime-Themed Registration Component
 * Features: 
 * - Floating background elements
 * - Glassmorphism with glowing borders
 * - Smooth CSS keyframe animations
 * - Responsive layout
 */

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    setError("");

    try {
      const res = await apiPost("/api/auth/register", { name, email, password });
      setMsg(res.message || "Welcome to the adventure! ✨ Please login.");
      setName("");
      setEmail("");
      setPassword("");
      setTimeout(() => nav("/login"), 2000);
    } catch (err) {
      setError(err.message || "The gate is closed... Try again! 💢");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* --- Anime Background Elements --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Gradient Blob 1 */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>
        {/* Animated Gradient Blob 2 */}
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] animate-pulse delay-700"></div>
        {/* Floating "Sparkles" / Particles */}
        <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white rounded-full animate-bounce delay-300"></div>
      </div>

      {/* --- Main Card --- */}
      <div className="relative w-full max-w-[90%] sm:max-w-md z-10">
        <div className="bg-slate-900/60 backdrop-blur-2xl border-2 border-white/10 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(236,72,153,0.3)] transform transition-all duration-500 hover:scale-[1.01] hover:border-pink-500/40">
          
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-bold uppercase tracking-widest mb-4 animate-bounce">
              New Journey Awaits
            </div>
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-cyan-200">
              Join Us
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">
              Create your <span className="text-cyan-400">CampusTrace</span> profile
            </p>
          </div>

          {/* Messages */}
          {msg && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 px-4 py-3 text-sm text-center flex items-center justify-center gap-2">
              <span>✨</span> {msg}
            </div>
          )}

          {error && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-300 px-4 py-3 text-sm text-center flex items-center justify-center gap-2">
              <span>💢</span> {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="group relative">
              <input
                className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 text-white placeholder-slate-500 border-2 border-white/5 
                           focus:outline-none focus:border-pink-500/50 focus:ring-4 focus:ring-pink-500/10 transition-all duration-300"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <input
                type="email"
                className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 text-white placeholder-slate-500 border-2 border-white/5 
                           focus:outline-none focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group relative">
              <input
                type="password"
                className="w-full px-5 py-4 rounded-2xl bg-slate-800/50 text-white placeholder-slate-500 border-2 border-white/5 
                           focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              disabled={loading}
              className={`group relative w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 overflow-hidden
                ${loading 
                  ? "bg-slate-700 cursor-not-allowed" 
                  : "bg-gradient-to-r from-pink-600 to-purple-600 hover:shadow-[0_0_20px_rgba(219,39,119,0.4)] active:scale-95"
                }
              `}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Summoning...
                  </>
                ) : (
                  "Create Account"
                )}
              </span>
              {/* Button Shine Effect */}
              {!loading && (
                <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white/20 opacity-40 group-hover:animate-shine" />
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-sm text-slate-400 text-center mt-8">
            Already a member of the guild?{" "}
            <Link 
              to="/login" 
              className="text-cyan-400 font-bold hover:text-pink-400 transition-colors duration-300 underline underline-offset-4 decoration-cyan-500/30"
            >
              Login here
            </Link>
          </p>
        </div>

        {/* Bottom Decorative Label */}
        <div className="mt-6 flex justify-center gap-4">
          <div className="h-1 w-8 bg-pink-500/50 rounded-full"></div>
          <div className="h-1 w-1 bg-pink-500/50 rounded-full"></div>
          <div className="h-1 w-1 bg-pink-500/50 rounded-full"></div>
        </div>
      </div>

      {/* --- Custom CSS for Anime Shimmer --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          100% {
            left: 125%;
          }
        }
        .animate-shine {
          animation: shine 0.8s forwards;
        }
      `}} />
    </div>
  );
}