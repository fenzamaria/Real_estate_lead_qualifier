# NEXUS.AI — Kerala Real Estate Lead Qualifier & AI Portal

An AI-powered real estate portal specifically localized for **Kerala, India**, replacing traditional listing websites with intelligent buyer qualification algorithms, intent modeling, and automated broker next-action decisions.

![Kerala Real Estate Portal](https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80)

---

## 🌴 Key Features & Capabilities

### 1. Dashboard: Most Searched Kerala Properties First
- **Demand Spotlight**: Highlights high-demand Kerala properties based on real-time view counts and search volume (`#1 Kumarakom Backwater Heritage Villa`, `#2 Kochi Harbourfront Sky Penthouse`, `#3 Munnar Misty Tea Plantation Bungalow`).
- **Dynamic Search & Filtering**: Filter listings by Kerala cities (**Kochi, Kumarakom, Munnar, Trivandrum, Wayanad, Kozhikode, Thrissur**), property types, and budget limits.
- **Indian Rupee (₹) Formatting**: Prices displayed in Lakhs and Crores (`₹3.85 Cr`, `₹2.45 Cr`, `₹95 Lakh`).

### 2. AI Lead Qualification & Next-Action Decision Engine
- **Explicit Buyer Qualification**: Prompts prospective buyers for budget expectations in ₹, preferred location, move-in urgency (`< 30 days`, `1-3 months`), and financing readiness.
- **Behavioral Intent Vector Fallback**: If explicit preferences are missing or incomplete, the AI automatically computes buyer preferences from historical search vectors and browsing patterns.
- **Structured Lead Summary**:
  - Lead Score (e.g. `98/100 A+ HOT / HIGHLY QUALIFIED`).
  - Metric breakdown (Budget Fit %, Urgency Score, Location Match, Financing status).
- **AI Next-Action Decision Directive**:
  - `⚡ ESCALATE IMMEDIATELY TO KERALA REGIONAL BROKER VIA DIRECT CALL`
  - `⚡ SCHEDULE AUTOMATED VIRTUAL PROPERTY TOUR & ASSIGN TO NURTURE PIPELINE`
  - `⚡ HOLD IN AUTOMATED KERALA DISCOVERY FEED & DISCARD IMMEDIATE ESCALATION`
- **Transparent AI Decision Reasoning**: Bulleted breakdown explaining the rationale behind every qualification decision.

### 3. Seller Profile & Property Upload Studio
- Manage seller portfolio (`Mathew Varghese`, `Kerala Property Owner & Investor`).
- Form to upload new Kerala listings with Rupee price inputs (`₹`) and instant image previews.
- Real-time seller analytics (Total Views, Search Impressions, AI-Qualified Leads).

### 4. On-Demand Property Discovery Radar
- AI matching engine cross-referencing buyer activity with available listings.
- "Why AI Recommended" badge on every property card.

---

## 🛠️ Tech Stack & Architecture

- **Frontend Framework**: React 18 + Vite
- **Styling & Aesthetics**: Tailwind CSS v4 + Dark Glassmorphism Design System
- **Icons**: Lucide React Icons
- **State & Vectors**: LocalStorage Persistence Engine with automatic legacy cache purge

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/fenzamaria/Real_estate_lead_qualifier.git
cd Real_estate_lead_qualifier
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
# Open http://localhost:5173/ in your browser
```

### 4. Build for Production
```bash
npm run build
```

---

## 📄 License
MIT License
