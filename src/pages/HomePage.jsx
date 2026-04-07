import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, ShieldCheck, Sparkles, ArrowRight, Package, Zap } from "lucide-react";

export default function HomePage() {
  const stats = useMemo(
    () => [
      { label: "Fast Search", value: "Filters", icon: Search, color: "text-cyan-400" },
      { label: "Verified", value: "Admin", icon: ShieldCheck, color: "text-fuchsia-500" },
      { label: "Recovery", value: "Claims", icon: Package, color: "text-yellow-400" },
    ],
    []
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0c] text-white font-sans">
      {/* Anime-style Background Pattern: Dot Grid and Radial Glows */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 opacity-[0.15]" 
          style={{ 
            backgroundImage: `radial-gradient(#4f46e5 1px, transparent 1px)`, 
            backgroundSize: '30px 30px' 
          }}
        />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-md border-2 border-cyan-500/50 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300 shadow-[4px_4px_0px_0px_rgba(6,182,212,0.3)]">
              <Sparkles className="w-4 h-4" />
              Status: System Online
            </div>

            <div className="relative">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black italic tracking-tighter uppercase leading-none">
                Campus<span className="text-fuchsia-500 drop-shadow-[0_0_15px_rgba(217,70,239,0.5)]">Trace</span>
              </h1>
              <div className="h-2 w-32 bg-cyan-500 mt-2 skew-x-[-20deg]" />
              <p className="mt-6 text-xl sm:text-2xl font-bold text-slate-300 border-l-4 border-fuchsia-500 pl-4">
                Digital Lost & Found Portal
              </p>
            </div>

            <p className="text-slate-400 text-lg leading-relaxed max-w-xl font-medium">
              Report lost items, get admin verification, and secure your belongings. 
              A high-tech recovery system for the modern campus.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                to="/items"
                className="group relative inline-flex items-center gap-2 px-8 py-4 bg-fuchsia-600 text-white font-black uppercase italic tracking-wider transition-transform hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-2 border-black"
              >
                Browse Items <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/report"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-black uppercase italic tracking-wider transition-transform hover:-translate-y-1 hover:-translate-x-1 active:translate-y-0 active:translate-x-0 shadow-[6px_6px_0px_0px_rgba(168,85,247,1)] border-2 border-black"
              >
                <PlusCircle className="w-5 h-5" /> Report
              </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-md pt-4">
              {stats.map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="group relative bg-slate-900/50 border-2 border-slate-800 p-4 rounded-lg hover:border-cyan-500/50 transition-colors">
                    <div className={`mb-2 ${s.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <p className="text-white font-black text-lg leading-none">{s.value}</p>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-tighter mt-1">{s.label}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 border-t-4 border-r-4 border-fuchsia-500 opacity-50 hidden sm:block" />
            <div className="absolute -bottom-6 -left-6 w-24 h-24 border-b-4 border-l-4 border-cyan-500 opacity-50 hidden sm:block" />
            
            <div className="relative bg-slate-900 border-2 border-slate-800 shadow-[12px_12px_0px_0px_rgba(15,23,42,1)] overflow-hidden rounded-sm">
              {/* Header Bar */}
              <div className="bg-slate-800 px-6 py-3 flex justify-between items-center border-b-2 border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recovery_Protocol.exe</span>
              </div>

              <div className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <h2 className="text-2xl font-black uppercase italic tracking-tight">Mission Briefing</h2>
                </div>

                <div className="space-y-6">
                  <Step n="01" title="Data Entry" text="Upload clear visuals and core item intel (location/time)." color="border-cyan-500" />
                  <Step n="02" title="Verification" text="Admin units validate all incoming transmissions." color="border-fuchsia-500" />
                  <Step n="03" title="Extraction" text="Secure hand-off at the designated campus hub." color="border-yellow-400" />
                </div>

                <div className="mt-10 p-4 bg-slate-950 border-l-4 border-cyan-500">
                  <p className="text-cyan-400 text-xs font-black uppercase mb-1">Tactical Tip</p>
                  <p className="text-slate-400 text-sm italic font-medium">
                    "Identify unique markings or serial numbers to expedite the verification process."
                  </p>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/report" className="flex-1 text-center py-3 bg-white text-black font-black uppercase text-sm border-2 border-black hover:bg-cyan-400 transition-colors">
                    Initialize Report
                  </Link>
                  <Link to="/items" className="flex-1 text-center py-3 bg-slate-800 text-white font-black uppercase text-sm border-2 border-slate-700 hover:border-fuchsia-500 transition-colors">
                    View Database
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Section */}
        <div className="mt-24 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Feature
            icon={<Search className="w-6 h-6" />}
            title="Neural Search"
            text="High-speed filtering by category, quadrant, and timestamp."
            borderColor="border-cyan-500"
          />
          <Feature
            icon={<ShieldCheck className="w-6 h-6" />}
            title="Secure Nodes"
            text="Encrypted claim process ensures items reach the true owner."
            borderColor="border-fuchsia-500"
          />
          <Feature
            icon={<Package className="w-6 h-6" />}
            title="Live Tracking"
            text="Real-time status updates from report to successful recovery."
            borderColor="border-yellow-400"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>
      </div>
      
      {/* Decorative Footer Stripe */}
      <div className="h-4 w-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-yellow-500 opacity-50" />
    </div>
  );
}

function Step({ n, title, text, color }) {
  return (
    <div className={`flex gap-4 group`}>
      <div className={`flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 ${color} bg-slate-950 text-white font-black italic text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        {n}
      </div>
      <div>
        <h3 className="font-black uppercase italic text-sm tracking-wide text-white group-hover:text-cyan-400 transition-colors">{title}</h3>
        <p className="text-slate-400 text-sm font-medium leading-snug mt-0.5">{text}</p>
      </div>
    </div>
  );
}

function Feature({ icon, title, text, borderColor, className = "" }) {
  return (
    <div className={`relative bg-slate-900/40 border-2 border-slate-800 p-8 rounded-sm hover:translate-y-[-4px] transition-transform ${className}`}>
      <div className={`absolute top-0 right-0 w-16 h-1 bg-gradient-to-l from-transparent to-transparent group-hover:from-cyan-500`} />
      <div className={`w-12 h-12 mb-6 flex items-center justify-center bg-slate-950 border-2 ${borderColor} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        <span className="text-white">{icon}</span>
      </div>
      <h3 className="text-xl font-black uppercase italic mb-3 tracking-tight">{title}</h3>
      <p className="text-slate-400 font-medium leading-relaxed">{text}</p>
      <div className={`mt-6 h-1 w-12 ${borderColor.replace('border', 'bg')} opacity-50`} />
    </div>
  );
}