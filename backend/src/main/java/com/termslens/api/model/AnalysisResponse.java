package com.termslens.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalysisResponse {
    private int score; // 0 to 100
    private String grade; // A, B, C, D, F
    private String verdict;
    private String riskLevel; // SAFE, MODERATE_RISK, HIGH_RISK, CRITICAL_RISK
    private String scope; // EXCERPT_SCAN, FULL_POLICY_SCAN
    private int wordCount;
    private int charCount;
    private int readingTimeSavedMins;
    private List<PillarScore> pillars;
    private List<RedFlagClause> redFlags;
    private List<OptOutTemplate> optOutTemplates;
    private List<String> actionChecklist;
}
