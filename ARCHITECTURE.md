# Architecture Document — NEXUS.AI
## System Design, Data Flow & Component Architecture

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER (Client-Only)                │
│                                                         │
│  ┌──────────┐    ┌─────────────────────────────────┐   │
│  │ Vite Dev │───▶│        React SPA (App.jsx)       │   │
│  │  Server  │    │   Root State Orchestration Layer  │   │
│  └──────────┘    └───────────────┬─────────────────┘   │
│                                  │                      │
│         ┌────────────────────────┼──────────────────┐  │
│         ▼                        ▼                   ▼  │
│   ┌──────────┐           ┌──────────────┐   ┌──────────┐│
│   │Dashboard │           │LeadQualifier │   │ Profile  ││
│   │  Tab     │           │  Modal       │   │  Studio  ││
│   └────┬─────┘           └──────┬───────┘   └────┬─────┘│
│        │                        │                 │      │
│        ▼                        ▼                 ▼      │
│   ┌──────────┐           ┌──────────────┐   ┌──────────┐│
│   │Property  │           │ aiQualifier  │   │AddProp   ││
│   │   Card   │           │    .js       │   │ Modal    ││
│   └──────────┘           └──────┬───────┘   └──────────┘│
│                                 │                        │
│         ┌───────────────────────┘                        │
│         ▼                                               │
│   ┌──────────────────────────────────────────────┐     │
│   │              storage.js (LocalStorage Layer)  │     │
│   │  properties | searchHistory | leads | profile │     │
│   └──────────────────────────────────────────────┘     │
│                                                         │
└─────────────────────────────────────────────────────────┘

NO BACKEND. NO DATABASE. NO EXTERNAL API CALLS.
All state lives in the browser.
```

---

## 2. Application Layers

### Layer 1: Entry Point
```
index.html → main.jsx → App.jsx
```
- `index.html`: Standard HTML shell, mounts `<div id="root">`
- `main.jsx`: React DOM `createRoot().render(<App />)`
- `App.jsx`: Root state store + router + modal manager

### Layer 2: State Management (App.jsx)
App.jsx acts as the **single source of truth** — a centralized state container. All data flows **down** via props, all mutations flow **up** via callback functions.

```
App.jsx State:
├── properties[]          ← All property listings
├── searchHistory[]       ← User search logs
├── userProfile{}         ← Logged-in seller
├── qualifiedLeads[]      ← Saved lead results
│
└── UI State:
    ├── activeTab          ← 'dashboard' | 'radar' | 'profile'
    ├── selectedPropertyDetail   ← Open property detail modal
    ├── selectedPropertyToQualify ← Property being qualified
    ├── isQualifierModalOpen
    └── isAddPropertyOpen
```

**Data Flow Pattern**:
```
LocalStorage (source of truth on load)
    ↓ getStoredProperties() / getSearchHistory() / etc.
App.jsx useState() — in-memory working copy
    ↓ props
Child Components (read-only)
    ↑ callback props (onViewDetails, onSearchPerform, etc.)
App.jsx handlers — mutate state + write back to localStorage
```

### Layer 3: Routing (Tab-based)
No React Router. Navigation is a single `activeTab` string in state.

```jsx
{activeTab === 'dashboard' && <Dashboard ... />}
{activeTab === 'radar' && <OnDemandRadar ... />}
{activeTab === 'profile' && <ProfileStudio ... />}
```

### Layer 4: Business Logic (Utils)

#### `aiQualifier.js` — The AI Brain
Pure functions. No side effects. Reads from localStorage but does NOT write.

```
Input: { maxBudget, location, timelineUrgency, financingStatus } + targetProperty
  ↓
Check if inputs complete → if not, FALLBACK: read searchHistory from localStorage
  ↓
Compute 3 sub-scores: budgetScore, urgencyScore, locationScore
  ↓
compositeScore = (budget × 0.40) + (urgency × 0.35) + (location × 0.25)
  ↓
Determine tier: HOT ≥80 / WARM 60-79 / COLD <60
  ↓
Select nextActionDecision string (one of 3 directives)
  ↓
Build reasoning[] array (human-readable explanation)
  ↓
Find topMatches[] from all properties (by price + location fit)
  ↓
Return: QualificationResult object
```

#### `storage.js` — The Persistence Layer
CRUD wrapper around `localStorage`. Key responsibilities:
1. **Versioned keys** (`_v4` suffix): prevents conflicts when data schema changes
2. **Seed on first load**: injects `mockData.js` if localStorage is empty
3. **Legacy purge**: on every module import, removes old `_v1/_v2/_v3` keys
4. **Kerala guard**: detects if corrupted non-Kerala data is stored and resets

### Layer 5: Components

#### Component Hierarchy
```
App.jsx
├── Navbar.jsx
│   └── (active tab indicators + add listing button + avatar)
│
├── [Dashboard.jsx]  (when activeTab === 'dashboard')
│   ├── [Trending Spotlight section - inline JSX]
│   ├── [Search & Filter Bar - inline JSX]
│   └── PropertyCard.jsx (×N)
│
├── [OnDemandRadar.jsx]  (when activeTab === 'radar')
│   └── [AI Recommended cards - inline JSX]
│
├── [ProfileStudio.jsx]  (when activeTab === 'profile')
│   ├── [Seller Profile header + analytics - inline JSX]
│   ├── [Seller's property portfolio - inline JSX]
│   └── [Qualified Leads list - inline JSX]
│
├── PropertyDetailModal.jsx  (overlay, conditional)
│   └── [Gallery, features, seller info, qualify button]
│
├── LeadQualifierModal.jsx  (overlay, conditional)
│   ├── [Phase 1: Input form]
│   └── [Phase 2: Results view]
│
└── AddPropertyModal.jsx  (overlay, conditional)
    └── [Property upload form]
```

---

## 3. Data Architecture

### localStorage Schema (Version 4)

```
localStorage:
├── ai_kerala_portal_properties_v4     → Property[]   (JSON)
├── ai_kerala_portal_search_history_v4 → SearchHistoryItem[]  (JSON, max 15)
├── ai_kerala_portal_qualified_leads_v4 → QualifiedLead[]  (JSON)
└── ai_kerala_portal_user_profile_v4   → UserProfile  (JSON)
```

### Property View & Search Count Tracking
```
User clicks "View Details" on Property X
    ↓
App.jsx: handleViewDetails(property)
    ↓
storage.js: incrementPropertyView(property.id)
    → reads properties[] from localStorage
    → finds property by id
    → increments views + 1
    → writes updated array back to localStorage
    → returns updated array
    ↓
App.jsx: setProperties(updatedProps)
    → React re-renders with new view count displayed
```

### Search History & Behavioral Fallback
```
User submits search with city="Kochi", maxPrice=25000000
    ↓
App.jsx: handleSearchPerform(query, location, maxPrice, type)
    ↓
storage.js: addSearchHistoryItem({ query, location, maxPrice, type })
    → prepends new item to history array
    → caps at 15 entries (FIFO)
    → saves to localStorage
    ↓
[Later] User opens LeadQualifierModal, leaves inputs BLANK
    ↓
aiQualifier.js: runAILeadQualifier({}, targetProperty)
    → detects missing inputs (isFallbackUsed = true)
    → calls getSearchHistory() → reads all 15 entries
    → budget = avg([25000000, 40000000, 20000000]) = 28,333,333
    → location = mode(["Kochi", "Kumarakom", "Kochi"]) = "Kochi"
    → computes scores using inferred values
    → returns result with isFallbackUsed: true
```

---

## 4. Key Design Decisions & Rationale

### Decision 1: No Backend
**Why**: The v1 goal was to prove the AI qualification concept without infrastructure overhead. All data lives in the browser, enabling zero-latency filtering and instant AI scoring.  
**Trade-off**: Data doesn't persist across devices/browsers. This will be addressed in v2 with Firebase/Supabase.

### Decision 2: Weighted Scoring vs. ML Model
**Why**: A deterministic weighted formula (Budget 40% + Urgency 35% + Location 25%) is fully transparent and explainable — critical for broker trust. Brokers can audit every score.  
**Trade-off**: Not as adaptive as a trained model. Weights are static and don't learn from outcomes.

### Decision 3: localStorage Versioned Keys
**Why**: When the data schema changes, old localStorage entries cause crashes or display bugs. The `_v4` suffix + legacy purge logic ensures clean state on every schema change.

### Decision 4: Centralized State in App.jsx (No Redux/Zustand)
**Why**: The app has only 4–5 shared state variables. Introducing a state management library would add unnecessary complexity for this scale.  
**Trade-off**: If feature scope grows significantly, this will need refactoring to Context API or Zustand.

### Decision 5: mockData.js as Seed Data
**Why**: Provides a rich, realistic starting state for demos and development. The Kerala guard in `storage.js` ensures mock data is always of the correct locale (protects against legacy data corruption).

---

## 5. File Map (Complete)

```
Real_estate_lead_qualifier-1/
├── index.html                    # HTML shell, Vite entry
├── vite.config.js                # Vite config with React + Tailwind plugins
├── package.json                  # Dependencies: react, vite, tailwindcss, lucide-react
├── tsconfig.json                 # TypeScript config (loose, mostly for IDE support)
│
├── README.md                     # Project overview + setup guide
├── API.md                        # Internal function API reference
├── PRD.md                        # Product requirements document
├── DESIGN.md                     # Design system + component guidelines
├── ARCHITECTURE.md               # This file — system design + data flow
│
└── src/
    ├── main.jsx                  # React DOM entry point
    ├── App.jsx                   # Root: state, handlers, modal orchestration
    ├── index.css                 # Global styles + glassmorphism design tokens
    ├── style.css                 # Additional CSS utilities
    │
    ├── components/
    │   ├── Navbar.jsx            # Top navigation (tabs, brand, add button)
    │   ├── Dashboard.jsx         # Property feed + trending spotlight + search
    │   ├── PropertyCard.jsx      # Individual listing card component
    │   ├── PropertyDetailModal.jsx # Full property detail overlay
    │   ├── LeadQualifierModal.jsx  # AI qualification form + results modal
    │   ├── AddPropertyModal.jsx    # Seller property upload form
    │   ├── OnDemandRadar.jsx       # AI-powered discovery page
    │   └── ProfileStudio.jsx       # Seller profile + analytics + leads
    │
    ├── data/
    │   └── mockData.js           # 6 seeded Kerala properties + initial search history
    │
    └── utils/
        ├── aiQualifier.js        # AI scoring engine + INR formatter
        └── storage.js            # localStorage CRUD (versioned, legacy purge, seed)
```

---

## 6. Future Architecture (v2 Roadmap)

```
v2 Target Architecture:

Frontend (React SPA)
    ↓ HTTPS REST or GraphQL
Backend API (Node.js / FastAPI)
    ↓
Database (PostgreSQL / Firestore)
    ├── Properties table (with real listings from Kerala brokers)
    ├── Users / Sellers table (with verified accounts)
    ├── Leads table (with broker assignment tracking)
    └── Search Analytics table (for ML model training)
    ↓
ML Lead Scoring Model (Python / TensorFlow Lite)
    → Trained on actual conversion outcomes
    → Replaces static weight formula
    → Personalized per buyer profile

Broker Integration:
    → WhatsApp Business API (for escalation)
    → Twilio (SMS for lead alert to broker)
    → Firebase Cloud Messaging (push notifications)
```
