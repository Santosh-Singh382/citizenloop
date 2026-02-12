package com.citizenloop.citizenloop_backend.controller;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintCategory;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintStatus;
import com.citizenloop.citizenloop_backend.model.User;
import com.citizenloop.citizenloop_backend.service.AdminService;
import com.citizenloop.citizenloop_backend.service.ComplaintService;
import com.citizenloop.citizenloop_backend.service.AdminService.AdminDashboardStats;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:3000"})
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private ComplaintService complaintService;

    /**
     * Get all complaints
     */
    @GetMapping("/complaints")
    public ResponseEntity<?> getAllComplaints() {
        try {
            List<Complaint> complaints = adminService.getAllComplaints();

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
     * Get complaints by status
     */
    @GetMapping("/complaints/status/{status}")
    public ResponseEntity<?> getComplaintsByStatus(@PathVariable String status) {
        try {
            ComplaintStatus complaintStatus = ComplaintStatus.valueOf(status.toUpperCase());
            List<Complaint> complaints = adminService.getComplaintsByStatus(complaintStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("status", status);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid status or error fetching complaints");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get complaints by category
     */
    @GetMapping("/complaints/category/{category}")
    public ResponseEntity<?> getComplaintsByCategory(@PathVariable String category) {
        try {
            ComplaintCategory complaintCategory = ComplaintCategory.valueOf(category.toUpperCase());
            List<Complaint> complaints = adminService.getComplaintsByCategory(complaintCategory);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid category or error fetching complaints");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get complaints by category and status
     */
    @GetMapping("/complaints/category/{category}/status/{status}")
    public ResponseEntity<?> getComplaintsByCategoryAndStatus(
            @PathVariable String category,
            @PathVariable String status) {
        try {
            ComplaintCategory complaintCategory = ComplaintCategory.valueOf(category.toUpperCase());
            ComplaintStatus complaintStatus = ComplaintStatus.valueOf(status.toUpperCase());
            List<Complaint> complaints = adminService.getComplaintsByCategoryAndStatus(complaintCategory, complaintStatus);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("category", category);
            response.put("status", status);
            response.put("complaints", complaints);
            response.put("count", complaints.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Invalid filter parameters");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Update complaint status
     */
    @PutMapping("/complaint/{id}/status")
    public ResponseEntity<?> updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        try {
            ComplaintStatus status = ComplaintStatus.valueOf(request.getStatus().toUpperCase());
            Complaint updatedComplaint = adminService.updateComplaintStatus(id, status);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Complaint status updated successfully");
            response.put("complaint", updatedComplaint);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get dashboard statistics
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<?> getDashboardStats() {
        try {
            AdminDashboardStats stats = adminService.getDashboardStats();

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
     * Get all users
     */
    @GetMapping("/users")
    public ResponseEntity<?> getAllUsers() {
        try {
            List<User> users = adminService.getAllUsers();

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("users", users);
            response.put("count", users.size());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get user by ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            User user = adminService.getUserById(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Get complaints for a specific user
     */
    @GetMapping("/users/{userId}/complaints")
    public ResponseEntity<?> getUserComplaints(@PathVariable Long userId) {
        try {
            List<Complaint> complaints = complaintService.getComplaintsByUser(userId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("userId", userId);
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

    // Request DTOs
    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
