package com.citizenloop.citizenloop_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintCategory;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintStatus;
import com.citizenloop.citizenloop_backend.model.User;
import com.citizenloop.citizenloop_backend.repository.ComplaintRepository;
import com.citizenloop.citizenloop_backend.repository.UserRepository;

@Service
public class ComplaintService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Save a new complaint for a citizen
     */
    public Complaint saveComplaint(Long userId, Complaint complaint) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        complaint.setUser(user);
        complaint.setStatus(ComplaintStatus.PENDING);
        complaint.setComplaintId(generateComplaintId());
        complaint.setSdgGoal(complaint.getCategory().getSdgMapping());

        return complaintRepository.save(complaint);
    }

    /**
     * Get all complaints of a specific user
     */
    public List<Complaint> getComplaintsByUser(Long userId) {
        return complaintRepository.findByUserId(userId);
    }

    /**
     * Get complaint by ID
     */
    public Complaint getComplaintById(Long id) {
        return complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    /**
     * Get complaint by complaint ID (public ID)
     */
    public Complaint getComplaintByComplaintId(String complaintId) {
        return complaintRepository.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
    }

    /**
     * Get all complaints (for admin)
     */
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    /**
     * Update complaint status
     */
    public Complaint updateComplaintStatus(Long id, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        if (status == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(LocalDateTime.now());
        }
        return complaintRepository.save(complaint);
    }

    /**
     * Update complaint (admin operations)
     */
    public Complaint updateComplaint(Long id, Complaint complaintDetails) {
        Complaint complaint = complaintRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));

        if (complaintDetails.getTitle() != null) {
            complaint.setTitle(complaintDetails.getTitle());
        }
        if (complaintDetails.getDescription() != null) {
            complaint.setDescription(complaintDetails.getDescription());
        }
        if (complaintDetails.getCategory() != null) {
            complaint.setCategory(complaintDetails.getCategory());
        }
        if (complaintDetails.getStatus() != null) {
            complaint.setStatus(complaintDetails.getStatus());
            if (complaintDetails.getStatus() == ComplaintStatus.RESOLVED) {
                complaint.setResolvedAt(LocalDateTime.now());
            }
        }

        return complaintRepository.save(complaint);
    }

    /**
     * Delete complaint
     */
    public void deleteComplaint(Long id) {
        complaintRepository.deleteById(id);
    }

    /**
     * Get complaints by category
     */
    public List<Complaint> getComplaintsByCategory(ComplaintCategory category) {
        return complaintRepository.findByCategory(category);
    }

    /**
     * Get complaints by status
     */
    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    /**
     * Get complaints by SDG goal
     */
    public List<Complaint> getComplaintsBySDGGoal(String sdgGoal) {
        return complaintRepository.findBySdgGoal(sdgGoal);
    }

    /**
     * Generate unique complaint ID
     */
    private String generateComplaintId() {
        return "CL-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    /**
     * Get resolution metrics
     */
    public long getResolvedComplaintsCount() {
        return complaintRepository.countResolvedComplaints();
    }

    public long getPendingComplaintsCount() {
        return complaintRepository.countPendingComplaints();
    }

    /**
     * Get average resolution time in days
     */
    public double getAverageResolutionTime() {
        List<Complaint> resolvedComplaints = complaintRepository.findResolvedComplaints();
        if (resolvedComplaints.isEmpty()) {
            return 0;
        }

        double totalMinutes = resolvedComplaints.stream()
                .mapToDouble(c -> {
                    long minutes = java.time.temporal.ChronoUnit.MINUTES.between(c.getCreatedAt(), c.getResolvedAt());
                    return minutes;
                })
                .sum();

        return totalMinutes / (resolvedComplaints.size() * 24 * 60); // Convert to days
    }
}
