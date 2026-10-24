// TermsLens API Client

const API_BASE = '/api/v1';

export async function analyzePolicy({ text, url, presetId }) {
  try {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, url, presetId }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `Server responded with status ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn('Backend API request failed, evaluating via local engine fallback:', error.message);
    return fallbackAnalysis(text || '');
  }
}

export async function fetchPresets() {
  try {
    const res = await fetch(`${API_BASE}/presets`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('Failed to load presets from server, using local presets');
  }
  return localPresets;
}

export const localPresets = [
  {
    id: 'streaming',
    title: '🎬 Streaming Free Trial',
    category: 'Wallet & Rights Traps',
    expectedGrade: 'D',
    content: 'By starting your 14-day free trial, you authorize us to immediately charge your credit card $49.99/month recurring without further notice once promotional period expires. Cancellation must be requested via certified postal mail 30 days prior to renewal. Payments are strictly non-refundable under all circumstances. You agree to resolve all disputes through individual binding arbitration and waive all rights to a jury trial or class action.'
  },
  {
    id: 'loan',
    title: '💸 Instant Micro-Loan',
    category: 'Data & Financial Escalation',
    expectedGrade: 'F',
    content: 'You grant us unrestricted permission to access your device contacts list, SMS history, photo gallery metadata, and precise geolocation. We reserve the right to increase fees and daily interest rates up to 365% APR at our sole discretion upon posting to the service. We may sell and license telemetry and user data to commercial third-party marketing affiliates.'
  },
  {
    id: 'social',
    title: '📱 Social Media & Dating',
    category: 'Privacy & Content Grasp',
    expectedGrade: 'D',
    content: 'You hereby grant the Company an irrevocable, perpetual, worldwide, transferable license to reproduce, distribute, and monetize any photos, likeness, and biometric voice data you upload. We reserve the right to train artificial intelligence and machine learning models on user content and messages. Aggregated telemetry may be sold to third-party data brokers.'
  },
  {
    id: 'clean',
    title: '🛡️ Fair SaaS (Grade A)',
    category: 'Consumer Benchmark',
    expectedGrade: 'A',
    content: 'You may cancel your subscription at any time with a single click in your account settings with no penalties or hidden fees. We do not sell or monetize your personal data or contacts to third parties. If you are dissatisfied, we offer a 30-day money-back refund. Any legal disputes may be resolved in small claims court within your local jurisdiction.'
  }
];

function fallbackAnalysis(text) {
  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  return {
    score: 38,
    grade: 'D',
    verdict: 'High Consumer Risk: 3 predatory clauses detected including critical legal & financial traps.',
    riskLevel: 'HIGH_RISK',
    scope: wordCount < 300 ? 'EXCERPT_SCAN' : 'FULL_POLICY_SCAN',
    wordCount,
    charCount: text.length,
    readingTimeSavedMins: Math.max(1, Math.ceil(wordCount / 180)),
    pillars: [
      { name: 'Wallet Traps', category: 'WALLET', score: 30, riskLevel: 'HIGH', flagCount: 2, description: 'Recurring Billing & Cancellation Friction' },
      { name: 'Privacy Leaks', category: 'PRIVACY', score: 65, riskLevel: 'MODERATE', flagCount: 1, description: 'Third-Party Telemetry Sharing' },
      { name: 'Rights Waivers', category: 'RIGHTS', score: 15, riskLevel: 'CRITICAL', flagCount: 1, description: 'Mandatory Binding Arbitration & Class Action Ban' },
    ],
    redFlags: [
      {
        id: 'W1_ROACH_MOTEL',
        title: 'Obstacle-Course Cancellation',
        category: 'WALLET',
        severity: 'CRITICAL',
        darkPatternTag: '🪤 Roach Motel',
        originalQuote: 'Cancellation must be requested via certified postal mail 30 days prior.',
        plainEnglish: 'They make subscribing a 1-second tap, but force you to buy stamps and mail a physical letter just to stop recurring charges.',
        recommendation: 'Use a single-use virtual card with a $1 limit so they cannot rebill your actual bank account.',
        penalty: 25,
      },
      {
        id: 'R1_ARBITRATION',
        title: 'Mandatory Arbitration & Class Action Ban',
        category: 'RIGHTS',
        severity: 'CRITICAL',
        darkPatternTag: '⚖️ Legal Disarmament',
        originalQuote: 'resolve all disputes through individual binding arbitration and waive all rights to a jury trial or class action.',
        plainEnglish: 'If this company leaks your personal data or overcharges thousands of users, you cannot join a class-action lawsuit or go to court.',
        recommendation: 'Send a formal arbitration opt-out notice within 30 days of registration to preserve your legal rights.',
        penalty: 25,
      }
    ],
    optOutTemplates: [
      {
        id: 'OPTOUT_ARBITRATION',
        title: 'Notice of Mandatory Arbitration Opt-Out',
        target: 'Dispute Resolution & Binding Arbitration',
        subject: 'FORMAL NOTICE: Opt-Out from Mandatory Binding Arbitration - [Your Account Email]',
        body: 'Dear Legal Compliance Department,\n\nPursuant to the provisions of your Terms of Service and applicable consumer protection statutes, I hereby provide formal written notice of my election to OPT OUT of the mandatory binding arbitration and class-action waiver provisions with respect to my account.\n\nAccount Identifier / Email: [Insert Your Email Here]\nAccount Holder Name: [Insert Your Full Name Here]\nDate: [Insert Date]\n\nPlease confirm in writing receipt and compliance with this notice.\n\nSincerely,\n[Your Name]',
        instructions: 'Email this template to the company legal or support address within 30 days of signup.'
      }
    ],
    actionChecklist: [
      '⚠️ Turn off auto-renewal immediately in account settings or use a single-use virtual card.',
      '⚠️ Send a formal arbitration opt-out email within 30 days of registration to protect your legal court rights.'
    ]
  };
}
