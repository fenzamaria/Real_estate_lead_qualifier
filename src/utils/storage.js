import { INITIAL_PROPERTIES, INITIAL_SEARCH_HISTORY } from '../data/mockData';

const KEYS = {
  PROPERTIES: 'ai_kerala_portal_properties_v4',
  SEARCH_HISTORY: 'ai_kerala_portal_search_history_v4',
  QUALIFIED_LEADS: 'ai_kerala_portal_qualified_leads_v4',
  USER_PROFILE: 'ai_kerala_portal_user_profile_v4',
};

// Purge any legacy keys from previous runs
try {
  localStorage.removeItem('ai_portal_properties');
  localStorage.removeItem('ai_portal_search_history');
  localStorage.removeItem('ai_portal_qualified_leads');
  localStorage.removeItem('ai_portal_user_profile');
} catch (e) {
  // ignore
}

export const getStoredProperties = () => {
  const data = localStorage.getItem(KEYS.PROPERTIES);
  if (!data) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  const parsed = JSON.parse(data);
  // Double check if parsed contains any non-kerala items
  if (parsed.some(p => p.location && (p.location.includes('New York') || p.location.includes('California') || p.location.includes('Malibu')))) {
    localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(INITIAL_PROPERTIES));
    return INITIAL_PROPERTIES;
  }
  return parsed;
};

export const saveProperties = (properties) => {
  localStorage.setItem(KEYS.PROPERTIES, JSON.stringify(properties));
};

export const incrementPropertyView = (propertyId) => {
  const properties = getStoredProperties();
  const updated = properties.map(p => {
    if (p.id === propertyId) {
      return { ...p, views: (p.views || 0) + 1 };
    }
    return p;
  });
  saveProperties(updated);
  return updated;
};

export const incrementPropertySearchCount = (propertyIds) => {
  const properties = getStoredProperties();
  const updated = properties.map(p => {
    if (propertyIds.includes(p.id)) {
      return { ...p, searchesCount: (p.searchesCount || 0) + 1 };
    }
    return p;
  });
  saveProperties(updated);
  return updated;
};

export const addCustomProperty = (newProp) => {
  const properties = getStoredProperties();
  const fullProp = {
    ...newProp,
    id: `prop-custom-${Date.now()}`,
    views: 1,
    searchesCount: 0,
    isMostSearched: false,
    rating: 5.0,
    gallery: [newProp.imageUrl],
    seller: getStoredUserProfile()
  };
  const updated = [fullProp, ...properties];
  saveProperties(updated);
  return updated;
};

export const getSearchHistory = () => {
  const data = localStorage.getItem(KEYS.SEARCH_HISTORY);
  if (!data) {
    localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(INITIAL_SEARCH_HISTORY));
    return INITIAL_SEARCH_HISTORY;
  }
  return JSON.parse(data);
};

export const addSearchHistoryItem = (searchItem) => {
  const history = getSearchHistory();
  const newItem = {
    id: `sh-${Date.now()}`,
    timestamp: Date.now(),
    ...searchItem
  };
  const updated = [newItem, ...history.slice(0, 14)];
  localStorage.setItem(KEYS.SEARCH_HISTORY, JSON.stringify(updated));
  return updated;
};

export const getQualifiedLeads = () => {
  const data = localStorage.getItem(KEYS.QUALIFIED_LEADS);
  return data ? JSON.parse(data) : [];
};

export const saveQualifiedLead = (lead) => {
  const leads = getQualifiedLeads();
  const newLead = {
    id: `lead-${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...lead
  };
  const updated = [newLead, ...leads];
  localStorage.setItem(KEYS.QUALIFIED_LEADS, JSON.stringify(updated));
  return updated;
};

export const getStoredUserProfile = () => {
  const data = localStorage.getItem(KEYS.USER_PROFILE);
  if (!data) {
    const defaultUser = {
      id: 'seller-user-me',
      name: 'Mathew Varghese',
      role: 'Kerala Property Owner & Investor',
      phone: '+91 98471 22334',
      email: 'mathew.varghese@keralaportal.in',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      joinedDate: 'August 2026'
    };
    localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(defaultUser));
    return defaultUser;
  }
  return JSON.parse(data);
};

export const saveUserProfile = (profile) => {
  localStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
};
