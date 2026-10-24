package com.termslens.api.engine;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class UrlScraper {

    public String scrapePolicyText(String url) throws IOException {
        if (url == null || url.isBlank()) {
            throw new IllegalArgumentException("Target URL cannot be empty");
        }

        // Validate basic protocol
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
        }

        Document doc = Jsoup.connect(url)
                .userAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) TermsLens Consumer Compliance Scanner")
                .timeout(8000)
                .get();

        // Extract clean text from main semantic containers, fallback to body
        String text = doc.select("main, article, .terms, .privacy, .legal-content").text();
        if (text.isBlank()) {
            text = doc.body().text();
        }

        // Limit to 25,000 characters to keep execution ultra-fast and bounded
        if (text.length() > 25000) {
            text = text.substring(0, 25000);
        }

        return text;
    }
}
