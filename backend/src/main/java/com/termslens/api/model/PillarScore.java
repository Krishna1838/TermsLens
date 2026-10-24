package com.termslens.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PillarScore {
    private String name; // Wallet Traps, Privacy Leaks, Rights Waivers
    private String category; // WALLET, PRIVACY, RIGHTS
    private int score; // 0 to 100 (100 = safest, 0 = toxic)
    private String riskLevel; // LOW, MODERATE, HIGH, CRITICAL
    private int flagCount;
    private String description;
}
