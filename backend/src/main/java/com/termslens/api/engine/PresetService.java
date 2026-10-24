package com.termslens.api.engine;

import com.termslens.api.model.PresetSample;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PresetService {

    private final List<PresetSample> samples = new ArrayList<>();

    public PresetService() {
        samples.add(PresetSample.builder()
                .id("streaming")
                .title("Streaming App Free Trial")
                .category("Financial & Legal Traps")
                .description("Sneaky recurring billing after promo, postal mail cancellation hurdles, and mandatory arbitration.")
                .expectedGrade("D")
                .content("By starting your 14-day free trial, you authorize us to immediately charge your credit card $49.99/month recurring without further notice once promotional period expires. Cancellation must be requested via certified postal mail 30 days prior to renewal. Payments are strictly non-refundable under all circumstances. You agree to resolve all disputes through individual binding arbitration and waive all rights to a jury trial or class action.")
                .build());

        samples.add(PresetSample.builder()
                .id("loan")
                .title("Instant Micro-Loan App")
                .category("Predatory Data & Financial Escalation")
                .description("Excessive device permissions (contacts, SMS, gallery) and unilateral interest rate hikes.")
                .expectedGrade("F")
                .content("You grant us unrestricted permission to access your device contacts list, SMS history, photo gallery metadata, and precise geolocation. We reserve the right to increase fees and daily interest rates up to 365% APR at our sole discretion upon posting to the service. We may sell and license telemetry and user data to commercial third-party marketing affiliates.")
                .build());

        samples.add(PresetSample.builder()
                .id("social")
                .title("Social Media & Photo Filter")
                .category("Privacy & Content Grasp")
                .description("Perpetual worldwide copyright surrender, biometrics resale, and unconsented AI model training.")
                .expectedGrade("D")
                .content("You hereby grant the Company an irrevocable, perpetual, worldwide, transferable license to reproduce, distribute, and monetize any photos, likeness, and biometric voice data you upload. We reserve the right to train artificial intelligence and machine learning models on user content and messages. Aggregated telemetry may be sold to third-party data brokers.")
                .build());

        samples.add(PresetSample.builder()
                .id("clean")
                .title("Fair SaaS Agreement")
                .category("Consumer-Friendly Benchmark")
                .description("Transparent 1-click cancellation, zero data selling, and access to local courts.")
                .expectedGrade("A")
                .content("You may cancel your subscription at any time with a single click in your account settings with no penalties or hidden fees. We do not sell or monetize your personal data or contacts to third parties. If you are dissatisfied, we offer a 30-day money-back refund. Any legal disputes may be resolved in small claims court within your local jurisdiction.")
                .build());
    }

    public List<PresetSample> getAllPresets() {
        return samples;
    }

    public Optional<PresetSample> getPresetById(String id) {
        return samples.stream()
                .filter(s -> s.getId().equalsIgnoreCase(id))
                .findFirst();
    }
}
