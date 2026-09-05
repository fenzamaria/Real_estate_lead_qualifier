import React, { useState } from 'react';
import { X, MapPin, Bed, Bath, Maximize, CheckCircle2, Sparkles, Phone, Mail, UserCheck, Eye, Calendar, ShieldCheck } from 'lucide-react';

export default function PropertyDetailModal({ property, onClose, onQualifyProperty }) {
  const [activeImage, setActiveImage] = useState(property.imageUrl);
  const [copiedContact, setCopiedContact] = useState(false);

  if (!property) return null;

  const handleCopyContact = () => {
    navigator.clipboard.writeText(property.seller?.phone || '+1 (555) 000-1122');
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
              {property.type}
            </span>
            <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-cyan-400" /> {property.views} Total Views
            </span>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Gallery Section */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-3">
            <div className="h-96 w-full rounded-2xl overflow-hidden bg-slate-950 relative border border-slate-800">
              <img 
                src={activeImage} 
                alt={property.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800 text-xl font-black text-white">
                {property.priceDisplay}
              </div>
            </div>

            {/* Thumbnail selector */}
            {property.gallery && property.gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {property.gallery.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Thumb ${idx}`}
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-28 rounded-xl object-cover cursor-pointer border-2 transition-all ${
                      activeImage === img ? 'border-cyan-400 scale-95 shadow-md shadow-cyan-500/30' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Title & Key Specs */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
            <div>
              <h2 className="text-2xl font-black text-white">{property.title}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                <MapPin className="w-4 h-4 text-cyan-400" />
                {property.location}
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-900/80 p-3 rounded-2xl border border-slate-800">
              <div className="text-center px-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bedrooms</p>
                <p className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Bed className="w-4 h-4 text-cyan-400" /> {property.bedrooms}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center px-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Bathrooms</p>
                <p className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Bath className="w-4 h-4 text-cyan-400" /> {property.bathrooms}
                </p>
              </div>
              <div className="h-8 w-[1px] bg-slate-800" />
              <div className="text-center px-3">
                <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Area</p>
                <p className="text-base font-bold text-white flex items-center justify-center gap-1 mt-0.5">
                  <Maximize className="w-4 h-4 text-cyan-400" /> {property.areaSqFt} sqft
                </p>
              </div>
            </div>
          </div>

          {/* Description & Premium Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Property Overview</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Highlighted Features</h4>
                <div className="flex flex-wrap gap-2">
                  {property.features?.map((feat, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 text-cyan-300 text-xs font-medium border border-slate-800 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Seller Contact & AI Qualifier Trigger Card */}
            <div className="glass-card p-5 rounded-2xl space-y-4 border border-slate-700/60">
              <div className="flex items-center gap-3">
                <img 
                  src={property.seller?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'} 
                  alt="Seller"
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/40" 
                />
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1">
                    {property.seller?.name || 'Alexander Wright'}
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  </h4>
                  <p className="text-xs text-slate-400">{property.seller?.role || 'Listing Agent'}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{property.seller?.phone || '+1 (555) 234-8901'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono truncate">{property.seller?.email || 'seller@portal.ai'}</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    onQualifyProperty(property);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Qualify Lead for this Property
                </button>

                <button
                  onClick={handleCopyContact}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                >
                  {copiedContact ? '✓ Phone Number Copied!' : 'Copy Seller Phone'}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
