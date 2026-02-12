package com.citizenloop.citizenloop_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String complaintId;  // Unique complaint ID for citizens

    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    private ComplaintCategory category;  // WASTE, WATER, ROAD, STREETLIGHT, HAZARD

    private Double latitude;    // Geolocation
    private Double longitude;   // Geolocation

    private String imageUrl;    // Path to uploaded image

    @Enumerated(EnumType.STRING)
    private ComplaintStatus status;  // PENDING, IN_PROGRESS, RESOLVED

    private String sdgGoal;     // SDG mapping (e.g., "SDG 6: Clean Water", "SDG 11: Sustainable Cities")

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        status = ComplaintStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum ComplaintCategory {
        WASTE("SDG 11: Sustainable Cities"),
        WATER("SDG 6: Clean Water & Sanitation"),
        ROAD("SDG 9: Industry, Innovation & Infrastructure"),
        STREETLIGHT("SDG 7: Affordable & Clean Energy"),
        HAZARD("SDG 3: Good Health & Well-being");

        private final String sdgMapping;

        ComplaintCategory(String sdgMapping) {
            this.sdgMapping = sdgMapping;
        }

        public String getSdgMapping() {
            return sdgMapping;
        }
    }

    public enum ComplaintStatus {
        PENDING,
        IN_PROGRESS,
        RESOLVED
    }
}

