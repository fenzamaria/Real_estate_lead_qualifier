# API Reference — NEXUS.AI Internal Logic

> NEXUS.AI has **no backend or REST API**. All "API" surfaces are internal JavaScript module exports (utility functions) that components call directly. This document covers every public function signature, its inputs, outputs, and behaviour.

---

## 📦 Module: `src/utils/aiQualifier.js`

The core AI scoring engine. All logic is deterministic pure JavaScript — no external API calls.

---

### `formatINR(amount)`

Formats a numeric Rupee amount into human-readable Indian notation.

**Parameters**

| Param | Type | Description |
|---|---|---|
| `amount` | `number` | Raw amount in Indian Rupees (₹) |

**Returns** `string`

**Conversion Rules**

| Amount Range | Output Format | Example |
|---|---|---|
| ≥ 1,00,00,000 | `₹X.XX Cr` | `₹3.85 Cr` |
| ≥ 1,00,000 | `₹X.XX Lakh` | `₹95 Lakh` |
| < 1,00,000 | `₹X,XX,XXX` (en-IN) | `₹85,000` |
| Invalid / 0 | `₹0` | |

**Example**
```js
formatINR(38500000)  // → "₹3.85 Cr"
formatINR(9500000)   // → "₹95 Lakh"
formatINR(0)         // → "₹0"
```

---

### `runAILeadQualifier(inputPreferences, targetProperty)`

The main AI lead qualification and next-action decision engine.

**Parameters**

| Param | Type | Required | Description |
|---|---|---|---|
| `inputPreferences` | `object` | No | Explicit buyer preferences entered in the UI form |
| `inputPreferences.maxBudget` | `number \| string` | No | Max buyer budget in ₹ |
| `inputPreferences.location` | `string` | No | Preferred Kerala city or area |
| `inputPreferences.timelineUrgency` | `string` | No | One of: `"Immediate (< 30 days)"`, `"Flexible (1-3 months)"`, `"Exploring (3+ months)"` |
| `inputPreferences.financingStatus` | `string` | No | One of: `"Self-Funded / Cash Buyer"`, `"Pre-approved Bank Mortgage"`, `"Requires Mortgage Approval"` |
| `targetProperty` | `Property \| null` | No | The specific property being evaluated. If `null`, runs a general portfolio match. |

**Behavioral Fallback Logic**

If any of `maxBudget`, `location`, or `timelineUrgency` are empty/missing, the engine **automatically infers** them from `localStorage` search history:
- **Budget**: Average of all `maxPrice` values from past searches
- **Location**: Most frequently searched location (mode)
- **Timeline**: Defaults to `"Immediate (< 30 days)"` if not determinable
- **Property Type**: Most frequently searched type

The `isFallbackUsed` flag in the response indicates whether inference was triggered.

**Scoring Formula**

```
compositeScore = (budgetScore × 0.40) + (urgencyScore × 0.35) + (locationScore × 0.25)
```

**Budget Score (0–100)**

| Condition | Score |
|---|---|
| `budget >= property.price` | 100 |
| `budget < property.price` | `round((budget / price) × 100)`, min 30 |
| No target property, budget ≥ ₹1 Cr | 95 |
| No target property, budget < ₹1 Cr | 75 |

**Urgency Score (0–100)**

| Timeline Input | Score |
|---|---|
| `"Immediate (< 30 days)"` | 95 |
| `"Flexible (1-3 months)"` | 75 |
| `"Exploring (3+ months)"` | 40 |

**Location Score (0–100)**

| Condition | Score |
|---|---|
| Property city/location contains buyer's location preference | 100 |
| Mismatch | 60 |
| No target property | 80 (default) |

**Lead Tiers**

| Score Range | Category | Badge Color | Next Action |
|---|---|---|---|
| ≥ 80 | `HOT / HIGHLY QUALIFIED` | Emerald / `A+` | ESCALATE IMMEDIATELY TO KERALA REGIONAL BROKER VIA DIRECT CALL |
| 60–79 | `WARM / NURTURE NEEDED` | Amber / `B` | SCHEDULE AUTOMATED VIRTUAL PROPERTY TOUR & ASSIGN TO NURTURE PIPELINE |
| < 60 | `UNQUALIFIED / LOW URGENCY` | Rose / `C` | HOLD IN AUTOMATED KERALA DISCOVERY FEED & DISCARD IMMEDIATE ESCALATION |

**Returns** `QualificationResult` object:

```js
{
  leadScore: number,               // 0–100 composite score
  category: string,                // Lead tier label
  badgeColor: "emerald" | "amber" | "rose",
  isFallbackUsed: boolean,         // true if AI inferred from search history
  structuredSummary: {
    budgetMatchPercent: number,    // Budget score (0–100)
    urgencyScore: number,          // Urgency score (0–100)
    locationScore: number,         // Location score (0–100)
    inferredBudget: number,        // Effective budget used (₹)
    inferredBudgetFormatted: string,  // e.g. "₹2.5 Cr"
    inferredLocation: string,      // Effective location used
    inferredTimeline: string,      // Effective timeline used
    financingStatus: string,       // Financing status used
    targetPropertyTitle: string    // Property title or "General Kerala Portfolio Match"
  },
  nextActionDecision: string,      // Broker action directive
  reasoning: string[],             // Array of explanation strings
  topMatches: Property[]           // Top 3 matching properties from all listings
}
```

---

## 📦 Module: `src/utils/storage.js`

LocalStorage CRUD layer. All data persists across sessions under versioned keys (`_v4`).

**Storage Keys**

| Key | Purpose |
|---|---|
| `ai_kerala_portal_properties_v4` | All property listings array |
| `ai_kerala_portal_search_history_v4` | User search history (max 15 entries) |
| `ai_kerala_portal_qualified_leads_v4` | Saved qualified lead results |
| `ai_kerala_portal_user_profile_v4` | Logged-in seller profile object |

> **Legacy Purge**: On every load, the module removes deprecated keys from previous app versions (`ai_portal_properties`, etc.) to prevent stale data collisions.

---

### `getStoredProperties()` → `Property[]`
Returns all properties from storage. Seeds from `mockData.js` on first load. Auto-resets if non-Kerala data is detected (legacy guard).

### `saveProperties(properties)` → `void`
Saves the full properties array to localStorage.

### `incrementPropertyView(propertyId)` → `Property[]`
Increments `views` counter for the given property ID. Returns updated array.

### `incrementPropertySearchCount(propertyIds)` → `Property[]`
Increments `searchesCount` for all properties whose IDs are in the provided array. Returns updated array.

### `addCustomProperty(newProp)` → `Property[]`
Creates a new property with auto-generated `id` (`prop-custom-<timestamp>`), links it to the current seller profile, and prepends it to the list. Returns updated array.

### `getSearchHistory()` → `SearchHistoryItem[]`
Returns search history. Seeds with 3 sample Kerala searches on first load.

### `addSearchHistoryItem(searchItem)` → `SearchHistoryItem[]`
Prepends new search item to history. Caps history at 15 entries (oldest dropped). Returns updated array.

### `getQualifiedLeads()` → `QualifiedLead[]`
Returns all saved qualified leads. Returns empty array if none exist.

### `saveQualifiedLead(lead)` → `QualifiedLead[]`
Saves a new qualified lead with auto-generated `id` and ISO `createdAt` timestamp. Prepends to list. Returns updated array.

### `getStoredUserProfile()` → `UserProfile`
Returns seller profile. Seeds with default **Mathew Varghese** profile on first load.

### `saveUserProfile(profile)` → `void`
Saves updated user profile to localStorage.

---

## 📊 Data Models

### `Property`
```ts
{
  id: string                  // e.g. "prop-1", "prop-custom-1234567"
  title: string               // e.g. "Kochi Harbourfront Sky Penthouse"
  location: string            // Full address string
  city: string                // Kerala city name
  price: number               // Price in ₹ (raw integer)
  priceDisplay: string        // e.g. "₹2.45 Cr"
  type: string                // "Penthouse" | "Villa" | "Chalet" | "Condo" | etc.
  bedrooms: number
  bathrooms: number
  areaSqFt: number
  views: number               // Session-tracked view count
  searchesCount: number       // Times this property appeared in a search
  isMostSearched: boolean
  rating: number              // 0–5.0
  imageUrl: string            // Primary image URL
  gallery: string[]           // Array of image URLs
  description: string
  features: string[]          // Key feature tags
  timelineCategory: string    // "Immediate (< 30 days)" | "Flexible (1-3 months)" | etc.
  seller: SellerProfile
}
```

### `SellerProfile / UserProfile`
```ts
{
  id: string
  name: string
  role: string
  phone: string
  email: string
  avatar: string              // Image URL
  joinedDate?: string
}
```

### `SearchHistoryItem`
```ts
{
  id: string                  // "sh-<timestamp>"
  query: string               // Search text
  location: string            // Kerala city filter used
  maxPrice: number            // Max price filter used (₹)
  type: string                // Property type filter used
  timestamp: number           // Unix ms timestamp
}
```

### `QualifiedLead`
```ts
{
  id: string                  // "lead-<timestamp>"
  createdAt: string           // ISO 8601 date string
  targetPropertyId: string | null
  targetPropertyTitle: string
  leadScore: number
  category: string
  nextActionDecision: string
  summary: StructuredSummary
  reasoning: string[]
  isFallbackUsed: boolean
}
```
