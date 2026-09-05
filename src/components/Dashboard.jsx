import React, { useState } from 'react';
import { Search, Flame, Sparkles, Filter, SlidersHorizontal, MapPin, DollarSign, Building, Eye, ArrowUpRight, Zap } from 'lucide-react';
import PropertyCard from './PropertyCard';

// ─── Natural Language Query Parser ───────────────────────────────────────────
// Understands queries like:
//   "villa under 2cr", "penthouse kochi below 3 crore",
//   "1.5 lakh", "below 50 lakh", "munnar chalet", "3 bhk kochi"
const KERALA_CITIES = ['kochi', 'kumarakom', 'munnar', 'trivandrum', 'wayanad', 'kozhikode', 'calicut', 'thrissur', 'vythiri', 'pallivasal'];
const CITY_NORMALIZE = { calicut: 'Kozhikode', vythiri: 'Wayanad', pallivasal: 'Munnar' };
const PROPERTY_TYPES = ['penthouse', 'villa', 'chalet', 'condo', 'apartment', 'bungalow', 'estate', 'single family', 'waterfront'];
const TYPE_NORMALIZE = { bungalow: 'Chalet', apartment: 'Condo', estate: 'Waterfront Estate', 'single family': 'Single Family', waterfront: 'Waterfront Estate' };

function parseNaturalQuery(raw) {
  const q = raw.toLowerCase().trim();
  const result = { cleanText: q, maxPrice: null, city: null, type: null, bedrooms: null };

  // ── Price extraction ──────────────────────────────────────────────────────
  // Patterns: "under 2cr", "below 2.5 crore", "2cr", "< 50 lakh", "upto 95 lakh"
  const pricePatterns = [
    /(?:under|below|less than|upto|up to|within|<)\s*([\d.]+)\s*cr(?:ore)?s?/,
    /(?:under|below|less than|upto|up to|within|<)\s*([\d.]+)\s*lakh/,
    /([\d.]+)\s*cr(?:ore)?s?\s*(?:budget|max|limit)?/,
    /([\d.]+)\s*lakh\s*(?:budget|max|limit)?/,
  ];
  const isCrore = (pat) => pat.source.includes('cr');

  for (let i = 0; i < pricePatterns.length; i++) {
    const m = q.match(pricePatterns[i]);
    if (m) {
      const val = parseFloat(m[1]);
      result.maxPrice = isCrore(pricePatterns[i]) ? Math.round(val * 10000000) : Math.round(val * 100000);
      result.cleanText = result.cleanText.replace(m[0], ' ').trim();
      break;
    }
  }

  // ── City extraction ───────────────────────────────────────────────────────
  for (const city of KERALA_CITIES) {
    if (q.includes(city)) {
      result.city = CITY_NORMALIZE[city] || city.charAt(0).toUpperCase() + city.slice(1);
      result.cleanText = result.cleanText.replace(city, ' ').trim();
      break;
    }
  }

  // ── Property type extraction ──────────────────────────────────────────────
  for (const type of PROPERTY_TYPES) {
    if (q.includes(type)) {
      result.type = TYPE_NORMALIZE[type] || type.charAt(0).toUpperCase() + type.slice(1);
      result.cleanText = result.cleanText.replace(type, ' ').trim();
      break;
    }
  }

  // ── BHK / Bedrooms extraction ─────────────────────────────────────────────
  const bhkMatch = q.match(/(\d+)\s*(?:bhk|bed(?:room)?s?|br)/);
  if (bhkMatch) {
    result.bedrooms = parseInt(bhkMatch[1]);
    result.cleanText = result.cleanText.replace(bhkMatch[0], ' ').trim();
  }

  // Strip noise words from leftover cleanText
  result.cleanText = result.cleanText
    .replace(/\b(in|at|near|around|for|a|an|the|and|with|under|below|above|budget|property|properties|show|find|list|me)\b/g, ' ')
    .replace(/\s+/g, ' ').trim();

  return result;
}

export default function Dashboard({ 
  properties, 
  onViewDetails, 
  onQualifyProperty, 
  onSearchPerform,
  onOpenGlobalQualifier 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('searches');

  // Most Searched Properties (Sorted by searchesCount descending)
  const mostSearchedProperties = [...properties]
    .sort((a, b) => (b.searchesCount || 0) - (a.searchesCount || 0))
    .slice(0, 3);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchPerform) {
      onSearchPerform(searchTerm, selectedCity, maxPrice, selectedType);
    }
  };

  // Parse natural language from the search term
  const parsed = searchTerm ? parseNaturalQuery(searchTerm) : { cleanText: '', maxPrice: null, city: null, type: null, bedrooms: null };

  // Effective filter values: NLP-extracted values take priority, dropdowns are fallback
  const effectiveCity = parsed.city || (selectedCity !== 'All' ? selectedCity : null);
  const effectiveType = parsed.type || (selectedType !== 'All' ? selectedType : null);
  const effectiveMaxPrice = parsed.maxPrice || (maxPrice ? Number(maxPrice) : null);

  const filteredProperties = properties.filter((p) => {
    // Leftover clean text (after stripping price/city/type tokens) still does text match
    const leftover = parsed.cleanText;
    const matchesQuery = !leftover ||
      p.title.toLowerCase().includes(leftover) ||
      p.location.toLowerCase().includes(leftover) ||
      p.description.toLowerCase().includes(leftover) ||
      p.type.toLowerCase().includes(leftover);

    const matchesCity = !effectiveCity || p.city.toLowerCase() === effectiveCity.toLowerCase();
    const matchesType = !effectiveType || p.type.toLowerCase().includes(effectiveType.toLowerCase());
    const matchesPrice = !effectiveMaxPrice || p.price <= effectiveMaxPrice;
    const matchesBedrooms = !parsed.bedrooms || p.bedrooms >= parsed.bedrooms;

    return matchesQuery && matchesCity && matchesType && matchesPrice && matchesBedrooms;
  }).sort((a, b) => {
    if (sortBy === 'searches') return (b.searchesCount || 0) - (a.searchesCount || 0);
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return 0;
  });

  // Build a summary of what the AI understood from the query
  const parsedHints = [];
  if (parsed.type) parsedHints.push(`Type: ${parsed.type}`);
  if (parsed.city) parsedHints.push(`City: ${parsed.city}`);
  if (parsed.maxPrice) parsedHints.push(`Budget: ≤ ₹${parsed.maxPrice >= 10000000 ? (parsed.maxPrice/10000000).toFixed(2)+' Cr' : (parsed.maxPrice/100000).toFixed(0)+' Lakh'}`);
  if (parsed.bedrooms) parsedHints.push(`Min ${parsed.bedrooms} BHK`);

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-16">
      
      {/* HERO / SPOTLIGHT: MOST SEARCHED KERALA PROPERTIES */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 flex items-center gap-1.5 shadow-lg shadow-amber-500/10">
                <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> MOST SEARCHED KERALA PROPERTIES FIRST
              </span>
              <span className="text-xs text-slate-400 font-mono">Live Kerala Demand</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Top Trending Real Estate Spotlight
            </h1>
          </div>

          <button
            onClick={onOpenGlobalQualifier}
            className="py-3 px-5 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 self-start md:self-auto"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            Launch General AI Lead Qualifier
          </button>
        </div>

        {/* Most Searched Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {mostSearchedProperties.map((prop, idx) => (
            <div key={prop.id} className="glass-card rounded-2xl p-4 border border-amber-500/30 relative flex flex-col justify-between space-y-4 bg-gradient-to-b from-slate-900/90 to-slate-950/90">
              
              {/* Badge Overlay */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" /> #{idx + 1} Trending
                </span>
                <span className="text-xs text-cyan-300 font-mono flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" /> {prop.views} views
                </span>
              </div>

              <div className="h-44 rounded-xl overflow-hidden relative cursor-pointer" onClick={() => onViewDetails(prop)}>
                <img src={prop.imageUrl} alt={prop.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                <div className="absolute bottom-2 right-2 px-3 py-1 rounded-lg bg-slate-950/90 text-white font-bold text-sm border border-slate-800">
                  {prop.priceDisplay}
                </div>
              </div>

              <div>
                <h3 onClick={() => onViewDetails(prop)} className="font-bold text-base text-white hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer">
                  {prop.title}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {prop.location}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                <button
                  onClick={() => onViewDetails(prop)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                >
                  View Listing
                </button>
                <button
                  onClick={() => onQualifyProperty(prop)}
                  className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Qualify Lead
                </button>
              </div>

            </div>
          ))}
        </div>
      </section>

      {/* SEARCH & FILTER BAR */}
      <section className="glass-panel p-5 sm:p-6 rounded-3xl border border-slate-800 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col lg:flex-row items-center gap-3">
          
          {/* Main Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Marine Drive penthouse, Kumarakom backwater villa, Munnar, Kochi..."
              className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>

          {/* Kerala City Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white bg-slate-900 focus:outline-none"
            >
              <option value="All">All Kerala Cities</option>
              <option value="Kochi">Kochi</option>
              <option value="Kumarakom">Kumarakom</option>
              <option value="Munnar">Munnar</option>
              <option value="Trivandrum">Trivandrum</option>
              <option value="Wayanad">Wayanad</option>
              <option value="Kozhikode">Kozhikode (Calicut)</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="w-full lg:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full glass-input px-3 py-2.5 rounded-xl text-xs text-white bg-slate-900 focus:outline-none"
            >
              <option value="All">All Property Types</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Waterfront Estate">Waterfront Estate</option>
              <option value="Villa">Villa</option>
              <option value="Chalet">Chalet / Plantation House</option>
              <option value="Single Family">Single Family</option>
              <option value="Condo">Condo</option>
            </select>
          </div>

          {/* Search Trigger Button */}
          <button
            type="submit"
            className="w-full lg:w-auto px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Filter Properties
          </button>
        </form>

        {/* AI NLP Parse Hints — shown when AI extracted something from query */}
        {parsedHints.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-800">
            <span className="flex items-center gap-1 text-[11px] text-purple-300 font-semibold">
              <Zap className="w-3.5 h-3.5 text-purple-400" /> AI understood:
            </span>
            {parsedHints.map((hint, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-200 text-[11px] font-mono font-semibold">
                {hint}
              </span>
            ))}
            <button
              onClick={() => setSearchTerm('')}
              className="ml-auto text-[11px] text-slate-500 hover:text-rose-400 transition-colors underline underline-offset-2"
            >
              Clear
            </button>
          </div>
        )}

        {/* Sort controls */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
          <span>Showing <strong className="text-white">{filteredProperties.length}</strong> active Kerala listings</span>
          
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2 py-1 text-xs focus:outline-none"
            >
              <option value="searches">🔥 Most Searched First</option>
              <option value="views">👁️ Most Viewed</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </section>

      {/* ALL PROPERTIES GRID */}
      <section className="space-y-4">
        <h2 className="text-xl font-black text-white">Kerala Property Feed</h2>
        
        {filteredProperties.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-3xl border border-slate-800">
            <p className="text-slate-300 font-bold">No properties match your filter criteria.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCity('All'); setSelectedType('All'); setMaxPrice(''); }}
              className="mt-3 text-xs text-cyan-400 underline font-semibold"
            >
              Reset Search Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onViewDetails={onViewDetails}
                onQualifyProperty={onQualifyProperty}
              />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
