# TermsLens — Product Write-Up
**Candidate:** Krishna Vardhan Baratam | VComply Assignment

### 1. What problem does your tool solve, and who is the user?
Most people click "I Agree" without reading 30+ pages of legal fine print. Companies use this to hide unfair traps: automatic subscription renewals without reminder emails, selling phone numbers and contacts to advertisers, and mandatory arbitration that stops users from suing in court. 

TermsLens scans legal text in under 50 milliseconds, giving agreements a safety score from 0 to 100 across Wallet, Privacy, and Rights pillars. 

The users are everyday web users signing up for trials, mobile apps, or loans who need plain-English clarity before accepting online agreements. It helps everyday consumers avoid hidden recurring charges and protect their personal data.

### 2. What were the two or three most important product decisions you made, and why?
* **Java Rule Engine over AI APIs:** External AI APIs are slow, cost money, risk rate-limits during evaluation, and leak user data. A custom Java pattern engine runs in under 50 milliseconds with zero downtime and complete privacy.
* **Side-by-Side "The Catch" View:** Instead of a generic dashboard, I paired each legal clause with a plain-English explanation of "The Catch" and practical protective advice.
* **1-Click Opt-Out Email Generator:** Companies often allow a 30-day window to opt out of arbitration. TermsLens generates a ready-to-send email template with one click so users can easily protect their court rights.

### 3. What did you cut from scope, and what would you build next if you had more time?
* **Cut from Scope:** A Chrome browser extension and a database tracking policy changes, prioritizing a fast, reliable core engine and clean web app before the deadline.
* **Build Next:**
  1. A point-of-sale browser extension warning users directly on checkout pages.
  2. A database alerting users when terms are quietly updated.
  3. Multi-language scanning for regional agreements.

### 4. What broke or surprised you during development, and how did you handle it?
First, while writing regex rules for liability limits like "$50", unescaped dollar signs broke Java string compilation. I resolved this using regex character classes like `[$]50`.

Second, special characters in the HTML header caused a Vite production build failure. I cleaned the HTML template and created a build script copying React assets into Spring Boot's static folder, packaging the entire project into a single runnable JAR for easy Render deployment.
