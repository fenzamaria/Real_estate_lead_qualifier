import React, { useState } from 'react';
import { User, Eye, PlusCircle, Building2, Phone, Mail, Sparkles, TrendingUp, ShieldCheck, CheckCircle2, Calendar } from 'lucide-react';
import PropertyCard from './PropertyCard';

export default function ProfileStudio({ 
  userProfile, 
  userProperties, 
  qualifiedLeads, 
  onUpdateProfile, 
  onOpenAddProperty,
  onViewDetails,
  onQualifyProperty 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);

  const totalViews = userProperties.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalSearches = userProperties.reduce((acc, curr) => acc + (curr.searchesCount || 0), 0);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateProfile({ ...userProfile, name, phone, email });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Top Banner & Profile Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          {/* User Details */}
          <div className="flex items-center gap-5">
            <img 
              src={userProfile.avatar} 
              alt={userProfile.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-cyan-500/30 shadow-xl" 
            />

            {!isEditing ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-white">{userProfile.name}</h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30">
                    Verified Seller
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium">{userProfile.role}</p>
                
                <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> {userProfile.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> {userProfile.email}
                  </span>
                </div>

                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold underline underline-offset-2 pt-1"
                >
                  Edit Contact Info
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-2 bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                <input 
                  type="text" 
                  value={name} 
                  onChange={e => setName(e.target.value)}
                  className="glass-input px-3 py-1 rounded text-xs text-white"
                />
                <input 
                  type="text" 
                  value={phone} 
                  onChange={e => setPhone(e.target.value)}
                  className="glass-input px-3 py-1 rounded text-xs text-white"
                />
                <input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="glass-input px-3 py-1 rounded text-xs text-white"
                />
                <div className="flex items-center gap-2 pt-1">
                  <button type="submit" className="px-3 py-1 bg-cyan-500 text-slate-950 font-bold text-xs rounded">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded">Cancel</button>
                </div>
              </form>
            )}
          </div>

          {/* Quick Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAddProperty}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Upload New Listing
            </button>
          </div>

        </div>

        {/* Analytics Counter Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          
          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-medium">Total Property Views</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{totalSearches.toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-medium">Search Impression Count</p>
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-white">{qualifiedLeads.length}</p>
              <p className="text-xs text-slate-400 font-medium">AI Qualified Leads</p>
            </div>
          </div>

        </div>

      </div>

      {/* QUALIFIED LEADS PIPELINE SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              Qualified Leads Pipeline & Decisions
            </h2>
            <p className="text-xs text-slate-400">AI evaluated next-action decisions for prospective buyers</p>
          </div>
        </div>

        {qualifiedLeads.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-2xl border border-slate-800">
            <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">No leads generated yet</p>
            <p className="text-xs text-slate-500 mt-1">Run the AI Lead Qualifier from any property card to process buyer leads.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {qualifiedLeads.map((lead) => (
              <div key={lead.id} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target Property</span>
                    <h4 className="text-base font-bold text-white">{lead.targetPropertyTitle}</h4>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      lead.leadScore >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {lead.category} ({lead.leadScore}/100)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block mb-1">Recommended Next Action:</span>
                  <p className="text-xs font-bold text-slate-100">⚡ {lead.nextActionDecision}</p>
                </div>

                <div className="text-xs text-slate-400 space-y-1 pt-1">
                  <p className="font-semibold text-slate-300">Key AI Reasoning:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                    {lead.reasoning?.slice(0, 2).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MY UPLOADED PROPERTIES GRID */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-cyan-400" />
              Active Seller Listings ({userProperties.length})
            </h2>
            <p className="text-xs text-slate-400">Manage your active properties and view performance stats</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onViewDetails={onViewDetails}
              onQualifyProperty={onQualifyProperty}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
