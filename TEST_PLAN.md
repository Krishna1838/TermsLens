# TermsLens — Test Plan & Quality Assurance Specification

---

## 1. Overview & Testing Philosophy

TermsLens is designed as a **mission-critical consumer compliance watchdog**. Because consumers rely on TermsLens to detect legal traps, false negatives (missing predatory clauses) and false positives (penalizing fair terms) directly undermine user trust. 

Our testing strategy follows a **three-tier verification hierarchy**:
1. **Automated Unit Tests (JUnit 5):** Validates deterministic scoring algorithms, rule pattern matchers, and Section 14 opt-out notice generation in Spring Boot.
2. **Edge Case & Boundary Stress Testing:** Validates extreme document sizes (up to 150,000 characters), unescaped currency literals, corporate legal abbreviations, and malformed URLs.
3. **Error State & Resiliency Testing:** Validates network timeouts, CORS scraping fallbacks, and user input validation to guarantee zero unhandled 500 crashes.

---

## 2. Automated Unit Tests (Spring Boot / JUnit 5)

All automated backend unit tests reside in:  
📁 `backend/src/test/java/com/termslens/api/TermsLensApplicationTests.java`

### Test Suite Execution
To execute all backend unit tests:
```bash
cd backend
mvn clean test
```

### Key Automated Test Cases:
| Test Method | Target Component | Assertions & Verification |
| :--- | :--- | :--- |
| `contextLoads()` | Application Context | Verifies proper dependency injection and lifecycle initialization of `ClauseDetectionEngine`, `ScoringEngine`, and `PresetService`. |
| `testStreamingSampleDetection()` | Heuristic Rule Engine | 1. Asserts that auto-renew and obstacle-course cancellation trigger `WALLET` category flags.<br>2. Asserts mandatory arbitration triggers `RIGHTS` category flags.<br>3. Asserts final score < 60 with Grade `D` or `F`.<br>4. Asserts that an actionable arbitration opt-out notice is automatically generated. |
| `testCleanSampleScoresGradeA()` | Scoring Engine & Benchmark | 1. Asserts that fair terms trigger **0 false positive red flags**.<br>2. Asserts overall score is exactly **100/100**.<br>3. Asserts Grade is **`A`** and Risk Level is **`SAFE`**. |

---

## 3. Edge Case Handling Matrix

Legal agreements contain unusual typographical, structural, and grammatical edge cases. The following edge cases are explicitly handled:

| # | Edge Case Scenario | Risk / Failure Mode | Engineering Countermeasure |
| :- | :--- | :--- | :--- |
| **EC-1** | **Large Legal Documents (50+ pages)** | Memory exhaustion or mid-document truncation missing arbitration clauses at the very end of agreements. | Implemented streaming regex scanning with a safe buffer boundary of **150,000 characters (1.5 lakh chars)**. Tested on Zomato (~148,000 chars) and Dream11 (~38,000 chars) without truncation. |
| **EC-2** | **Unescaped Currency Literals (`$50`)** | In Java regex, unescaped `$` denotes end-of-line anchor, causing regex compile failure or syntax error. | Tokenizer explicitly uses character class escaping: `[$]50` or `\\$`. |
| **EC-3** | **Corporate Legal Abbreviations** | Sentence splitters often treat periods in `LLP`, `Inc.`, `Ltd.`, `e.g.`, or `i.e.` as sentence endings, fracturing legal context. | Sentence boundary tokenizer excludes periods followed by common corporate suffixes and Latin legal abbreviations. |
| **EC-4** | **Flexible Legal Grammar & Morphology** | Contracts use varying word forms (`waive`, `waiving`, `waiver`, `waived`). | Pattern matchers employ flexible non-capturing stems: `waiv(?:e|ing|er|ed|es)?`. |
| **EC-5** | **Protocol-less URLs** | Users entering `zomato.com/conditions` without `https://` prefix. | URL scraper automatically detects missing schemes and normalizes input to `https://`. |
| **EC-6** | **Unilateral Venue Selection** | Contracts specifying remote, biased court venues (e.g. *"disputes shall be settled exclusively in courts of Delaware/Dublin"*). | Venue detection rule penalizes unilateral foreign court stipulations that disadvantage remote consumers. |

---

## 4. Error States & Fault Tolerance

TermsLens is engineered to fail gracefully with clear user guidance rather than generic stack traces.

### 1. External URL Scraper Fallback (CORS & Proxy Cascade)
* **Tier 1:** Jina Reader API with a **12-second abort timeout** (`AbortController`).
* **Tier 2 (Fallback):** If Tier 1 times out or encounters network limits, the engine automatically cascades to the **AllOrigins proxy** with an 8-second timeout.
* **Tier 3 (User Guidance):** If a URL is behind Cloudflare bot protections or requires authentication, the UI catches the error and displays an amber alert banner:  
  *`"⚠️ Unable to fetch this URL directly (it may block external readers or require a login). Please copy and paste its text into 'Direct Paste'!"`*

### 2. Empty / Whitespace Input
* Clicking scan on an empty text area or blank URL displays an immediate, friendly inline prompt:  
  *`"Please enter terms text or paste a valid URL to scan."`*

### 3. Clean Agreement State (Zero Flags)
* When scanning a safe agreement, the UI renders a celebratory green seal with positive guidance:  
  *`"🎉 Zero Predatory Traps Found! This agreement appears fair and complies with consumer protection standards."`*

---

## 5. End-to-End Test Matrix & Verification

The following test matrix has been executed against live production:

| ID | Category | Test Target / Input | Expected Behavior | Actual Production Result | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-01** | Preset | `Streaming Free Trial` | Flags sneaky auto-renew, certified mail cancel, mandatory arbitration. Score < 40. | **Score: 0/100 (Grade F)**. All 3 dark patterns flagged with plain-English "The Catch". | ✅ PASS |
| **TC-02** | Preset | `Instant Micro-Loan` | Flags contacts/SMS grasping, 365% APR hikes, telemetry resale. | **Score: 0/100 (Grade F)**. Flags device snooping and financial escalation. | ✅ PASS |
| **TC-03** | Preset | `Social Media & Dating` | Flags perpetual biometric license, AI training rights, data brokerage. | **Score: 55/100 (Grade D)**. Flags AI harvesting & data brokerage. | ✅ PASS |
| **TC-04** | Preset | `Fair SaaS Benchmark` | 1-click cancel, zero data resale, 30-day refunds. | **Score: 100/100 (Grade A)**. Zero false positives. | ✅ PASS |
| **TC-05** | Live URL | `Dream11 Terms` (`https://www.dream11.com/...`) | Scans 38,622 characters via URL reader. Detects binding arbitration clause at char ~29,000. | **Score: 72/100 (Grade C)**. Arbitration clause isolated with opt-out generator. | ✅ PASS |
| **TC-06** | Live URL | `Zomato Terms` (`https://www.zomato.com/conditions`) | Scans 148,420 characters. Detects call recording & contact permission clause. | **Score: 82/100 (Grade B)**. Excessive device snooping flagged with protective checklist. | ✅ PASS |
| **TC-07** | Paste | Direct Paste Zomato Excerpt | Analyzes pasted excerpt in sub-5ms client-side engine. | **Score: 82/100 (Grade B)**. Matches live URL score with identical diff cards. | ✅ PASS |
| **TC-08** | Security | Script Injection in Input | `<script>alert(1)</script>` in text box. | Text safely escaped via React JSX and HTML entities; zero execution. | ✅ PASS |

---

## 6. Conclusion
TermsLens passes all automated unit tests, edge-case boundary verifications, and real-world live URL benchmarks. The system is hardened for production deployment on Render and resilient to unexpected user inputs.
