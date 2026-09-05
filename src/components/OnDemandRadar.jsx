import React, { useState } from 'react';
import { Radar, Sparkles, Search, History, CheckCircle2, ChevronRight, Zap, RefreshCw } from 'lucide-react';
import PropertyCard from './PropertyCard';

export default function OnDemandRadar({ properties, searchHistory, onViewDetails, onQualifyProperty, onSearchTrigger }) {
  const [radarQuery, setRadarQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');

  // Filter properties matching query or inferred search history
  const filteredProperties = properties.filter(p => {
    const matchesType = selectedType === 'All' || p.type.toLowerCase() === selectedType.toLowerCase();
    const matchesQuery = !radarQuery || 
      p.title.toLowerCase().includes(radarQuery.toLowerCase()) || 
      p.location.toLowerCase().includes(radarQuery.toLowerCase()) ||
      p.features?.some(f => f.toLowerCase().includes(radarQuery.toLowerCase()));
    return matchesType && matchesQuery;
  });

  const handleQuickSearch = (queryText) => {
    setRadarQuery(queryText);
    onSearchTrigger(queryText);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Radar Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl relative overflow-hidden border border-purple-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/30 flex items-center gap-1.5">
                <Radar className="w-3.5 h-3.5 text-purple-400" /> ON-DEMAND AI RADAR
              </span>
              <span className="text-xs text-slate-400 font-mono">Real-Time Intent Vector</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">
              Personalized Property Match Engine
            </h1>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Our AI continuously cross-references your real-time search queries and past browsing history to discover high-suitability on-demand properties before they hit standard portals.
            </p>
          </div>

          <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Past Search Vector Signals</span>
            <div className="flex flex-wrap gap-1.5">
              {searchHistory.slice(0, 3).map((item) => (
                <span 
                  key={item.id}
                  onClick={() => handleQuickSearch(item.query)}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 text-slate-300 text-[11px] font-mono hover:text-purple-300 border border-slate-800 cursor-pointer flex items-center gap-1 transition-colors"
                >
                  <History className="w-3 h-3 text-purple-400" /> {item.query}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Radar Input Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input 
              type="text"
              value={radarQuery}
              onChange={(e) => setRadarQuery(e.target.value)}
              placeholder="Describe your on-demand property requirements (e.g. Luxury penthouse skyline view under 3M)..."
              className="w-full glass-input pl-12 pr-28 py-3 rounded-2xl text-sm text-white focus:outline-none"
            />
            <button 
              onClick={() => onSearchTrigger(radarQuery || 'On-demand match')}
              className="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Run Radar
            </button>
          </div>
        </div>

      </div>

      {/* Property Matches Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" />
            Matched On-Demand Listings ({filteredProperties.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="relative group">
              
              {/* AI Reasoning Match Badge Overlay */}
              <div className="mb-2 p-2.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2 backdrop-blur-md">
                <Sparkles className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-purple-300">Why AI Recommended: </span>
                  <span className="text-[11px] text-slate-300">
                    Matches your search history criteria (${property.priceDisplay}, {property.type} in {property.city}).
                  </span>
                </div>
              </div>

              <PropertyCard
                property={property}
                onViewDetails={onViewDetails}
                onQualifyProperty={onQualifyProperty}
              />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
