package com.citizenloop.citizenloop_backend.controller;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.service.DashboardService;
import com.citizenloop.citizenloop_backend.service.DashboardService.PublicDashboardStats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = {"http://localhost:3000", "*"})
public class PublicController {

    @Autowired
    private DashboardService dashboardService;

    /**
     * Get public dashboard statistics
     * Shows transparency metrics: total complaints, resolved complaints, resolution rate, SDG impact
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            PublicDashboardStats stats = dashboardService.getPublicStats();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stats", stats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get all resolved complaints for public view
     */
    @GetMapping("/complaints/resolved")
    public ResponseEntity<?> getResolvedComplaints() {
        try {
            // Using service to get resolved complaints
            List<Complaint> complaints = dashboardService.getAllComplaintsForMap();
            complaints.removeIf(c -> !c.getStatus().name().equals("RESOLVED"));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get complaints for map visualization (area-wise heatmap)
     */
    @GetMapping("/complaints/map")
    public ResponseEntity<?> getComplaintsForMap() {
        try {
            List<Complaint> complaints = dashboardService.getAllComplaintsForMap();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get SDG-wise impact analytics
     */
    @GetMapping("/sdg-analytics")
    public ResponseEntity<?> getSDGAnalytics() {
        try {
            Map<String, Object> sdgStats = dashboardService.getSDGStatistics();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sdgImpact", sdgStats);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get complaints by SDG goal (for SDG-specific dashboard)
     */
    @GetMapping("/complaints/sdg/{sdgGoal}")
    public ResponseEntity<?> getComplaintsBySDG(@PathVariable String sdgGoal) {
        try {
            List<Complaint> complaints = dashboardService.getAllComplaintsForMap();
            complaints.removeIf(c -> !c.getSdgGoal().equalsIgnoreCase(sdgGoal));

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("sdgGoal", sdgGoal);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get all complaints (for transparency)
     */
    @GetMapping("/complaints/all")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<Complaint> complaints = dashboardService.getAllComplaintsForMap();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Citizen Loop Public API is running");
        return ResponseEntity.ok(response);
    }
}
