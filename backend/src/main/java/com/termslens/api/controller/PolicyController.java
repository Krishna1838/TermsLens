package com.termslens.api.controller;

import com.termslens.api.engine.ClauseDetectionEngine;
import com.termslens.api.engine.PresetService;
import com.termslens.api.engine.ScoringEngine;
import com.termslens.api.engine.UrlScraper;
import com.termslens.api.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PolicyController {

    private final ClauseDetectionEngine clauseDetectionEngine;
    private final ScoringEngine scoringEngine;
    private final PresetService presetService;
    private final UrlScraper urlScraper;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeTerms(@RequestBody AnalysisRequest request) {
        String contentToAnalyze = "";

        try {
            if (request.getPresetId() != null && !request.getPresetId().isBlank()) {
                var preset = presetService.getPresetById(request.getPresetId());
                if (preset.isPresent()) {
                    contentToAnalyze = preset.get().getContent();
                }
            } else if (request.getUrl() != null && !request.getUrl().isBlank()) {
                contentToAnalyze = urlScraper.scrapePolicyText(request.getUrl());
            } else {
                contentToAnalyze = request.getText();
            }

            if (contentToAnalyze == null || contentToAnalyze.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "Please provide terms text, a valid URL, or select a preset sample."
                ));
            }

            // Run sub-50ms heuristic analysis
            List<RedFlagClause> detectedFlags = clauseDetectionEngine.detectFlags(contentToAnalyze);
            List<OptOutTemplate> optOutTemplates = clauseDetectionEngine.generateOptOutTemplates(detectedFlags);
            AnalysisResponse auditResult = scoringEngine.computeAudit(contentToAnalyze, detectedFlags, optOutTemplates);

            return ResponseEntity.ok(auditResult);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "Failed to analyze policy: " + e.getMessage()
            ));
        }
    }

    @GetMapping("/presets")
    public ResponseEntity<List<PresetSample>> getPresets() {
        return ResponseEntity.ok(presetService.getAllPresets());
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        return ResponseEntity.ok(Map.of(
                "status", "UP",
                "service", "TermsLens Heuristic Engine",
                "version", "1.0.0",
                "timestamp", Instant.now().toString(),
                "engineLatency", "<50ms"
        ));
    }
}
