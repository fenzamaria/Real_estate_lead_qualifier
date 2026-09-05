import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import OnDemandRadar from './components/OnDemandRadar';
import ProfileStudio from './components/ProfileStudio';
import PropertyDetailModal from './components/PropertyDetailModal';
import LeadQualifierModal from './components/LeadQualifierModal';
import AddPropertyModal from './components/AddPropertyModal';

import { 
  getStoredProperties, 
  saveProperties, 
  incrementPropertyView, 
  incrementPropertySearchCount,
  addCustomProperty, 
  getSearchHistory, 
  addSearchHistoryItem, 
  getQualifiedLeads, 
  getStoredUserProfile,
  saveUserProfile 
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [properties, setProperties] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [qualifiedLeads, setQualifiedLeads] = useState([]);

  // Modals
  const [selectedPropertyDetail, setSelectedPropertyDetail] = useState(null);
  const [selectedPropertyToQualify, setSelectedPropertyToQualify] = useState(null);
  const [isQualifierModalOpen, setIsQualifierModalOpen] = useState(false);
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);

  // Initialize data on load
  useEffect(() => {
    setProperties(getStoredProperties());
    setSearchHistory(getSearchHistory());
    setUserProfile(getStoredUserProfile());
    setQualifiedLeads(getQualifiedLeads());
  }, []);

  // Handle viewing property details & incrementing views
  const handleViewDetails = (property) => {
    const updatedProps = incrementPropertyView(property.id);
    setProperties(updatedProps);
    // Find updated single property object
    const updatedProp = updatedProps.find(p => p.id === property.id) || property;
    setSelectedPropertyDetail(updatedProp);
  };

  // Handle triggering AI lead qualifier for specific property or globally
  const handleQualifyProperty = (property = null) => {
    setSelectedPropertyToQualify(property);
    setIsQualifierModalOpen(true);
  };

  // Handle user search logging & incrementing search counts
  const handleSearchPerform = (query, location, maxPrice, type) => {
    if (!query && !location && !maxPrice) return;
    
    // Save search history
    const updatedHistory = addSearchHistoryItem({
      query: query || `${type} in ${location}`,
      location,
      maxPrice: maxPrice ? Number(maxPrice) : 30000000,
      type
    });
    setSearchHistory(updatedHistory);

    // Find matching properties and increment search count
    const matchingPropIds = properties
      .filter(p => {
        const matchesQuery = query && (p.title.toLowerCase().includes(query.toLowerCase()) || p.location.toLowerCase().includes(query.toLowerCase()));
        const matchesLoc = location && location !== 'All' && p.city.toLowerCase().includes(location.toLowerCase());
        return matchesQuery || matchesLoc;
      })
      .map(p => p.id);

    if (matchingPropIds.length > 0) {
      const updatedProps = incrementPropertySearchCount(matchingPropIds);
      setProperties(updatedProps);
    }
  };

  // Handle adding new property by seller
  const handleAddProperty = (newPropertyData) => {
    const updatedProps = addCustomProperty(newPropertyData);
    setProperties(updatedProps);
  };

  // Handle updating user profile
  const handleUpdateProfile = (newProfile) => {
    saveUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  // Filter user's uploaded properties
  const userProperties = properties.filter(p => p.seller?.id === userProfile.id || p.seller?.email === userProfile.email);
  // Fallback: if user hasn't uploaded any yet, display first 3 as their managed portfolio demo
  const displaySellerProperties = userProperties.length > 0 ? userProperties : properties.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        searchHistoryCount={searchHistory.length}
        onOpenAddProperty={() => setIsAddPropertyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 lg:px-8 py-6">
        
        {activeTab === 'dashboard' && (
          <Dashboard
            properties={properties}
            onViewDetails={handleViewDetails}
            onQualifyProperty={handleQualifyProperty}
            onSearchPerform={handleSearchPerform}
            onOpenGlobalQualifier={() => handleQualifyProperty(null)}
          />
        )}

        {activeTab === 'radar' && (
          <OnDemandRadar
            properties={properties}
            searchHistory={searchHistory}
            onViewDetails={handleViewDetails}
            onQualifyProperty={handleQualifyProperty}
            onSearchTrigger={(q) => handleSearchPerform(q, '', '', 'All')}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileStudio
            userProfile={userProfile}
            userProperties={displaySellerProperties}
            qualifiedLeads={getQualifiedLeads()}
            onUpdateProfile={handleUpdateProfile}
            onOpenAddProperty={() => setIsAddPropertyOpen(true)}
            onViewDetails={handleViewDetails}
            onQualifyProperty={handleQualifyProperty}
          />
        )}

      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800 py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NEXUS.AI — Next-Gen AI Real Estate Portal & Lead Qualifier Agent</p>
          <div className="flex items-center gap-4 text-slate-400 font-mono text-[11px]">
            <span>AI Decision Engine: Active</span>
            <span>•</span>
            <span>Past Search Vectors: Enabled</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* Property Detail Modal */}
      {selectedPropertyDetail && (
        <PropertyDetailModal
          property={selectedPropertyDetail}
          onClose={() => setSelectedPropertyDetail(null)}
          onQualifyProperty={handleQualifyProperty}
        />
      )}

      {/* AI Lead Qualifier Modal */}
      {isQualifierModalOpen && (
        <LeadQualifierModal
          targetProperty={selectedPropertyToQualify}
          onClose={() => {
            setIsQualifierModalOpen(false);
            setQualifiedLeads(getQualifiedLeads());
          }}
        />
      )}

      {/* Add Property Modal */}
      {isAddPropertyOpen && (
        <AddPropertyModal
          onClose={() => setIsAddPropertyOpen(false)}
          onAddProperty={handleAddProperty}
        />
      )}

    </div>
  );
}
