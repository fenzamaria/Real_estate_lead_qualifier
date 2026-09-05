# NEXUS.AI — Kerala Real Estate Lead Qualifier & AI Portal

> **Next-generation AI-powered real estate portal hyper-localized for Kerala, India.**  
> Replaces traditional property listing websites with intelligent buyer qualification, behavioral intent modeling, and automated broker next-action decision systems.

---

## 🌴 What Is NEXUS.AI?

NEXUS.AI is a full-featured frontend SPA (Single Page Application) that acts as both a real estate discovery portal and an AI-powered lead qualification engine — specifically built for the Kerala property market.

Unlike conventional portals that simply show listings, NEXUS.AI:
- **Ranks properties by real-time demand** (searches + views), not just recency
- **Qualifies buyers algorithmically** using a composite scoring model
- **Automatically infers buyer intent** from past search behaviour when explicit inputs are missing
- **Outputs structured next-action decisions** for brokers (escalate / nurture / hold)

---

## ✨ Core Features

### 1. 🔥 Demand-First Dashboard
- Properties sorted by `searchesCount` — highest demand shown first
- Top 3 trending properties highlighted in the **Demand Spotlight** section with `#1 / #2 / #3 Trending` badges
- Live view counters tracked per property session
- Filter by Kerala city, property type, or max price (₹ Rupees)
- Sort by: Most Searched | Most Viewed | Price Low→High | Price High→Low

### 2. 🤖 AI Lead Qualification & Decision Engine
- Accepts explicit buyer inputs: Budget (₹), Target City, Timeline Urgency, Financing Status
- **Behavioral Fallback Mode**: When inputs are missing, AI infers from past search history vectors
- Outputs a **Composite Lead Score (0–100)** using a weighted formula:
  - Budget Fit: **40% weight**
  - Timeline Urgency: **35% weight**
  - Location Match: **25% weight**
- Lead tiers: `A+ HOT` (≥80) | `B WARM` (60–79) | `C UNQUALIFIED` (<60)
- **AI Next-Action Directive**: One of 3 concrete broker actions
- Transparent reasoning log showing exactly why the AI made its decision
- Leads can be saved to seller pipeline (persisted in LocalStorage)

### 3. 🛰️ On-Demand Property Discovery Radar
- AI cross-references buyer's search history against available listings
- Every card shows a "Why AI Recommended" reason badge
- Clicking any result logs to search history and triggers view count increment

### 4. 🏠 Seller Profile & Property Upload Studio
- Seller dashboard showing Total Views, Search Impressions, Qualified Leads
- Upload new Kerala listings: title, type, city, price (₹), bedrooms, area, image
- Seller's uploaded properties shown in their managed portfolio
- View & qualify leads from within the profile

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 (dark glassmorphism system) |
| Icons | Lucide React |
| State | React `useState` / `useEffect` |
| Persistence | Browser `localStorage` (versioned keys `_v4`) |
| AI Logic | Pure JavaScript scoring engine (`aiQualifier.js`) |
| Build | Vite (ES Modules, no backend required) |

---

## 📂 Project Structure

```
src/
├── App.jsx                    # Root component, state orchestration, modal management
├── main.jsx                   # React DOM entry point
├── index.css                  # Global Tailwind + glassmorphism design tokens
│
├── components/
│   ├── Navbar.jsx             # Top navigation bar with tab routing
│   ├── Dashboard.jsx          # Main property feed + trending spotlight
│   ├── PropertyCard.jsx       # Reusable property listing card
│   ├── PropertyDetailModal.jsx# Full-screen property detail overlay
│   ├── LeadQualifierModal.jsx # AI lead qualification form + results
│   ├── AddPropertyModal.jsx   # Seller property upload form
│   ├── OnDemandRadar.jsx      # AI-powered property discovery radar
│   └── ProfileStudio.jsx      # Seller profile + portfolio dashboard
│
├── data/
│   └── mockData.js            # 6 seeded Kerala properties + initial search history
│
└── utils/
    ├── aiQualifier.js         # AI scoring engine + INR formatter
    └── storage.js             # localStorage CRUD layer (versioned, legacy purge)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### 1. Clone the Repository
```bash
git clone https://github.com/fenzamaria/Real_estate_lead_qualifier.git
cd Real_estate_lead_qualifier-1
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
# Opens at http://localhost:5173 (or 5174 if port in use)
```

### 4. Build for Production
```bash
npm run build
npm run preview   # Preview production build locally
```

---

## 🗺️ Kerala Cities Covered

| City | Landmark Properties |
|---|---|
| Kochi | Marine Drive Penthouse, Harbourfront |
| Kumarakom | Vembanad Backwater Heritage Villa |
| Munnar | Pallivasal Tea Plantation Bungalow |
| Trivandrum | Technopark Smart Villa |
| Wayanad | Vythiri Rainforest Eco Estate |
| Kozhikode | Malabar Beach Promenade Condo |
| Thrissur | (Planned expansion) |

---

## 📄 License
MIT License © 2026 NEXUS.AI
