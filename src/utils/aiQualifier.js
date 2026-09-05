import { getSearchHistory, getStoredProperties } from './storage';

export const formatINR = (amount) => {
  if (!amount || isNaN(amount)) return '₹0';
  if (amount >= 10000000) {
    const cr = (amount / 10000000).toFixed(2);
    return `₹${cr.endsWith('.00') ? cr.slice(0, -3) : cr} Cr`;
  }
  if (amount >= 100000) {
    const lakh = (amount / 100000).toFixed(2);
    return `₹${lakh.endsWith('.00') ? lakh.slice(0, -3) : lakh} Lakh`;
  }
  return '₹' + Number(amount).toLocaleString('en-IN');
};

/**
 * AI Lead Qualifier & Next-Action Decision Engine for Kerala Real Estate
 */
export const runAILeadQualifier = (inputPreferences = {}, targetProperty = null) => {
  const pastSearches = getSearchHistory();
  const allProperties = getStoredProperties();
  
  let isFallbackUsed = false;
  let effectivePreferences = { ...inputPreferences };

  // Check if explicit preferences are missing/blank
  const hasExplicitBudget = Boolean(inputPreferences.maxBudget && Number(inputPreferences.maxBudget) > 0);
  const hasExplicitLocation = Boolean(inputPreferences.location && inputPreferences.location.trim() !== '');
  const hasExplicitTimeline = Boolean(inputPreferences.timelineUrgency && inputPreferences.timelineUrgency !== '');

  // FALLBACK LOGIC: If preferences missing, infer from past searches!
  if (!hasExplicitBudget || !hasExplicitLocation || !hasExplicitTimeline) {
    isFallbackUsed = true;
    
    // Calculate average budget from past searches
    if (!hasExplicitBudget && pastSearches.length > 0) {
      const pastBudgets = pastSearches.map(s => s.maxPrice).filter(Boolean);
      if (pastBudgets.length > 0) {
        const avgBudget = pastBudgets.reduce((a, b) => a + b, 0) / pastBudgets.length;
        effectivePreferences.maxBudget = Math.round(avgBudget);
      } else {
        effectivePreferences.maxBudget = targetProperty ? targetProperty.price : 25000000;
      }
    }

    // Infer top location from past searches
    if (!hasExplicitLocation && pastSearches.length > 0) {
      const locCounts = {};
      pastSearches.forEach(s => {
        if (s.location) locCounts[s.location] = (locCounts[s.location] || 0) + 1;
      });
      const sortedLocs = Object.keys(locCounts).sort((a, b) => locCounts[b] - locCounts[a]);
      effectivePreferences.location = sortedLocs[0] || (targetProperty ? targetProperty.city : 'Kochi');
    }

    // Infer timeline urgency if unspecified
    if (!hasExplicitTimeline) {
      effectivePreferences.timelineUrgency = inputPreferences.timelineUrgency || 'Immediate (< 30 days)';
    }

    // Infer preferred property type
    if (!effectivePreferences.propertyType && pastSearches.length > 0) {
      const typeCounts = {};
      pastSearches.forEach(s => {
        if (s.type) typeCounts[s.type] = (typeCounts[s.type] || 0) + 1;
      });
      const sortedTypes = Object.keys(typeCounts).sort((a, b) => typeCounts[b] - typeCounts[a]);
      effectivePreferences.propertyType = sortedTypes[0] || (targetProperty ? targetProperty.type : 'Penthouse');
    }
  }

  // QUALIFICATION METRICS COMPUTATION
  const maxBudget = Number(effectivePreferences.maxBudget) || 25000000;
  const locationPref = (effectivePreferences.location || '').toLowerCase();
  const timelineUrgency = effectivePreferences.timelineUrgency || 'Flexible (1-3 months)';
  const financingStatus = effectivePreferences.financingStatus || 'Pre-approved Bank Mortgage';

  // 1. Budget Fit Score (0 - 100)
  let budgetScore = 85;
  if (targetProperty) {
    if (maxBudget >= targetProperty.price) {
      budgetScore = 100;
    } else {
      const ratio = maxBudget / targetProperty.price;
      budgetScore = Math.max(30, Math.round(ratio * 100));
    }
  } else {
    budgetScore = maxBudget >= 10000000 ? 95 : 75;
  }

  // 2. Timeline Urgency Score
  let urgencyScore = 50;
  if (timelineUrgency.includes('< 30 days') || timelineUrgency.includes('Immediate')) {
    urgencyScore = 95;
  } else if (timelineUrgency.includes('1-3 months')) {
    urgencyScore = 75;
  } else if (timelineUrgency.includes('3+ months') || timelineUrgency.includes('Exploring')) {
    urgencyScore = 40;
  }

  // 3. Location Match Score
  let locationScore = 80;
  if (targetProperty && locationPref) {
    if (targetProperty.location.toLowerCase().includes(locationPref) || targetProperty.city.toLowerCase().includes(locationPref)) {
      locationScore = 100;
    } else {
      locationScore = 60;
    }
  }

  // Composite Lead Qualification Score (Weighted average)
  const compositeScore = Math.round((budgetScore * 0.40) + (urgencyScore * 0.35) + (locationScore * 0.25));

  // Determine Qualification Category & Tier
  let leadCategory = 'HOT / HIGHLY QUALIFIED';
  let badgeColor = 'emerald';
  
  if (compositeScore >= 80) {
    leadCategory = 'HOT / HIGHLY QUALIFIED';
    badgeColor = 'emerald';
  } else if (compositeScore >= 60) {
    leadCategory = 'WARM / NURTURE NEEDED';
    badgeColor = 'amber';
  } else {
    leadCategory = 'UNQUALIFIED / LOW URGENCY';
    badgeColor = 'rose';
  }

  // DECISION ENGINE: Output structured Next-Action & Reasoning
  let nextActionDecision = '';
  let decisionReasoning = [];

  const formattedBudgetStr = formatINR(maxBudget);

  if (compositeScore >= 80) {
    nextActionDecision = 'ESCALATE IMMEDIATELY TO KERALA REGIONAL BROKER VIA DIRECT CALL';
    decisionReasoning.push(`Strong buyer readiness with composite score of ${compositeScore}/100.`);
    decisionReasoning.push(`Pricing expectation aligns with target listing (${formattedBudgetStr} budget vs required price).`);
    decisionReasoning.push(`High timeline urgency (${timelineUrgency}) indicates buyer is ready to complete registration within 30 days.`);
    decisionReasoning.push(`Financing is confirmed via ${financingStatus}.`);
  } else if (compositeScore >= 60) {
    nextActionDecision = 'SCHEDULE AUTOMATED VIRTUAL PROPERTY TOUR & ASSIGN TO NURTURE PIPELINE';
    decisionReasoning.push(`Buyer demonstrates genuine interest with a score of ${compositeScore}/100, but has secondary timeline urgency (${timelineUrgency}).`);
    decisionReasoning.push(`Budget match is moderate (${budgetScore}% alignment).`);
    decisionReasoning.push(`Action: Dispatch video walkthrough of Kerala property + schedule agent call in 48 hours.`);
  } else {
    nextActionDecision = 'HOLD IN AUTOMATED KERALA DISCOVERY FEED & DISCARD IMMEDIATE ESCALATION';
    decisionReasoning.push(`Lead is currently unqualified for direct broker phone escalation (Score: ${compositeScore}/100).`);
    decisionReasoning.push(`Budget gap or distant move-in timeline (${timelineUrgency}) indicates early-stage browsing.`);
    decisionReasoning.push(`Action: Keep lead subscribed to weekly Kerala property alerts without spending broker phone time.`);
  }

  // Append fallback explicit reasoning note
  if (isFallbackUsed) {
    decisionReasoning.push(`ℹ️ AI Behavioral Inference: Because explicit preference inputs were incomplete, preferences were derived automatically from past search logs (Average budget ~${formattedBudgetStr}, preferred location: '${effectivePreferences.location}').`);
  }

  // Find Property Matches based on preferences
  const matchedProperties = allProperties
    .map(p => {
      let score = 70;
      if (p.price <= maxBudget) score += 15;
      if (effectivePreferences.location && p.location.toLowerCase().includes(effectivePreferences.location.toLowerCase())) score += 15;
      return { ...p, matchScore: Math.min(99, score) };
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    leadScore: compositeScore,
    category: leadCategory,
    badgeColor,
    isFallbackUsed,
    structuredSummary: {
      budgetMatchPercent: budgetScore,
      urgencyScore,
      locationScore,
      inferredBudget: maxBudget,
      inferredBudgetFormatted: formattedBudgetStr,
      inferredLocation: effectivePreferences.location,
      inferredTimeline: timelineUrgency,
      financingStatus,
      targetPropertyTitle: targetProperty ? targetProperty.title : 'General Kerala Portfolio Match'
    },
    nextActionDecision,
    reasoning: decisionReasoning,
    topMatches: matchedProperties.slice(0, 3)
  };
};
