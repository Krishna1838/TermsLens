package com.termslens.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PresetSample {
    private String id;
    private String title;
    private String category;
    private String description;
    private String content;
    private String expectedGrade;
}
