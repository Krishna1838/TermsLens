package com.termslens.api.engine;

import com.termslens.api.model.AnalysisResponse;
import com.termslens.api.model.OptOutTemplate;
import com.termslens.api.model.PillarScore;
import com.termslens.api.model.RedFlagClause;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class ScoringEngine {

    public AnalysisResponse computeAudit(String text, List<RedFlagClause> flags, List<OptOutTemplate> templates) {
        int wordCount = countWords(text);
        int charCount = text != null ? text.length() : 0;
        int timeSavedMins = Math.max(1, (int) Math.ceil(wordCount / 180.0));
        String scope = wordCount < 300 ? "EXCERPT_SCAN" : "FULL_POLICY_SCAN";

        // Calculate total penalties
        int totalPenalty = 0;
        int walletPenalty = 0;
        int privacyPenalty = 0;
        int rightsPenalty = 0;

        int walletFlags = 0;
        int privacyFlags = 0;
        int rightsFlags = 0;

        for (RedFlagClause flag : flags) {
            totalPenalty += flag.getPenalty();
            switch (flag.getCategory()) {
                case "WALLET" -> {
                    walletPenalty += flag.getPenalty();
                    walletFlags++;
                }
                case "PRIVACY" -> {
                    privacyPenalty += flag.getPenalty();
                    privacyFlags++;
                }
                case "RIGHTS" -> {
                    rightsPenalty += flag.getPenalty();
                    rightsFlags++;
                }
            }
        }

        // Cap scores between 0 and 100
        int finalScore = Math.max(0, 100 - totalPenalty);
        int walletScore = Math.max(0, 100 - (walletPenalty * 2));
        int privacyScore = Math.max(0, 100 - (privacyPenalty * 2));
        int rightsScore = Math.max(0, 100 - (rightsPenalty * 2));

        String grade = calculateGrade(finalScore);
        String riskLevel = calculateRiskLevel(finalScore);
        String verdict = buildVerdict(flags, grade);

        // Build 3 Pillars
        List<PillarScore> pillars = new ArrayList<>();
        pillars.add(PillarScore.builder()
                .name("Wallet Traps")
                .category("WALLET")
                .score(walletScore)
                .riskLevel(getPillarRisk(walletScore))
                .flagCount(walletFlags)
                .description("Recurring Billing, Sneak Pricing & Cancellation Friction")
                .build());

        pillars.add(PillarScore.builder()
                .name("Privacy Leaks")
                .category("PRIVACY")
                .score(privacyScore)
                .riskLevel(getPillarRisk(privacyScore))
                .flagCount(privacyFlags)
                .description("Third-Party Data Resale, Telemetry & Device Snooping")
                .build());

        pillars.add(PillarScore.builder()
                .name("Rights Waivers")
                .category("RIGHTS")
                .score(rightsScore)
                .riskLevel(getPillarRisk(rightsScore))
                .flagCount(rightsFlags)
                .description("Mandatory Arbitration, Class-Action Bans & Unilateral Changes")
                .build());

        // Action checklist for the consumer
        List<String> checklist = buildChecklist(flags);

        return AnalysisResponse.builder()
                .score(finalScore)
                .grade(grade)
                .verdict(verdict)
                .riskLevel(riskLevel)
                .scope(scope)
                .wordCount(wordCount)
                .charCount(charCount)
                .readingTimeSavedMins(timeSavedMins)
                .pillars(pillars)
                .redFlags(flags)
                .optOutTemplates(templates)
                .actionChecklist(checklist)
                .build();
    }

    private String calculateGrade(int score) {
        if (score >= 85) return "A";
        if (score >= 70) return "B";
        if (score >= 55) return "C";
        if (score >= 40) return "D";
        return "F";
    }

    private String calculateRiskLevel(int score) {
        if (score >= 85) return "SAFE";
        if (score >= 70) return "MODERATE_RISK";
        if (score >= 45) return "HIGH_RISK";
        return "CRITICAL_RISK";
    }

    private String getPillarRisk(int pillarScore) {
        if (pillarScore >= 80) return "LOW";
        if (pillarScore >= 55) return "MODERATE";
        if (pillarScore >= 35) return "HIGH";
        return "CRITICAL";
    }

    private String buildVerdict(List<RedFlagClause> flags, String grade) {
        if (flags.isEmpty()) {
            return "Fair & Balanced Terms: No predatory consumer traps or dark patterns detected.";
        }
        long criticalCount = flags.stream().filter(f -> "CRITICAL".equals(f.getSeverity())).count();
        if (criticalCount > 0) {
            return "High Consumer Risk: " + flags.size() + " predatory clauses detected including " + criticalCount + " critical legal/financial traps.";
        }
        return "Caution Warranted: " + flags.size() + " questionable clauses identified in billing or data handling.";
    }

    private List<String> buildChecklist(List<RedFlagClause> flags) {
        List<String> list = new ArrayList<>();
        boolean hasArbitration = flags.stream().anyMatch(f -> "RIGHTS".equals(f.getCategory()));
        boolean hasWallet = flags.stream().anyMatch(f -> "WALLET".equals(f.getCategory()));
        boolean hasPrivacy = flags.stream().anyMatch(f -> "PRIVACY".equals(f.getCategory()));

        if (hasWallet) {
            list.add("⚠️ Turn off auto-renewal immediately in account settings or use a single-use virtual card.");
        }
        if (hasArbitration) {
            list.add("⚠️ Send a formal arbitration opt-out email within 30 days of registration to protect your legal court rights.");
        }
        if (hasPrivacy) {
            list.add("⚠️ Revoke contact, photo library, and background telemetry permissions in your OS privacy settings.");
        }
        if (list.isEmpty()) {
            list.add("✅ Agreement meets standard consumer protection guidelines.");
        }
        return list;
    }

    private int countWords(String text) {
        if (text == null || text.isBlank()) return 0;
        return text.trim().split("\\s+").length;
    }
}
