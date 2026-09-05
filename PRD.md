# Product Requirements Document (PRD)
## NEXUS.AI — Kerala Real Estate Lead Qualifier & AI Portal

**Version**: 1.0  
**Status**: ✅ Shipped  
**Owner**: Fenza Maria  
**Last Updated**: September 2026

---

## 1. Problem Statement

### The Market Gap
Kerala's real estate market suffers from a fundamental inefficiency: **conventional portals (MagicBricks, 99Acres, Housing.com) treat all buyers equally**. There is no mechanism to distinguish a serious buyer ready to close in 30 days from a casual browser exploring options 6 months from now.

This results in:
- Brokers wasting phone time on unqualified leads (estimated 65% of inquiries are not purchase-ready)
- High-intent buyers receiving slow responses because they are buried in the same lead queue
- Sellers with no visibility into which properties are actually generating demand vs. just impressions

### Why Kerala Specifically?
- Kerala has a distinct high-value NRI buyer segment (Gulf returnees, diaspora)
- Property naming conventions, price ranges (₹95L–₹3.85Cr), and geographic context (backwaters, hill stations, coastline) are unique
- Existing portals are India-generic — no differentiation for Kochi vs. Trivandrum vs. Kumarakom buyer demographics

---

## 2. Goals & Success Metrics

### Primary Goals
| Goal | Metric | Target |
|---|---|---|
| Qualify buyer intent automatically | AI Lead Score accuracy vs. human broker judgment | Lead tier (Hot/Warm/Cold) matches broker assessment ≥ 80% of time |
| Surface highest-demand properties first | Time-to-discovery for trending listings | User reaches top-3 trending properties within 1 interaction |
| Enable sellers to upload & manage listings | Listing upload completion rate | ≥ 90% form completion |
| Reduce broker cold-call time | Leads escalated that close | Only `A+` score leads go to direct call |

### Secondary Goals
- Provide a transparent, explainable AI — no black-box scores
- Allow behavioral inference when a buyer doesn't want to fill forms
- Support INR-native experience throughout (₹ Lakhs and Crores, not USD)

---

## 3. User Personas

### Persona 1: The Broker / Seller (Primary)
**Name**: Mathew Varghese  
**Role**: Kerala Property Owner & Investor  
**Goal**: List his properties, track which are generating real demand, and instantly see which inquiries are worth his personal time  
**Pain Point**: Gets 20 leads/week, only 3 are serious — no way to tell which without calling each one

### Persona 2: The Active Buyer (Primary)
**Name**: Rajan Nair (NRI, returning from Dubai)  
**Role**: Gulf returnee looking for a retirement home or investment property in Kerala  
**Goal**: Browse high-quality Kerala properties, understand which fit his ₹2.5 Cr budget and Kochi preference, get matched with the right seller quickly  
**Pain Point**: Generic portals don't understand his Kerala-specific preferences or price sensitivity

### Persona 3: The Passive Browser (Secondary)
**Name**: Asha Thomas  
**Role**: Young professional in Kochi, not ready to buy yet  
**Goal**: Explore options, save searches, understand price trends in Wayanad/Munnar  
**Pain Point**: Doesn't want to fill 10 fields just to see listings

---

## 4. Feature Requirements

### F1: Demand-First Dashboard (P0 — Must Have)
- **FR1.1**: Properties MUST be displayed sorted by `searchesCount` descending by default
- **FR1.2**: Top 3 properties by searches MUST appear in a "Trending Spotlight" section with `#1 / #2 / #3` rank badges
- **FR1.3**: Every property card MUST show live view count and search count
- **FR1.4**: Search must filter across title, location, and description fields simultaneously
- **FR1.5**: City filter must cover: Kochi, Kumarakom, Munnar, Trivandrum, Wayanad, Kozhikode
- **FR1.6**: Sort options: Most Searched, Most Viewed, Price Low→High, Price High→Low

### F2: AI Lead Qualification Engine (P0 — Must Have)
- **FR2.1**: Modal must accept: Budget (₹), Location, Timeline Urgency, Financing Status
- **FR2.2**: Engine MUST output a 0–100 composite score
- **FR2.3**: Score MUST use weighted formula: Budget 40% + Urgency 35% + Location 25%
- **FR2.4**: Result MUST show one of 3 next-action directives (Escalate / Nurture / Hold)
- **FR2.5**: Reasoning log MUST be human-readable and show all decision factors
- **FR2.6**: Fallback mode MUST trigger automatically if any required input is blank
- **FR2.7**: Fallback MUST infer budget (average of past searches), location (mode), and timeline from localStorage history
- **FR2.8**: Fallback usage MUST be visually indicated to the user ("Inferred from Past Search Vectors")
- **FR2.9**: Leads MUST be saveable to seller pipeline and persist across sessions

### F3: On-Demand Discovery Radar (P1 — Should Have)
- **FR3.1**: Radar page MUST cross-reference buyer's search history against current listings
- **FR3.2**: Every recommended property MUST show a "Why AI Recommended" reason badge
- **FR3.3**: Clicking a property on radar MUST increment `searchesCount` for that property

### F4: Seller Profile & Property Studio (P1 — Should Have)
- **FR4.1**: Profile page MUST show seller's name, role, contact details, and join date
- **FR4.2**: Analytics row MUST show: Total Views, Search Impressions, Qualified Leads count
- **FR4.3**: Add Property form MUST accept: title, type, city, price (₹), bedrooms, bathrooms, area (sq ft), image URL, description, timeline category
- **FR4.4**: Newly added properties MUST appear in the main feed immediately (no page reload)
- **FR4.5**: Seller's qualified leads list MUST be shown in the profile tab

### F5: Property Detail View (P1 — Should Have)
- **FR5.1**: Detail modal MUST show: full gallery (scrollable), all features, seller contact info
- **FR5.2**: Opening a detail view MUST increment `views` counter for that property
- **FR5.3**: "Qualify This Lead" button MUST open Lead Qualifier pre-filled with that property's context

### F6: Data Persistence (P0 — Must Have)
- **FR6.1**: All properties, search history, qualified leads, and user profiles MUST persist in localStorage
- **FR6.2**: Keys MUST be versioned (`_v4`) to enable clean legacy cache purge on schema changes
- **FR6.3**: System MUST detect and purge stale non-Kerala data automatically

---

## 5. Non-Functional Requirements

### Performance
- App must load in < 2 seconds on standard broadband (no backend round trips)
- All filtering/sorting operations must be instantaneous (< 50ms, client-side only)

### Design & UX
- Dark glassmorphism design system (deep slate backgrounds, frosted glass panels)
- All prices MUST be in ₹ Lakhs / Crores — no USD anywhere
- Mobile-responsive at all breakpoints (320px → 1440px+)
- Micro-animations on hover states and modal transitions

### Accessibility
- All interactive elements must have hover states
- Color should not be the only differentiator (use icons + labels alongside color badges)

### Privacy
- No data leaves the browser — all state in localStorage
- No external APIs, no analytics trackers, no login/auth required

---

## 6. Out of Scope (v1.0)

- Backend / database (planned v2.0)
- Real authentication and seller verification
- WhatsApp / SMS integration for broker escalation
- Payment gateway for booking deposits
- Map-based search (Leaflet/Google Maps integration)
- Thrissur, Palakkad, Pathanamthitta city expansion
- Multi-language support (Malayalam localization)

---

## 7. Timeline

| Milestone | Status |
|---|---|
| Design system + Tailwind setup | ✅ Complete |
| Mock data seeding (6 Kerala properties) | ✅ Complete |
| Dashboard + PropertyCard | ✅ Complete |
| AI Qualifier Engine (aiQualifier.js) | ✅ Complete |
| LeadQualifierModal (full UI + results) | ✅ Complete |
| localStorage persistence layer | ✅ Complete |
| OnDemandRadar | ✅ Complete |
| ProfileStudio + AddPropertyModal | ✅ Complete |
| PropertyDetailModal | ✅ Complete |
| README + Documentation | ✅ Complete |
