import React from 'react';
import { Building2, Sparkles, User, Radar, TrendingUp, Search, PlusCircle } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, userProfile, searchHistoryCount, onOpenAddProperty }) {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('dashboard')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                NEXUS<span className="gradient-text">.AI</span>
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> QUALIFIER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Next-Gen Real Estate Portal</p>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Dashboard & Feed
          </button>

          <button
            onClick={() => setActiveTab('radar')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all relative ${
              activeTab === 'radar'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Radar className="w-3.5 h-3.5 text-purple-400" />
            On-Demand Radar
            {searchHistoryCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-purple-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {searchHistoryCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            My Profile & Listings
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddProperty}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 border border-slate-700 text-xs font-semibold transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">List Property</span>
          </button>

          {/* User Profile Pill */}
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700 transition-colors"
          >
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-cyan-500/40" 
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">{userProfile.name}</p>
              <p className="text-[10px] text-slate-400 font-mono">Verified Seller</p>
            </div>
          </div>
        </div>

      </div>

      {/* Mobile Tab Navigation */}
      <div className="flex md:hidden items-center justify-around mt-3 pt-2 border-t border-slate-800/60">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" /> Feed
        </button>
        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'radar' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Radar className="w-3.5 h-3.5" /> AI Radar
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium ${
            activeTab === 'profile' ? 'text-cyan-400 font-bold' : 'text-slate-400'
          }`}
        >
          <User className="w-3.5 h-3.5" /> Profile
        </button>
      </div>
    </header>
  );
}
