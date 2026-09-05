import React, { useState } from 'react';
import { X, Sparkles, AlertTriangle, CheckCircle2, ArrowRight, ShieldCheck, History, IndianRupee, MapPin, Clock, CreditCard, ChevronRight } from 'lucide-react';
import { runAILeadQualifier, formatINR } from '../utils/aiQualifier';
import { saveQualifiedLead } from '../utils/storage';

export default function LeadQualifierModal({ targetProperty, onClose }) {
  const [budget, setBudget] = useState(targetProperty ? targetProperty.price : '');
  const [location, setLocation] = useState(targetProperty ? targetProperty.city : '');
  const [timelineUrgency, setTimelineUrgency] = useState('Immediate (< 30 days)');
  const [financingStatus, setFinancingStatus] = useState('Pre-approved Bank Mortgage');

  const [qualificationResult, setQualificationResult] = useState(null);
  const [savedLeadMessage, setSavedLeadMessage] = useState(false);

  // Trigger explicit qualification
  const handleRunQualification = (isExplicit = true) => {
    let prefs = {};
    if (isExplicit) {
      prefs = {
        maxBudget: budget,
        location: location,
        timelineUrgency,
        financingStatus
      };
    }
    // If not explicit (or empty), runAILeadQualifier automatically uses past search history fallback!
    const result = runAILeadQualifier(prefs, targetProperty);
    setQualificationResult(result);
  };

  // Trigger past search fallback qualification
  const handleRunFallbackQualification = () => {
    setBudget('');
    setLocation('');
    handleRunQualification(false);
  };

  const handleSaveLead = () => {
    if (!qualificationResult) return;
    saveQualifiedLead({
      targetPropertyId: targetProperty ? targetProperty.id : null,
      targetPropertyTitle: targetProperty ? targetProperty.title : 'General Kerala Portfolio',
      leadScore: qualificationResult.leadScore,
      category: qualificationResult.category,
      nextActionDecision: qualificationResult.nextActionDecision,
      summary: qualificationResult.structuredSummary,
      reasoning: qualificationResult.reasoning,
      isFallbackUsed: qualificationResult.isFallbackUsed
    });
    setSavedLeadMessage(true);
    setTimeout(() => setSavedLeadMessage(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/30 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-indigo-950/50 to-slate-900">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                AI Lead Qualification Agent
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  Real-Time Kerala Decision Engine
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {targetProperty ? `Inquiring for: ${targetProperty.title}` : 'Evaluating buyer parameters & next action'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="h-9 w-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Step 1: Input Preferences OR Behavioral Fallback Option */}
          {!qualificationResult && (
            <div className="space-y-6">
              
              <div className="bg-cyan-950/30 border border-cyan-500/20 rounded-2xl p-4 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-bold text-cyan-300">How would you like to qualify this lead?</p>
                  <p className="text-slate-400 leading-relaxed">
                    You can either enter explicit budget & timeline preferences below, OR click <strong className="text-purple-300">"Qualify via Past Searches"</strong> to let our AI automatically infer buyer intent from historical search logs and browsing patterns.
                  </p>
                </div>
              </div>

              {/* Form Input Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Budget */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <IndianRupee className="w-3.5 h-3.5 text-cyan-400" /> Max Target Budget (₹ in Rupees)
                  </label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g. 25000000 (2.5 Cr)"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                  {budget > 0 && (
                    <p className="text-[11px] text-cyan-400 font-mono font-semibold">
                      Format: {formatINR(Number(budget))}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Target Location / City
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Kochi, Munnar, Trivandrum"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none"
                  />
                </div>

                {/* Timeline Urgency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Timeline Urgency
                  </label>
                  <select
                    value={timelineUrgency}
                    onChange={(e) => setTimelineUrgency(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none bg-slate-900"
                  >
                    <option value="Immediate (< 30 days)">Immediate (&lt; 30 days)</option>
                    <option value="Flexible (1-3 months)">Flexible (1-3 months)</option>
                    <option value="Exploring (3+ months)">Exploring (3+ months)</option>
                  </select>
                </div>

                {/* Financing Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-cyan-400" /> Financing Readiness
                  </label>
                  <select
                    value={financingStatus}
                    onChange={(e) => setFinancingStatus(e.target.value)}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm text-white focus:outline-none bg-slate-900"
                  >
                    <option value="Self-Funded / Cash Buyer">Self-Funded / Cash Buyer</option>
                    <option value="Pre-approved Bank Mortgage">Pre-approved Bank Mortgage (SBI/HDFC)</option>
                    <option value="Requires Mortgage Approval">Needs Bank Loan Approval</option>
                  </select>
                </div>

              </div>

              {/* Qualification Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => handleRunQualification(true)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  Evaluate Preferences & Qualify
                </button>

                <button
                  onClick={handleRunFallbackQualification}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 text-xs font-semibold border border-purple-500/40 flex items-center justify-center gap-2 transition-all"
                >
                  <History className="w-4 h-4 text-purple-400" />
                  Qualify via Past Search Fallback
                </button>
              </div>

            </div>
          )}

          {/* Step 2: RESULTS - Structured Lead Summary & Next Action Decision */}
          {qualificationResult && (
            <div className="space-y-6">
              
              {/* Header Status Banner */}
              <div className={`p-5 rounded-2xl border ${
                qualificationResult.leadScore >= 80 
                  ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
                  : qualificationResult.leadScore >= 60 
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                  : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">
                      Lead Qualification Outcome
                    </span>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                      {qualificationResult.category}
                    </h3>
                    {qualificationResult.isFallbackUsed && (
                      <p className="text-xs text-purple-300 flex items-center gap-1 font-medium pt-0.5">
                        <History className="w-3.5 h-3.5" /> Inferred from User Past Search Vectors
                      </p>
                    )}
                  </div>

                  {/* Score Dial */}
                  <div className="flex items-center gap-3 bg-slate-950/60 px-4 py-3 rounded-2xl border border-slate-800">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-semibold uppercase">Lead Score</p>
                      <p className="text-2xl font-black text-white">{qualificationResult.leadScore}<span className="text-xs text-slate-400">/100</span></p>
                    </div>
                    <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                      qualificationResult.leadScore >= 80 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'
                    }`}>
                      {qualificationResult.leadScore >= 80 ? 'A+' : 'B'}
                    </div>
                  </div>
                </div>
              </div>

              {/* NEXT-ACTION DECISION BANNER */}
              <div className="glass-card p-5 rounded-2xl border-l-4 border-l-cyan-400 space-y-3 bg-slate-900/90">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> AI Next-Action Decision Directive
                </div>
                <div className="text-base font-black text-white bg-slate-950/80 p-3 rounded-xl border border-slate-800 tracking-tight text-cyan-200">
                  ⚡ {qualificationResult.nextActionDecision}
                </div>
              </div>

              {/* STRUCTURED LEAD SUMMARY BREAKDOWN */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Budget Fit</span>
                  <p className="text-lg font-bold text-white">{qualificationResult.structuredSummary.budgetMatchPercent}% Match</p>
                  <p className="text-[11px] text-cyan-400 font-mono font-semibold">
                    ~{formatINR(qualificationResult.structuredSummary.inferredBudget)}
                  </p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Timeline Urgency</span>
                  <p className="text-lg font-bold text-white">{qualificationResult.structuredSummary.urgencyScore}/100</p>
                  <p className="text-[11px] text-slate-400 truncate">{qualificationResult.structuredSummary.inferredTimeline}</p>
                </div>

                <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase">Financing Status</span>
                  <p className="text-sm font-bold text-cyan-400 mt-1">{qualificationResult.structuredSummary.financingStatus}</p>
                </div>
              </div>

              {/* TRANSPARENT REASONING LOGS */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Transparent AI Decision Reasoning
                </h4>
                <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 space-y-2">
                  {qualificationResult.reasoning.map((note, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                <button
                  onClick={() => setQualificationResult(null)}
                  className="text-xs text-slate-400 hover:text-white font-medium underline underline-offset-4"
                >
                  ← Re-evaluate / Edit Parameters
                </button>

                <button
                  onClick={handleSaveLead}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {savedLeadMessage ? '✓ Lead Saved to Seller Pipeline!' : 'Save Qualified Lead'}
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
