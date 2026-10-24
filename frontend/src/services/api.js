// TermsLens API Client with Client-Side Fallback Engine

import { analyzeTextClientSide } from './analyzer';

export async function analyzePolicy({ text, url, presetId }) {
  // If presetId is given, resolve text from presets
  if (presetId) {
    const preset = localPresets.find(p => p.id === presetId);
    if (preset) {
      return analyzeTextClientSide(preset.content);
    }
  }

  // If text is provided, analyze directly client-side in sub-5ms!
  if (text && text.trim()) {
    return analyzeTextClientSide(text);
  }

  // If URL is provided, fetch via CORS-friendly text extractor or fallback
  if (url && url.trim()) {
    try {
      const targetUrl = url.startsWith('http') ? url : `https://${url}`;
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();
      if (data.contents) {
        // Strip HTML tags cleanly
        const clean = data.contents.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
        return analyzeTextClientSide(clean);
      }
    } catch (e) {
      console.warn("URL fetch failed, falling back to local analysis:", e);
    }
    throw new Error("Unable to fetch URL directly due to website CORS restrictions. Please copy & paste the clauses into Direct Paste.");
  }

  throw new Error("Please enter text or select a 1-click sample to scan.");
}

export async function fetchPresets() {
  return localPresets;
}

export const localPresets = [
  {
    id: 'streaming',
    title: '🎬 Streaming Free Trial',
    category: 'Wallet & Rights Traps',
    expectedGrade: 'F',
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
