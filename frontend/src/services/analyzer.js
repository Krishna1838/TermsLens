// TermsLens Client-Side Heuristic Engine (Sub-5ms Execution, 100% Client Privacy)

const RULES = [
  // 1. WALLET TRAPS
  {
    id: "W1_ROACH_MOTEL",
    title: "Obstacle-Course Cancellation",
    category: "WALLET",
    severity: "CRITICAL",
    darkPatternTag: "🪤 Roach Motel",
    regex: /(?:cancel(?:lation)?|terminat(?:e|ion|ing)).{0,100}(?:certified (?:postal )?mail|written (?:postal )?notice|physical letter|call(?:ing)? (?:our )?(?:phone|agent|support|representative)|in-person)/i,
    plainEnglish: "Subscribing takes 1 click, but cancelling requires physical postal letters, phone calls during business hours, or complex friction.",
    recommendation: "Use a single-use virtual card with a $1 limit so they cannot rebill your actual bank account.",
    penalty: 25,
    optOutTarget: null
  },
  {
    id: "W2_SNEAKY_AUTORENEW",
    title: "Undisclosed or Surprise Auto-Renewal",
    category: "WALLET",
    severity: "CRITICAL",
    darkPatternTag: "🛒 Sneak into Basket",
    regex: /(?:auto(?:matically)?-?renew(?:al)?|recurring (?:fee|charge|billing|subscription)|charg(?:e|ing) your (?:credit|debit) card).{0,90}(?:without (?:further )?(?:prior )?notice|standard rate|promotional period expires|sole discretion)/i,
    plainEnglish: "Once the promo ends, they secretly bill full rates without sending a reminder email.",
    recommendation: "Immediately turn off auto-renew in account settings right after starting a free trial.",
    penalty: 20,
    optOutTarget: null
  },
  {
    id: "W3_SILENT_PRICE_HIKE",
    title: "Unilateral Price Escalation",
    category: "WALLET",
    severity: "HIGH",
    darkPatternTag: "💸 Drip Pricing",
    regex: /(?:reserve(?:s)? the right to (?:increase|change|modify|alter) (?:fees|prices?|rates?|pricing)|escalat(?:e|ing) (?:fees?|rates?)).{0,100}(?:at (?:our|its) sole discretion|without (?:prior )?notice|upon posting)/i,
    plainEnglish: "They can double or triple your subscription price at any moment without emailing you first.",
    recommendation: "Review bank and credit card statements every month to catch unannounced price changes.",
    penalty: 18,
    optOutTarget: null
  },
  {
    id: "W4_NO_REFUNDS",
    title: "Strict Non-Refundable Policy",
    category: "WALLET",
    severity: "MODERATE",
    darkPatternTag: "🔒 Sunk Cost Trap",
    regex: /(?:payments?|fees?|charges?|all sales).{0,60}(?:strictly non-refundable|not eligible for (?:any )?refund|no refunds (?:or credits )?shall be provided|all sales are final)/i,
    plainEnglish: "Even if the service goes down or you cancel 5 minutes after a renewal charge, they will never return your money.",
    recommendation: "Pay only on a monthly tier rather than prepaying annual contracts until trust is proven.",
    penalty: 12,
    optOutTarget: null
  },
  {
    id: "W5_AUTO_DEBIT_ACH",
    title: "Irrevocable Preauthorized Bank ACH Debits",
    category: "WALLET",
    severity: "CRITICAL",
    darkPatternTag: "💳 Auto-Grasp Debit",
    regex: /(?:authoriz(?:e|es|ing)|consent to).{0,60}(?:automatic|recurring|continuous|initiate).{0,60}(?:ach withdrawals?|electronic debit|debit charges?|bank withdrawals?).{0,60}(?:bank account|payday)/i,
    plainEnglish: "You give the company permission to automatically pull money straight from your personal bank account or payday deposit without needing authorization for each debit.",
    recommendation: "Never provide direct bank ACH or routing numbers to predatory lenders; use credit cards with fraud protection.",
    penalty: 25,
    optOutTarget: null
  },
  {
    id: "W6_COMPOUNDING_FEES",
    title: "Compounding Daily Fines & Penalty Fees",
    category: "WALLET",
    severity: "CRITICAL",
    darkPatternTag: "📈 Escalating Penalty",
    regex: /(?:fee|penalty|charge).{0,80}(?:compounding daily|per failed attempt|re-presentation fee|daily interest|insufficient funds fee|accumulat(?:e|ing) daily)/i,
    plainEnglish: "If a payment bounces, they hit you with compounding daily fines and continuous penalty fees that rapidly snowball into massive debt.",
    recommendation: "Close the linked account or notify your bank to place a stop-payment order immediately.",
    penalty: 20,
    optOutTarget: null
  },

  // 2. PRIVACY LEAKS
  {
    id: "P1_DATA_BROKERAGE",
    title: "Third-Party Data Brokerage",
    category: "PRIVACY",
    severity: "CRITICAL",
    darkPatternTag: "👁️ Data Brokerage",
    regex: /(?:sell|license|transfer|share|monetiz(?:e|ing)).{0,80}(?:personal (?:data|information)|contacts?|biometrics?|telemetry|user data).{0,80}(?:third-?part(?:y|ies)|data brokers?|marketing (?:partners|affiliates))/i,
    plainEnglish: "Your private phone numbers, device history, and contacts are packaged and sold to commercial data brokers and advertisers.",
    recommendation: "Submit a formal Do-Not-Sell request or use temporary alias email addresses.",
    penalty: 25,
    optOutTarget: "Third-Party Data Sharing & Sale"
  },
  {
    id: "P2_DEVICE_SNOOPING",
    title: "Excessive Device Permissions Snooping",
    category: "PRIVACY",
    severity: "HIGH",
    darkPatternTag: "🕵️ Device Snooping",
    regex: /(?:access|collect|read|scan|record).{0,60}(?:contacts? (?:list)?|sms (?:history|messages)|gallery|photo (?:library|metadata)|precise (?:geo)?location|camera|microphone)/i,
    plainEnglish: "The service requests background access to your personal photos, contact lists, or text messages that have nothing to do with core app functionality.",
    recommendation: "Block contact and gallery access in your mobile operating system settings.",
    penalty: 18,
    optOutTarget: null
  },
  {
    id: "P3_AI_TRAINING",
    title: "Unconsented AI Model Training",
    category: "PRIVACY",
    severity: "HIGH",
    darkPatternTag: "🤖 AI Harvesting",
    regex: /(?:train(?:ing)?|improv(?:e|ing)|feed(?:ing)?).{0,80}(?:artificial intelligence|machine learning|models?|algorithms?|generative ai).{0,80}(?:user (?:content|submissions|uploads|data|messages|images|voice|code))/i,
    plainEnglish: "Your private uploaded files, messages, drawings, or voice notes are ingested into corporate AI models without royalties or specific opt-in.",
    recommendation: "Opt out of machine learning training in your account privacy settings.",
    penalty: 15,
    optOutTarget: "Machine Learning / AI Training on User Data"
  },
  {
    id: "P4_PERPETUAL_LICENSE",
    title: "Perpetual Worldwide Content Takeover",
    category: "PRIVACY",
    severity: "CRITICAL",
    darkPatternTag: "📝 Rights Grasp",
    regex: /(?:irrevocable|perpetual).{0,60}(?:worldwide|royalty-free|transferable).{0,60}(?:license to (?:reproduce|use|modify|distribute|monetize|sublicense))/i,
    plainEnglish: "The company claims perpetual commercial ownership over content you upload, even after you delete your account.",
    recommendation: "Avoid uploading copyrighted material, personal identity documents, or proprietary intellectual property.",
    penalty: 20,
    optOutTarget: null
  },

  // 3. RIGHTS WAIVERS
  {
    id: "R1_ARBITRATION",
    title: "Mandatory Binding Arbitration",
    category: "RIGHTS",
    severity: "CRITICAL",
    darkPatternTag: "⚖️ Legal Disarmament",
    regex: /(?:binding|individual|mandatory) arbitration|(?:disputes?.{0,80}resolved.{0,80}arbitration|resolved.{0,80}disputes?.{0,80}arbitration)|arbitration (?:provision|agreement|clause)/i,
    plainEnglish: "You surrender your constitutional right to take this company to a real court or judge if they scam you or lose your money.",
    recommendation: "Exercise your statutory 30-day arbitration opt-out right by sending an email notice.",
    penalty: 25,
    optOutTarget: "Dispute Resolution & Binding Arbitration"
  },
  {
    id: "R2_CLASS_ACTION_BAN",
    title: "Class Action Lawsuit Waiver",
    category: "RIGHTS",
    severity: "CRITICAL",
    darkPatternTag: "🛡️ Immunity Shield",
    regex: /waiv(?:e|ing|ed|er)?.{0,80}(?:class|collective|representative)[- ](?:action|lawsuit|proceeding)|class[- ]action waiver|no right to participate in a (?:class|collective)[- ]action/i,
    plainEnglish: "If this company damages thousands of users simultaneously, you cannot join together in a group lawsuit—each user must fight alone.",
    recommendation: "Opt out of the dispute agreement within 30 days of registration.",
    penalty: 22,
    optOutTarget: "Dispute Resolution & Binding Arbitration"
  },
  {
    id: "R3_JURY_TRIAL_WAIVER",
    title: "Court & Jury Trial Waiver",
    category: "RIGHTS",
    severity: "CRITICAL",
    darkPatternTag: "🚫 Trial Waiver",
    regex: /waiv(?:e|ing|ed|er)?.{0,80}(?:right to )?(?:participate in a )?(?:jury|court) trial|surrender.{0,60}(?:right to )?(?:a )?(?:jury|court) trial/i,
    plainEnglish: "You permanently surrender your constitutional right to a public trial before an impartial jury of your peers.",
    recommendation: "Send the arbitration and dispute opt-out notice to preserve civil court access.",
    penalty: 20,
    optOutTarget: "Dispute Resolution & Binding Arbitration"
  },
  {
    id: "R4_BIASED_VENUE",
    title: "Remote or Biased Jurisdiction of Choice",
    category: "RIGHTS",
    severity: "HIGH",
    darkPatternTag: "📍 Biased Venue",
    regex: /(?:jurisdiction|venue).{0,50}(?:of (?:our|its) choosing|sole discretion|remote)/i,
    plainEnglish: "The company forces you to travel to a distant, company-friendly state or chosen venue to dispute any claim.",
    recommendation: "Insist on consumer claims in your local municipal small claims court.",
    penalty: 15,
    optOutTarget: null
  },
  {
    id: "R5_UNILATERAL_CHANGE",
    title: "Unilateral Terms Modification",
    category: "RIGHTS",
    severity: "HIGH",
    darkPatternTag: "📄 Silent Rewrite",
    regex: /(?:modify|amend|update|change) (?:these )?(?:terms|agreement).{0,80}(?:at (?:any time|our sole discretion)|without (?:prior )?notice|upon posting).{0,80}(?:continued use constitutes acceptance|acceptance)/i,
    plainEnglish: "They can quietly rewrite their rules or take away your benefits without notifying you; simply visiting the site counts as agreeing.",
    recommendation: "Monitor terms revisions using web archive trackers or review clause change logs.",
    penalty: 15,
    optOutTarget: null
  },
  {
    id: "R6_TOTAL_DISCLAIMER",
    title: "Total Liability Disavowal",
    category: "RIGHTS",
    severity: "HIGH",
    darkPatternTag: "🛑 Liability Evasion",
    regex: /(?:maximum|total|aggregate) liability.{0,80}(?:shall not exceed.{0,40}(?:[$]\s*\d+|amount paid|one hundred dollars)|in no event shall (?:we|company) be liable for any damages)/i,
    plainEnglish: "If the company's negligence or data breach costs you thousands of dollars, their liability is contractually capped at $50.",
    recommendation: "Never store critical unbacked assets or primary financial data with this vendor.",
    penalty: 15,
    optOutTarget: null
  }
];

export function analyzeTextClientSide(text) {
  if (!text || !text.trim()) {
    throw new Error("Please enter contract text or select a 1-click preset sample.");
  }

  const cleanText = text.trim();
  const wordCount = cleanText.split(/\s+/).length;
  const charCount = cleanText.length;
  const timeSavedMins = Math.max(1, Math.ceil(wordCount / 180));
  const scope = wordCount < 300 ? "EXCERPT_SCAN" : "FULL_POLICY_SCAN";

  // Split into sentences
  const sentences = cleanText.split(/(?<=[.?!;\n])\s+/).filter(s => s.trim().length > 0);

  const detectedFlags = [];
  const addedOptOutTargets = new Set();

  for (const rule of RULES) {
    for (const sentence of sentences) {
      if (rule.regex.test(sentence)) {
        let quote = sentence.trim();
        if (quote.length > 200) {
          quote = quote.substring(0, 195) + "...";
        }

        detectedFlags.push({
          id: rule.id,
          title: rule.title,
          category: rule.category,
          severity: rule.severity,
          darkPatternTag: rule.darkPatternTag,
          originalQuote: quote,
          plainEnglish: rule.plainEnglish,
          recommendation: rule.recommendation,
          penalty: rule.penalty
        });

        if (rule.optOutTarget) {
          addedOptOutTargets.add(rule.optOutTarget);
        }
        break; // Match once per rule
      }
    }
  }

  // Calculate scores
  let totalPenalty = 0;
  let walletPenalty = 0;
  let privacyPenalty = 0;
  let rightsPenalty = 0;

  let walletFlags = 0;
  let privacyFlags = 0;
  let rightsFlags = 0;

  for (const flag of detectedFlags) {
    totalPenalty += flag.penalty;
    if (flag.category === "WALLET") {
      walletPenalty += flag.penalty;
      walletFlags++;
    } else if (flag.category === "PRIVACY") {
      privacyPenalty += flag.penalty;
      privacyFlags++;
    } else if (flag.category === "RIGHTS") {
      rightsPenalty += flag.penalty;
      rightsFlags++;
    }
  }

  const finalScore = Math.max(0, 100 - totalPenalty);
  const walletScore = Math.max(0, 100 - (walletPenalty * 2));
  const privacyScore = Math.max(0, 100 - (privacyPenalty * 2));
  const rightsScore = Math.max(0, 100 - (rightsPenalty * 2));

  const grade = calculateGrade(finalScore);
  const riskLevel = calculateRiskLevel(finalScore);
  const verdict = buildVerdict(detectedFlags);

  const pillars = [
    {
      name: "Wallet Traps",
      category: "WALLET",
      score: walletScore,
      riskLevel: getPillarRisk(walletScore),
      flagCount: walletFlags,
      description: "Recurring Billing, Sneak Pricing & Cancellation Friction"
    },
    {
      name: "Privacy Leaks",
      category: "PRIVACY",
      score: privacyScore,
      riskLevel: getPillarRisk(privacyScore),
      flagCount: privacyFlags,
      description: "Third-Party Data Resale, Telemetry & Device Snooping"
    },
    {
      name: "Rights Waivers",
      category: "RIGHTS",
      score: rightsScore,
      riskLevel: getPillarRisk(rightsScore),
      flagCount: rightsFlags,
      description: "Mandatory Arbitration, Class-Action Bans & Unilateral Changes"
    }
  ];

  const optOutTemplates = [];
  if (addedOptOutTargets.has("Dispute Resolution & Binding Arbitration")) {
    optOutTemplates.push({
      id: "OPTOUT_ARBITRATION",
      title: "Notice of Mandatory Arbitration Opt-Out",
      target: "Dispute Resolution & Binding Arbitration",
      subject: "FORMAL NOTICE: Opt-Out from Mandatory Binding Arbitration - [Your Account Email]",
      body: "Dear Legal Compliance Department,\n\nPursuant to the provisions of your Terms of Service and applicable consumer protection statutes, I hereby provide formal written notice of my election to OPT OUT of the mandatory binding arbitration and class-action waiver provisions with respect to my account.\n\nAccount Identifier / Email: [Insert Your Email Here]\nAccount Holder Name: [Insert Your Full Name Here]\nDate of Account Creation: [Insert Date]\n\nPlease confirm in writing receipt and compliance with this notice.\n\nSincerely,\n[Your Name]\n[Your Phone]",
      instructions: "Email this template to the company's designated legal or support address within 30 days of registration."
    });
  }
  if (addedOptOutTargets.has("Third-Party Data Sharing & Sale") || addedOptOutTargets.has("Machine Learning / AI Training on User Data")) {
    optOutTemplates.push({
      id: "OPTOUT_DATA_SALE",
      title: "Notice of Third-Party Data Sale Opt-Out",
      target: "Data Brokerage & Telemetry Sharing",
      subject: "EXERCISE OF PRIVACY RIGHTS: Do Not Sell or Share My Personal Information",
      body: "Dear Privacy & Compliance Team,\n\nPursuant to applicable data protection regulations, I hereby formally request that you cease selling, licensing, or sharing my personal data, device telemetry, or contact records with any third-party commercial brokers or advertising affiliates.\n\nAccount Email: [Insert Your Email Here]\nDevice ID / User ID (if known): [Optional]\n\nPlease confirm that my preference has been permanently registered in your compliance management systems.\n\nSincerely,\n[Your Name]",
      instructions: "Send to privacy@company.com or submit via the company's data privacy request portal."
    });
  }

  const checklist = [];
  if (walletFlags > 0) checklist.push("⚠️ Turn off auto-renewal immediately in account settings or use a single-use virtual card.");
  if (rightsFlags > 0) checklist.push("⚠️ Send a formal arbitration opt-out email within 30 days of registration to protect your legal court rights.");
  if (privacyFlags > 0) checklist.push("⚠️ Revoke contact, photo library, and background telemetry permissions in your OS privacy settings.");
  if (checklist.length === 0) checklist.push("✅ Agreement meets standard consumer protection guidelines.");

  return {
    score: finalScore,
    grade,
    verdict,
    riskLevel,
    scope,
    wordCount,
    charCount,
    readingTimeSavedMins: timeSavedMins,
    pillars,
    redFlags: detectedFlags,
    optOutTemplates,
    actionChecklist: checklist
  };
}

function calculateGrade(score) {
  if (score >= 85) return "A";
  if (score >= 70) return "B";
  if (score >= 55) return "C";
  if (score >= 40) return "D";
  return "F";
}

function calculateRiskLevel(score) {
  if (score >= 85) return "SAFE";
  if (score >= 70) return "MODERATE_RISK";
  if (score >= 45) return "HIGH_RISK";
  return "CRITICAL_RISK";
}

function getPillarRisk(pillarScore) {
  if (pillarScore >= 80) return "LOW";
  if (pillarScore >= 55) return "MODERATE";
  if (pillarScore >= 35) return "HIGH";
  return "CRITICAL";
}

function buildVerdict(flags) {
  if (flags.length === 0) {
    return "Fair & Balanced Terms: No predatory consumer traps or dark patterns detected.";
  }
  const criticalCount = flags.filter(f => f.severity === "CRITICAL").length;
  if (criticalCount > 0) {
    return `High Consumer Risk: ${flags.length} predatory clauses detected including ${criticalCount} critical legal/financial traps.`;
  }
  return `Caution Warranted: ${flags.length} questionable clauses identified in billing or data handling.`;
}
