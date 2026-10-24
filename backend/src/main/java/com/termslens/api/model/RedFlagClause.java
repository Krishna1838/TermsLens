package com.termslens.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RedFlagClause {
    private String id;
    private String title;
    private String category; // WALLET, PRIVACY, RIGHTS
    private String severity; // CRITICAL, HIGH, MODERATE, LOW
    private String darkPatternTag;
    private String originalQuote;
    private String plainEnglish;
    private String recommendation;
    private int penalty;
}
