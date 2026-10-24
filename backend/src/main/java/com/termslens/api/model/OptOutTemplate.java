package com.termslens.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OptOutTemplate {
    private String id;
    private String title;
    private String target; // e.g., "Arbitration Provision", "Third-Party Data Sharing"
    private String subject;
    private String body;
    private String instructions;
}
