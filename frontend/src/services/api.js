// TermsLens API Client with Fast Client-Side Engine and Multi-Proxy Web Fetcher

import { analyzeTextClientSide } from './analyzer';

export async function analyzePolicy({ text, url, presetId }) {
  // 1. Preset handling
  if (presetId) {
    const preset = localPresets.find(p => p.id === presetId);
    if (preset) {
      return analyzeTextClientSide(preset.content);
    }
  }

  // 2. Direct text paste handling (Instant sub-5ms)
  if (text && text.trim()) {
    return analyzeTextClientSide(text);
  }

  // 3. Web URL fetching with robust CORS proxies
  if (url && url.trim()) {
    const targetUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;

    // Priority 1: Jina Reader (High-speed, CORS-enabled clean web scraper)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);
      const res = await fetch(`https://r.jina.ai/${targetUrl}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (res.ok) {
        const rawText = await res.text();
        if (rawText && rawText.length > 50) {
          // Allow up to 150,000 characters to cover full 50+ page terms without truncation
          const bounded = rawText.length > 150000 ? rawText.substring(0, 150000) : rawText;
          return analyzeTextClientSide(bounded);
        }
      }
    } catch (err) {
      console.warn("Jina Reader fetch failed, trying proxy 2:", err);
    }

    // Priority 2: AllOrigins proxy
    try {
      const controller2 = new AbortController();
      const timeoutId2 = setTimeout(() => controller2.abort(), 8000);
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`, {
        signal: controller2.signal
      });
      clearTimeout(timeoutId2);
      if (res.ok) {
        const data = await res.json();
        if (data.contents) {
          const clean = data.contents.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ');
          if (clean.length > 50) {
            const bounded = clean.length > 150000 ? clean.substring(0, 150000) : clean;
            return analyzeTextClientSide(bounded);
          }
        }
      }
    } catch (err2) {
      console.warn("Allorigins fetch failed:", err2);
    }

    throw new Error("Unable to fetch this URL directly (it may block external readers or require a login). Please copy and paste its text into 'Direct Paste'!");
  }

  throw new Error("Please enter terms text or paste a valid URL to scan.");
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
