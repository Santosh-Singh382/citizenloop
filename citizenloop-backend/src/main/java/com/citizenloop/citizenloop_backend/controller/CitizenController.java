package com.citizenloop.citizenloop_backend.controller;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintCategory;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintStatus;
import com.citizenloop.citizenloop_backend.model.User;
import com.citizenloop.citizenloop_backend.service.ComplaintService;
import com.citizenloop.citizenloop_backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/citizen")
@CrossOrigin(origins = {"http://localhost:3000"})
public class CitizenController {

    @Autowired
    private ComplaintService complaintService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Submit a new complaint
     */
    @PostMapping("/{userId}/complaints")
    public ResponseEntity<?> submitComplaint(@PathVariable Long userId, @RequestBody Complaint complaint) {
        try {
            Complaint savedComplaint = complaintService.saveComplaint(userId, complaint);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Complaint submitted successfully");
            response.put("complaintId", savedComplaint.getComplaintId());
            response.put("complaint", savedComplaint);

            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get all complaints of a citizen
     */
    @GetMapping("/{userId}/complaints")
    public ResponseEntity<?> getUserComplaints(@PathVariable Long userId) {
        try {
            List<Complaint> complaints = complaintService.getComplaintsByUser(userId);

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
     * Get single complaint by complaint ID
     */
    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<?> getComplaintByComplaintId(@PathVariable String complaintId) {
        try {
            Complaint complaint = complaintService.getComplaintByComplaintId(complaintId);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("complaint", complaint);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
        }
    }

    /**
     * Track complaint status
     */
    @GetMapping("/{userId}/complaints/{complaintId}/status")
    public ResponseEntity<?> trackComplaintStatus(@PathVariable Long userId, @PathVariable String complaintId) {
        try {
            Complaint complaint = complaintService.getComplaintByComplaintId(complaintId);

            // Verify complaint belongs to user
            if (!complaint.getUser().getId().equals(userId)) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Unauthorized access");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("complaintId", complaint.getComplaintId());
            response.put("status", complaint.getStatus());
            response.put("title", complaint.getTitle());
            response.put("category", complaint.getCategory());
            response.put("createdAt", complaint.getCreatedAt());
            response.put("updatedAt", complaint.getUpdatedAt());
            response.put("resolvedAt", complaint.getResolvedAt());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Update citizen profile
     */
    @PutMapping("/{userId}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long userId, @RequestBody User updatedUser) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOptional.get();
            if (updatedUser.getName() != null) {
                user.setName(updatedUser.getName());
            }
            if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
                // Check if email already exists
                if (userRepository.findByEmail(updatedUser.getEmail()).isPresent()) {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", false);
                    response.put("message", "Email already in use");
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
                }
                user.setEmail(updatedUser.getEmail());
            }

            User savedUser = userRepository.save(user);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Profile updated successfully");
            response.put("user", savedUser);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }

    /**
     * Get citizen profile
     */
    @GetMapping("/{userId}/profile")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        try {
            Optional<User> userOptional = userRepository.findById(userId);
            if (userOptional.isEmpty()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }

            User user = userOptional.get();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", user);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
}
