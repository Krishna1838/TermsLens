package com.termslens.api;

import com.termslens.api.engine.ClauseDetectionEngine;
import com.termslens.api.engine.PresetService;
import com.termslens.api.engine.ScoringEngine;
import com.termslens.api.model.AnalysisResponse;
import com.termslens.api.model.RedFlagClause;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class TermsLensApplicationTests {

    @Autowired
    private ClauseDetectionEngine clauseDetectionEngine;

    @Autowired
    private ScoringEngine scoringEngine;

    @Autowired
    private PresetService presetService;

    @Test
    void contextLoads() {
        assertNotNull(clauseDetectionEngine);
        assertNotNull(scoringEngine);
        assertNotNull(presetService);
    }

    @Test
    void testStreamingSampleDetection() {
        var preset = presetService.getPresetById("streaming").orElseThrow();
        List<RedFlagClause> flags = clauseDetectionEngine.detectFlags(preset.getContent());

        // Should flag auto-renew, roach motel cancellation, and mandatory arbitration
        assertFalse(flags.isEmpty());
        assertTrue(flags.stream().anyMatch(f -> "WALLET".equals(f.getCategory())));
        assertTrue(flags.stream().anyMatch(f -> "RIGHTS".equals(f.getCategory())));

        AnalysisResponse audit = scoringEngine.computeAudit(preset.getContent(), flags, clauseDetectionEngine.generateOptOutTemplates(flags));
        assertTrue(audit.getScore() < 60, "Streaming trap policy should score poorly");
        assertTrue(List.of("D", "F").contains(audit.getGrade()));
        assertFalse(audit.getOptOutTemplates().isEmpty(), "Should generate arbitration opt-out email template");
    }

    @Test
    void testCleanSampleScoresGradeA() {
        var preset = presetService.getPresetById("clean").orElseThrow();
        List<RedFlagClause> flags = clauseDetectionEngine.detectFlags(preset.getContent());

        // Clean benchmark policy should have zero flags
        assertTrue(flags.isEmpty(), "Clean benchmark should trigger 0 red flags");

        AnalysisResponse audit = scoringEngine.computeAudit(preset.getContent(), flags, List.of());
        assertEquals("A", audit.getGrade());
        assertEquals(100, audit.getScore());
        assertEquals("SAFE", audit.getRiskLevel());
    }
}
