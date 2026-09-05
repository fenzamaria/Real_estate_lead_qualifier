# Design System — NEXUS.AI
## Visual Language, Components & UI Guidelines

---

## 1. Design Philosophy

NEXUS.AI uses a **Dark Glassmorphism** design system. The aesthetic is inspired by premium fintech and proptech interfaces — think Robinhood, Vercel, Linear.

**Core Principles**:
1. **Dark-first**: Deep slate backgrounds (#0f172a, #020617) eliminate eye strain and elevate the luxury real estate aesthetic
2. **Glassmorphism layering**: Frosted glass panels create visual depth without heavy borders
3. **Cyan-to-Indigo gradient language**: Used exclusively for primary CTAs and AI-powered features
4. **Amber flame language**: Used for trending/hot/demand indicators
5. **Emerald/Amber/Rose semantic colors**: Represent Hot/Warm/Cold lead tiers
6. **Micro-animations everywhere**: Every hover, click, and transition reinforces interactivity

---

## 2. Color Palette

### Background Scale
| Token | Hex / Tailwind | Usage |
|---|---|---|
| `bg-slate-950` | `#020617` | Page root background |
| `bg-slate-900` | `#0f172a` | Card surfaces |
| `bg-slate-800` | `#1e293b` | Borders, dividers |
| `bg-slate-700` | `#334155` | Hover states |

### Brand Gradients
| Usage | Gradient |
|---|---|
| Primary CTA buttons | `from-cyan-500 via-indigo-500 to-purple-600` |
| AI feature accents | `from-cyan-500 to-indigo-600` |
| Save/Confirm actions | `from-emerald-500 to-teal-600` |
| Navbar brand logo | `from-cyan-400 to-indigo-500` |

### Semantic Colors (Lead Tiers)
| Tier | Color | Tailwind Classes |
|---|---|---|
| HOT / A+ | Emerald | `bg-emerald-950/40 border-emerald-500/40 text-emerald-200` |
| WARM / B | Amber | `bg-amber-950/40 border-amber-500/40 text-amber-200` |
| COLD / C | Rose | `bg-rose-950/40 border-rose-500/40 text-rose-200` |

### Accent Colors
| Usage | Color |
|---|---|
| AI features, icons, links | Cyan-400 (`#22d3ee`) |
| Trending badges, flame icons | Amber-400 (`#fbbf24`) |
| Inline search history badge | Purple-300 |
| Seller analytics | Emerald-400 |

---

## 3. Typography

**Font Family**: System sans-serif via Tailwind's `font-sans` (Inter/SF Pro/Segoe UI stack)  
**Font Family (mono)**: `font-mono` — used for prices, counters, score values, API-like labels

### Type Scale
| Class | Size | Weight | Usage |
|---|---|---|---|
| `text-4xl font-black` | 36px, 900 | Hero headlines (`Top Trending Real Estate`) |
| `text-2xl font-black` | 24px, 900 | Page section titles |
| `text-xl font-bold` | 20px, 700 | Modal titles |
| `text-base font-bold` | 16px, 700 | Property card titles |
| `text-sm` | 14px, 400 | Body text, descriptions |
| `text-xs font-semibold` | 12px, 600 | Labels, filter text |
| `text-[11px] font-mono` | 11px, mono | Prices, scores, metrics |
| `text-[10px] uppercase tracking-widest` | 10px, 700 | Category labels, badge text |

---

## 4. Design Tokens (Custom CSS Classes)

Defined in `src/index.css` as Tailwind custom utilities:

### `.glass-panel`
```css
/* Frosted glass container — used for main page sections */
background: rgba(15, 23, 42, 0.85);
backdrop-filter: blur(16px);
border: 1px solid rgba(51, 65, 85, 0.6);
```
Usage: Navbar, search bar, footer, section containers

### `.glass-card`
```css
/* Elevated card surface — used for property cards */
background: rgba(15, 23, 42, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(51, 65, 85, 0.5);
transition: all 0.2s ease;
```
Usage: PropertyCard, trending spotlight cards, modals

### `.glass-input`
```css
/* Styled form inputs */
background: rgba(30, 41, 59, 0.8);
border: 1px solid rgba(71, 85, 105, 0.5);
color: white;
transition: border-color 0.2s;
```
Usage: Search bar, qualifier form fields, Add Property form

---

## 5. Component Library

### PropertyCard
**File**: `src/components/PropertyCard.jsx`  
**Size**: Always fills grid column, responsive

**Structure**:
```
┌─────────────────────────────┐
│ [Image 200px tall]          │
│ [Price badge overlay - BR]  │
│ [Hot/New badge - TL]        │
├─────────────────────────────┤
│ Property Title              │
│ 📍 Location                 │
│ ⭐ Rating   🛏 Beds  📐 sqft│
├─────────────────────────────┤
│ [View Details] [Qualify]    │
└─────────────────────────────┘
```

**States**:
- Default: `border-slate-800`
- `isMostSearched: true`: `border-amber-500/30` glow ring
- Hover: image scales `scale-105`, card lifts with shadow

---

### LeadQualifierModal
**File**: `src/components/LeadQualifierModal.jsx`

**Two-phase UI flow**:
```
Phase 1: INPUT
┌──────────────────────────────────┐
│ AI Lead Qualification Agent      │
│ [Cyan info box: how to qualify]  │
│                                  │
│ Budget ₹    │ Target City        │
│ Timeline    │ Financing Status   │
│                                  │
│ [Evaluate & Qualify] [Fallback]  │
└──────────────────────────────────┘

Phase 2: RESULTS
┌──────────────────────────────────┐
│ HOT / HIGHLY QUALIFIED    98/100 │
│ (or WARM / or UNQUALIFIED)  [A+] │
│                                  │
│ ⚡ AI NEXT-ACTION DIRECTIVE      │
│ [Escalate / Nurture / Hold text] │
│                                  │
│ Budget%  │ Urgency  │ Financing  │
│                                  │
│ → Reasoning bullet 1             │
│ → Reasoning bullet 2             │
│ → Reasoning bullet 3             │
│                                  │
│ [← Re-evaluate]  [Save Lead ✓]  │
└──────────────────────────────────┘
```

---

### Navbar
**File**: `src/components/Navbar.jsx`  
**Position**: Fixed top, `glass-panel` styled

**Left**: NEXUS.AI brand logo with cyan→indigo gradient spark icon  
**Center**: Three navigation tabs — Dashboard | Discovery Radar | Seller Studio  
**Right**: `+ Add Listing` button + seller avatar

Active tab: `bg-cyan-500/20 text-cyan-400 border border-cyan-500/30`  
Inactive tab: `text-slate-400 hover:text-white`

---

### Trending Spotlight Cards
**Location**: Top of Dashboard  
**Dimensions**: `md:grid-cols-3` layout, image `h-44`  
**Special elements**:
- `#1 / #2 / #3 Trending` amber badge
- View count badge in top-right corner
- `border-amber-500/30` glow border

---

## 6. Animation & Motion

| Interaction | Animation |
|---|---|
| Property image hover | `hover:scale-105 transition-transform duration-500` |
| Button hover | Background color shift `transition-colors` / `transition-all` |
| Modal open | Fade-in via `backdrop-blur-md` on overlay |
| Lead score badge | Static (animate to score in future v2) |
| Saving lead | Text changes from "Save Qualified Lead" → "✓ Lead Saved!", 3s timeout |

---

## 7. Iconography

All icons from **Lucide React** (`lucide-react` npm package).

| Icon | Usage |
|---|---|
| `Sparkles` | AI features, qualifier engine, recommendations |
| `Flame` | Trending/hot badge, demand indicators |
| `MapPin` | Location fields and property addresses |
| `IndianRupee` | Budget input label |
| `Clock` | Timeline urgency |
| `CreditCard` | Financing status |
| `ShieldCheck` | AI next-action directive header |
| `History` | Past search fallback mode |
| `Eye` | View count display |
| `Search` | Search bar icon |
| `Star` | Property rating |
| `Bed` | Bedroom count |
| `CheckCircle2` | Save lead confirmation |
| `X` | Close modal |
| `ChevronRight` | Reasoning list bullet |

---

## 8. Responsive Layout

| Breakpoint | Layout |
|---|---|
| `< 768px` (Mobile) | Single column grid, stacked nav, full-width buttons |
| `768px–1024px` (Tablet) | 2-column property grid, horizontal nav |
| `> 1024px` (Desktop) | 3-column property grid, full navbar, side-by-side forms |

Max content width: `max-w-7xl mx-auto` on all main sections.

---

## 9. Spacing & Border Radius System

| Context | Border Radius |
|---|---|
| Page sections, modals | `rounded-3xl` (24px) |
| Cards | `rounded-2xl` (16px) |
| Inputs, buttons | `rounded-xl` (12px) |
| Tags, badges | `rounded-full` or `rounded-lg` (8px) |
| Avatar images | `rounded-full` (circle) |

**Standard spacing**: `space-y-6`, `gap-6` for grid items, `p-5` / `p-6` for card padding.
