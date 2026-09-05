import React from 'react';
import { Eye, Search, MapPin, Bed, Bath, Maximize, Sparkles, PhoneCall, Star } from 'lucide-react';

export default function PropertyCard({ property, onViewDetails, onQualifyProperty }) {
  const isTrending = property.isMostSearched || property.searchesCount > 750;

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      
      {/* Image & Overlay Badges */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onViewDetails(property)}>
        <img 
          src={property.imageUrl} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Trending / Most Searched Tag */}
          {isTrending ? (
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/90 to-orange-600/90 text-white font-bold text-[10px] tracking-wide uppercase flex items-center gap-1 shadow-lg shadow-amber-500/20 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-amber-200" /> Most Searched #{property.searchesCount || 890}
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-slate-900/80 text-slate-300 text-[10px] font-semibold tracking-wide border border-slate-700 backdrop-blur-md">
              {property.type}
            </span>
          )}

          {/* Views Counter Badge */}
          <span className="px-2.5 py-1 rounded-full bg-slate-950/80 text-cyan-300 text-[10px] font-mono font-semibold flex items-center gap-1 border border-cyan-500/30 backdrop-blur-md">
            <Eye className="w-3 h-3 text-cyan-400" /> {property.views || 100} views
          </span>
        </div>

        {/* Bottom Image Info */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <span className="text-2xl font-black text-white tracking-tight drop-shadow-md">
              {property.priceDisplay}
            </span>
          </div>
          {property.rating && (
            <div className="flex items-center gap-1 bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-800 text-[11px] font-bold text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" /> {property.rating}
            </div>
          )}
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 
            onClick={() => onViewDetails(property)}
            className="font-bold text-base text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1 line-clamp-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-500 flex-shrink-0" />
            {property.location}
          </p>
        </div>

        {/* Property Features Pill Grid */}
        <div className="grid grid-cols-3 gap-2 py-2 border-y border-slate-800/80 text-slate-300">
          <div className="flex items-center gap-1.5 text-xs">
            <Bed className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Bath className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Maximize className="w-3.5 h-3.5 text-slate-400" />
            <span>{property.areaSqFt} sqft</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => onViewDetails(property)}
            className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold border border-slate-700 transition-all text-center"
          >
            View Details
          </button>

          <button
            onClick={() => onQualifyProperty(property)}
            className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
            AI Lead Qualify
          </button>
        </div>

      </div>

    </div>
  );
}
