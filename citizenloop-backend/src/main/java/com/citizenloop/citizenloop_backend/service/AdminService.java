package com.citizenloop.citizenloop_backend.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintCategory;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintStatus;
import com.citizenloop.citizenloop_backend.model.User;
import com.citizenloop.citizenloop_backend.repository.ComplaintRepository;
import com.citizenloop.citizenloop_backend.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private ComplaintRepository complaintRepository;

    @Autowired
    private UserRepository userRepository;

    /**
     * Get all complaints for admin dashboard
     */
    public List<Complaint> getAllComplaints() {
        return complaintRepository.findAll();
    }

    /**
     * Get complaints filtered by status
     */
    public List<Complaint> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status);
    }

    /**
     * Get complaints filtered by category
     */
    public List<Complaint> getComplaintsByCategory(ComplaintCategory category) {
        return complaintRepository.findByCategory(category);
    }

    /**
     * Get complaints by category and status
     */
    public List<Complaint> getComplaintsByCategoryAndStatus(ComplaintCategory category, ComplaintStatus status) {
        return complaintRepository.findByCategoryAndStatus(category, status);
    }

    /**
     * Update complaint status
     */
    public Complaint updateComplaintStatus(Long complaintId, ComplaintStatus status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found"));
        complaint.setStatus(status);
        if (status == ComplaintStatus.RESOLVED) {
            complaint.setResolvedAt(java.time.LocalDateTime.now());
        }
        return complaintRepository.save(complaint);
    }

    /**
     * View all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Get user by ID
     */
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Get dashboard statistics
     */
    public AdminDashboardStats getDashboardStats() {
        AdminDashboardStats stats = new AdminDashboardStats();

        // Count complaints by status
        stats.setTotalComplaints(complaintRepository.count());
        stats.setPendingComplaints(complaintRepository.countPendingComplaints());
        stats.setResolvedComplaints(complaintRepository.countResolvedComplaints());
        stats.setInProgressComplaints(stats.getTotalComplaints() - stats.getPendingComplaints() - stats.getResolvedComplaints());

        // Count by category
        for (ComplaintCategory category : ComplaintCategory.values()) {
            stats.getCategoryCount().put(category.toString(), (long) complaintRepository.findByCategory(category).size());
        }

        // Calculate average resolution time
        List<Complaint> resolved = complaintRepository.findResolvedComplaints();
        if (!resolved.isEmpty()) {
            double totalDays = resolved.stream()
                    .mapToDouble(c -> java.time.temporal.ChronoUnit.DAYS.between(c.getCreatedAt(), c.getResolvedAt()))
                    .average()
                    .orElse(0);
            stats.setAverageResolutionTime(totalDays);
        }

        return stats;
    }

    /**
     * Inner class for dashboard statistics
     */
    public static class AdminDashboardStats {
        private long totalComplaints;
        private long pendingComplaints;
        private long inProgressComplaints;
        private long resolvedComplaints;
        private double averageResolutionTime;
        private java.util.Map<String, Long> categoryCount = new java.util.HashMap<>();

        // Getters and setters
        public long getTotalComplaints() {
            return totalComplaints;
        }

        public void setTotalComplaints(long totalComplaints) {
            this.totalComplaints = totalComplaints;
        }

        public long getPendingComplaints() {
            return pendingComplaints;
        }

        public void setPendingComplaints(long pendingComplaints) {
            this.pendingComplaints = pendingComplaints;
        }

        public long getInProgressComplaints() {
            return inProgressComplaints;
        }

        public void setInProgressComplaints(long inProgressComplaints) {
            this.inProgressComplaints = inProgressComplaints;
        }

        public long getResolvedComplaints() {
            return resolvedComplaints;
        }

        public void setResolvedComplaints(long resolvedComplaints) {
            this.resolvedComplaints = resolvedComplaints;
        }

        public double getAverageResolutionTime() {
            return averageResolutionTime;
        }

        public void setAverageResolutionTime(double averageResolutionTime) {
            this.averageResolutionTime = averageResolutionTime;
        }

        public java.util.Map<String, Long> getCategoryCount() {
            return categoryCount;
        }

        public void setCategoryCount(java.util.Map<String, Long> categoryCount) {
            this.categoryCount = categoryCount;
        }
    }
}

