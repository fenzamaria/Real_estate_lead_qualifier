import React, { useState } from 'react';
import { X, Building2, IndianRupee, MapPin, Bed, Bath, Maximize, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { formatINR } from '../utils/aiQualifier';

export default function AddPropertyModal({ onClose, onAddProperty }) {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('Kochi');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('Penthouse');
  const [bedrooms, setBedrooms] = useState('3');
  const [bathrooms, setBathrooms] = useState('3');
  const [areaSqFt, setAreaSqFt] = useState('2800');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [features, setFeatures] = useState('Backwater View, Solar Grid, Teak Wood Interior');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price || !location) return;

    const numPrice = Number(price);
    const formattedPrice = formatINR(numPrice);
    const featArray = features.split(',').map(f => f.trim()).filter(Boolean);

    onAddProperty({
      title,
      location,
      city: city || 'Kochi',
      price: numPrice,
      priceDisplay: formattedPrice,
      type,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      description: description || 'Modern luxury architectural residence in Kerala equipped with smart home features and panoramic views.',
      features: featArray,
      timelineCategory: 'Immediate (< 30 days)'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 my-8">
        
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Upload New Kerala Property Listing</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Property Title</label>
            <input 
              type="text" 
              required
              value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="e.g. Edappally Waterfront Villa" 
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Location Address</label>
              <input 
                type="text" 
                required
                value={location} 
                onChange={e => setLocation(e.target.value)} 
                placeholder="e.g. Marine Drive, Kochi, Kerala" 
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">City</label>
              <select 
                value={city} 
                onChange={e => setCity(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none bg-slate-900"
              >
                <option value="Kochi">Kochi</option>
                <option value="Kumarakom">Kumarakom</option>
                <option value="Munnar">Munnar</option>
                <option value="Trivandrum">Trivandrum</option>
                <option value="Wayanad">Wayanad</option>
                <option value="Kozhikode">Kozhikode</option>
                <option value="Thrissur">Thrissur</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Listing Price (₹ in Rupees)</label>
              <input 
                type="number" 
                required
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="e.g. 18500000 (1.85 Cr)" 
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
              />
              {price > 0 && (
                <p className="text-[11px] text-cyan-400 font-mono font-semibold">
                  Preview: {formatINR(Number(price))}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Property Type</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value)}
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none bg-slate-900"
              >
                <option value="Penthouse">Penthouse</option>
                <option value="Waterfront Estate">Waterfront Estate</option>
                <option value="Villa">Villa</option>
                <option value="Chalet">Chalet / Plantation House</option>
                <option value="Single Family">Single Family</option>
                <option value="Condo">Condo</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Bedrooms</label>
              <input 
                type="number" 
                value={bedrooms} 
                onChange={e => setBedrooms(e.target.value)} 
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Bathrooms</label>
              <input 
                type="number" 
                step="0.5"
                value={bathrooms} 
                onChange={e => setBathrooms(e.target.value)} 
                className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Image URL</label>
            <input 
              type="text" 
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
              placeholder="https://images.unsplash.com/..." 
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea 
              rows="3"
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Describe key features..." 
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Key Features (comma separated)</label>
            <input 
              type="text" 
              value={features} 
              onChange={e => setFeatures(e.target.value)} 
              placeholder="Backwater Dock, Nalukettu Courtyard, Solar Grid" 
              className="w-full glass-input px-3.5 py-2 rounded-xl text-sm text-white focus:outline-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20"
            >
              Publish Property Listing
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
