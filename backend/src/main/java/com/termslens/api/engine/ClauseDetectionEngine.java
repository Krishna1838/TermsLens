package com.termslens.api.engine;

import com.termslens.api.model.OptOutTemplate;
import com.termslens.api.model.RedFlagClause;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class ClauseDetectionEngine {

    public static class RuleDefinition {
        public final String id;
        public final String title;
        public final String category; // WALLET, PRIVACY, RIGHTS
        public final String severity; // CRITICAL, HIGH, MODERATE
        public final String darkPatternTag;
        public final Pattern pattern;
        public final String plainEnglish;
        public final String recommendation;
        public final int penalty;
        public final String optOutTarget;

        public RuleDefinition(String id, String title, String category, String severity,
                              String darkPatternTag, String regex, String plainEnglish,
                              String recommendation, int penalty, String optOutTarget) {
            this.id = id;
            this.title = title;
            this.category = category;
            this.severity = severity;
            this.darkPatternTag = darkPatternTag;
            this.pattern = Pattern.compile(regex, Pattern.CASE_INSENSITIVE);
            this.plainEnglish = plainEnglish;
            this.recommendation = recommendation;
            this.penalty = penalty;
            this.optOutTarget = optOutTarget;
        }
    }

    private final List<RuleDefinition> rules = new ArrayList<>();

    public ClauseDetectionEngine() {
        initializeRules();
    }

    private void initializeRules() {
        // --- 1. WALLET TRAPS (FINANCIAL) ---

        // Roach Motel: Cancellation hurdles
        rules.add(new RuleDefinition(
                "W1_ROACH_MOTEL",
                "Obstacle-Course Cancellation",
                "WALLET",
                "CRITICAL",
                "🪤 Roach Motel",
                "(cancel(?:lation)?|terminat(?:e|ion)).{0,80}(certified (?:postal )?mail|written (?:postal )?notice|physical letter|call(?:ing)? (?:our )?(?:phone|agent|support number))",
                "Subscribing takes 1 click, but cancelling requires physical postal letters, phone calls during business hours, or complex friction.",
                "Use a virtual card (or privacy card) with a strict $1 limit so they cannot rebill your actual bank.",
                25,
                null
        ));

        // Sneak into Basket: Sneaky Auto-renewal & Promo price hike
        rules.add(new RuleDefinition(
                "W2_SNEAKY_AUTORENEW",
                "Undisclosed or Surprise Auto-Renewal",
                "WALLET",
                "CRITICAL",
                "🛒 Sneak into Basket",
                "(auto(?:matically)?-?renew|recurring (?:fee|charge|billing)|charg(?:e|ing) your (?:credit|debit) card).{0,90}(without (?:further )?(?:prior )?notice|standard rate|promotional period expires|sole discretion)",
                "Once the trial or promo ends, they secretly charge full recurring rates to your card without sending a reminder email.",
                "Immediately turn off auto-renew in account settings right after starting a free trial.",
                20,
                null
        ));

        // Silent Price Escalation
        rules.add(new RuleDefinition(
                "W3_SILENT_PRICE_HIKE",
                "Unilateral Price Escalation",
                "WALLET",
                "HIGH",
                "💸 Drip Pricing",
                "(reserve(?:s)? the right to (?:increase|change|modify|alter) (?:fees|prices?|rates?|pricing)).{0,80}(at (?:our|its) sole discretion|without (?:prior )?notice|upon posting)",
                "They can double or triple your subscription price at any moment without emailing you first.",
                "Review bank and credit card statements every month to catch unannounced price changes.",
                18,
                null
        ));

        // Non-Refundable Trap
        rules.add(new RuleDefinition(
                "W4_NO_REFUNDS",
                "Strict Non-Refundable Policy",
                "WALLET",
                "MODERATE",
                "🔒 Sunk Cost Trap",
                "(?:payments?|fees?|charges?|all sales).{0,60}(?:strictly non-refundable|not eligible for (?:any )?refund|no refunds (?:or credits )?shall be provided|all sales are final)",
                "Even if the service goes down or you cancel 5 minutes after a renewal charge, they will never return your money.",
                "Pay only on a monthly tier rather than prepaying annual contracts until trust is proven.",
                12,
                null
        ));

        // Irrevocable Bank ACH / Preauthorized Debit
        rules.add(new RuleDefinition(
                "W5_AUTO_DEBIT_ACH",
                "Irrevocable Preauthorized Bank ACH Debits",
                "WALLET",
                "CRITICAL",
                "💳 Auto-Grasp Debit",
                "(?:authoriz(?:e|es|ing)|consent to).{0,60}(?:automatic|recurring|continuous|initiate).{0,60}(?:ach withdrawals?|electronic debit|debit charges?|bank withdrawals?).{0,60}(?:bank account|payday)",
                "You give the company permission to automatically pull money straight from your personal bank account or payday deposit without needing authorization for each debit.",
                "Never provide direct bank ACH or routing numbers to predatory lenders; use credit cards with fraud protection.",
                25,
                null
        ));

        // Compounding Daily Fines & Penalty Fees
        rules.add(new RuleDefinition(
                "W6_COMPOUNDING_FEES",
                "Compounding Daily Fines & Penalty Fees",
                "WALLET",
                "CRITICAL",
                "📈 Escalating Penalty",
                "(?:fee|penalty|charge).{0,80}(?:compounding daily|per failed attempt|re-presentation fee|daily interest|insufficient funds fee|accumulat(?:e|ing) daily)",
                "If a payment bounces, they hit you with compounding daily fines and continuous penalty fees that rapidly snowball into massive debt.",
                "Close the linked account or notify your bank to place a stop-payment order immediately.",
                20,
                null
        ));

        // --- 2. PRIVACY LEAKS (DATA & TRACKING) ---

        // Data Brokerage: Selling / licensing user data
        rules.add(new RuleDefinition(
                "P1_DATA_BROKERAGE",
                "Third-Party Data Brokerage",
                "PRIVACY",
                "CRITICAL",
                "👁️ Data Brokerage",
                "(sell|license|transfer|share|monetize).{0,60}(personal (?:data|information)|contacts?|biometrics?|telemetry|user data).{0,60}(third-?part(?:y|ies)|data brokers?|marketing (?:partners|affiliates))",
                "Your private phone numbers, device history, and contacts are packaged and sold to commercial data brokers and advertisers.",
                "Submit a formal Do-Not-Sell request or use temporary alias email addresses.",
                25,
                "Third-Party Data Sharing & Sale"
        ));

        // Device Snooping: Excessive permissions
        rules.add(new RuleDefinition(
                "P2_DEVICE_SNOOPING",
                "Excessive Device Permissions Snooping",
                "PRIVACY",
                "HIGH",
                "🕵️ Device Snooping",
                "(access|collect|read|scan).{0,50}(contacts? (?:list)?|sms (?:history|messages)|gallery|photo library|precise (?:geo)?location|camera|microphone)",
                "The service requests background access to your personal photos, contact lists, or text messages that have nothing to do with core app functionality.",
                "Block contact and gallery access in your mobile operating system settings.",
                18,
                null
        ));

        // AI Training on User Content
        rules.add(new RuleDefinition(
                "P3_AI_TRAINING",
                "Unconsented AI Model Training",
                "PRIVACY",
                "HIGH",
                "🤖 AI Harvesting",
                "(train(?:ing)?|improv(?:e|ing)).{0,60}(artificial intelligence|machine learning|models?|algorithms?).{0,60}(user (?:content|submissions|uploads|data|messages|images|voice))",
                "Your private uploaded files, messages, drawings, or voice notes are ingested into corporate AI models without royalties or specific opt-in.",
                "Opt out of machine learning training in your account privacy settings.",
                15,
                "Machine Learning / AI Training on User Data"
        ));

        // Perpetual Content License
        rules.add(new RuleDefinition(
                "P4_PERPETUAL_LICENSE",
                "Perpetual Worldwide Content Takeover",
                "PRIVACY",
                "CRITICAL",
                "📝 Rights Grasp",
                "(irrevocable|perpetual).{0,50}(worldwide|royalty-free|transferable).{0,50}(license to (?:reproduce|use|modify|distribute|monetize))",
                "The company claims perpetual commercial ownership over content you upload, even after you delete your account.",
                "Avoid uploading copyrighted material, personal identity documents, or proprietary intellectual property.",
                20,
                null
        ));

        // --- 3. RIGHTS WAIVERS (LEGAL & GOVERNANCE) ---

        // Legal Disarmament: Mandatory Binding Arbitration
        rules.add(new RuleDefinition(
                "R1_ARBITRATION",
                "Mandatory Binding Arbitration",
                "RIGHTS",
                "CRITICAL",
                "⚖️ Legal Disarmament",
                "(?:binding|individual|mandatory) arbitration|(?:disputes?.{0,80}resolved.{0,80}arbitration|resolved.{0,80}disputes?.{0,80}arbitration)|arbitration (?:provision|agreement|clause)",
                "You surrender your constitutional right to take this company to a real court or judge if they scam you or lose your money.",
                "Exercise your statutory 30-day arbitration opt-out right by sending an email notice.",
                25,
                "Mandatory Binding Arbitration Provision"
        ));

        // Class Action Lawsuit Ban
        rules.add(new RuleDefinition(
                "R2_CLASS_ACTION_BAN",
                "Class Action Lawsuit Waiver",
                "RIGHTS",
                "CRITICAL",
                "🛡️ Immunity Shield",
                "waiv(?:e|ing|ed|er)?.{0,80}(?:class|collective|representative)[- ](?:action|lawsuit|proceeding)|class[- ]action waiver|no right to participate in a (?:class|collective)[- ]action",
                "If this company damages thousands of users simultaneously, you cannot join together in a group lawsuit—each user must fight alone.",
                "Opt out of the dispute agreement within 30 days of registration.",
                22,
                "Class Action Waiver Clause"
        ));

        // Court & Jury Trial Waiver
        rules.add(new RuleDefinition(
                "R3_JURY_TRIAL_WAIVER",
                "Court & Jury Trial Waiver",
                "RIGHTS",
                "CRITICAL",
                "🚫 Trial Waiver",
                "waiv(?:e|ing|ed|er)?.{0,80}(?:right to )?(?:participate in a )?(?:jury|court) trial|surrender.{0,60}(?:right to )?(?:a )?(?:jury|court) trial",
                "You permanently surrender your constitutional right to a public trial before an impartial jury of your peers.",
                "Send the arbitration and dispute opt-out notice to preserve civil court access.",
                20,
                "Dispute Resolution & Binding Arbitration"
        ));

        // Remote or Biased Forum Selection
        rules.add(new RuleDefinition(
                "R4_BIASED_VENUE",
                "Remote or Biased Jurisdiction of Choice",
                "RIGHTS",
                "HIGH",
                "📍 Biased Venue",
                "(?:jurisdiction|venue).{0,50}(?:of (?:our|its) choosing|sole discretion|remote)",
                "The company forces you to travel to a distant, company-friendly state or chosen venue to dispute any claim.",
                "Insist on consumer claims in your local municipal small claims court.",
                15,
                null
        ));

        // Unilateral Contract Modification
        rules.add(new RuleDefinition(
                "R5_UNILATERAL_CHANGE",
                "Unilateral Terms Modification",
                "RIGHTS",
                "HIGH",
                "📄 Silent Rewrite",
                "(?:modify|amend|update|change) (?:these )?(?:terms|agreement).{0,80}(?:at (?:any time|our sole discretion)|without (?:prior )?notice|upon posting).{0,80}(?:continued use constitutes acceptance|acceptance)",
                "They can quietly rewrite their rules or take away your benefits without notifying you; simply visiting the site counts as agreeing.",
                "Monitor terms revisions using web archive trackers or review clause change logs.",
                15,
                null
        ));

        // Total Liability Disclaimer ($50 Cap)
        rules.add(new RuleDefinition(
                "R6_TOTAL_DISCLAIMER",
                "Total Liability Disavowal",
                "RIGHTS",
                "HIGH",
                "🛑 Liability Evasion",
                "(?:maximum|total|aggregate) liability.{0,80}(?:shall not exceed.{0,40}(?:[$]\\s*\\d+|amount paid|one hundred dollars)|in no event shall (?:we|company) be liable for any damages)",
                "If the company's negligence or data breach costs you thousands of dollars, their liability is contractually capped at $50.",
                "Never store critical unbacked assets or primary financial data with this vendor.",
                15,
                null
        ));
    }

    public List<RedFlagClause> detectFlags(String text) {
        if (text == null || text.isBlank()) {
            return Collections.emptyList();
        }

        List<RedFlagClause> detected = new ArrayList<>();
        List<String> sentences = splitIntoSentences(text);

        for (RuleDefinition rule : rules) {
            for (String sentence : sentences) {
                Matcher matcher = rule.pattern.matcher(sentence);
                if (matcher.find()) {
                    String matchedQuote = extractRelevantQuote(sentence, matcher);
                    detected.add(RedFlagClause.builder()
                            .id(rule.id)
                            .title(rule.title)
                            .category(rule.category)
                            .severity(rule.severity)
                            .darkPatternTag(rule.darkPatternTag)
                            .originalQuote(matchedQuote)
                            .plainEnglish(rule.plainEnglish)
                            .recommendation(rule.recommendation)
                            .penalty(rule.penalty)
                            .build());
                    break; // Flag once per rule per document
                }
            }
        }

        return detected;
    }

    public List<OptOutTemplate> generateOptOutTemplates(List<RedFlagClause> flags) {
        List<OptOutTemplate> templates = new ArrayList<>();
        Set<String> added = new HashSet<>();

        for (RedFlagClause flag : flags) {
            for (RuleDefinition rule : rules) {
                if (rule.id.equals(flag.getId()) && rule.optOutTarget != null && !added.contains(rule.optOutTarget)) {
                    added.add(rule.optOutTarget);
                    templates.add(createTemplate(rule.optOutTarget));
                }
            }
        }

        return templates;
    }

    private OptOutTemplate createTemplate(String target) {
        if (target.contains("Arbitration")) {
            return OptOutTemplate.builder()
                    .id("OPTOUT_ARBITRATION")
                    .title("Notice of Mandatory Arbitration Opt-Out")
                    .target("Dispute Resolution & Binding Arbitration")
                    .subject("FORMAL NOTICE: Opt-Out from Mandatory Binding Arbitration - [Your Account Email]")
                    .body("Dear Legal Compliance Department,\n\n" +
                            "Pursuant to the provisions of your Terms of Service and applicable consumer protection statutes, " +
                            "I hereby provide formal written notice of my election to OPT OUT of the mandatory binding arbitration " +
                            "and class-action waiver provisions with respect to my account.\n\n" +
                            "Account Identifier / Email: [Insert Your Email Here]\n" +
                            "Account Holder Name: [Insert Your Full Name Here]\n" +
                            "Date of Account Creation: [Insert Date]\n\n" +
                            "Please confirm in writing receipt and compliance with this notice.\n\n" +
                            "Sincerely,\n[Your Name]\n[Your Phone]")
                    .instructions("Email this template to the company's designated legal or support address within 30 days of registration.")
                    .build();
        } else {
            return OptOutTemplate.builder()
                    .id("OPTOUT_DATA_SALE")
                    .title("Notice of Third-Party Data Sale Opt-Out")
                    .target("Data Brokerage & Telemetry Sharing")
                    .subject("EXERCISE OF PRIVACY RIGHTS: Do Not Sell or Share My Personal Information")
                    .body("Dear Privacy & Compliance Team,\n\n" +
                            "Pursuant to applicable data protection regulations (including CCPA / GDPR provisions where applicable), " +
                            "I hereby formally request that you cease selling, licensing, or sharing my personal data, device telemetry, " +
                            "or contact records with any third-party commercial brokers or advertising affiliates.\n\n" +
                            "Account Email: [Insert Your Email Here]\n" +
                            "Device ID / User ID (if known): [Optional]\n\n" +
                            "Please confirm that my preference has been permanently registered in your compliance management systems.\n\n" +
                            "Sincerely,\n[Your Name]")
                    .instructions("Send to privacy@company.com or submit via the company's data privacy request portal.")
                    .build();
        }
    }

    private List<String> splitIntoSentences(String text) {
        List<String> list = new ArrayList<>();
        // Split on period, newline, semicolon followed by whitespace or quote
        String[] raw = text.split("(?<=[.?!;\\n])\\s+");
        for (String s : raw) {
            String trimmed = s.trim();
            if (!trimmed.isEmpty()) {
                list.add(trimmed);
            }
        }
        return list;
    }

    private String extractRelevantQuote(String sentence, Matcher matcher) {
        String clean = sentence.trim();
        if (clean.length() > 220) {
            int start = Math.max(0, matcher.start() - 30);
            int end = Math.min(clean.length(), matcher.end() + 70);
            return (start > 0 ? "... " : "") + clean.substring(start, end) + (end < clean.length() ? " ..." : "");
        }
        return clean;
    }
}
