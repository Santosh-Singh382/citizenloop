package com.citizenloop.citizenloop_backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.citizenloop.citizenloop_backend.model.Complaint;
import com.citizenloop.citizenloop_backend.model.Complaint.ComplaintCategory;
import com.citizenloop.citizenloop_backend.repository.ComplaintRepository;

@Service
public class DashboardService {

    @Autowired
    private ComplaintRepository complaintRepository;

    /**
     * Get public dashboard statistics
     */
    public PublicDashboardStats getPublicStats() {
        PublicDashboardStats stats = new PublicDashboardStats();

        // Total and resolved counts
        stats.setTotalComplaints(complaintRepository.count());
        stats.setResolvedComplaints(complaintRepository.countResolvedComplaints());
        stats.setResolutionRate(
                stats.getTotalComplaints() > 0 
                    ? (double) stats.getResolvedComplaints() / stats.getTotalComplaints() * 100 
                    : 0);

        // Complaint distribution by category
        for (ComplaintCategory category : ComplaintCategory.values()) {
            List<Complaint> categoryComplaints = complaintRepository.findByCategory(category);
            stats.getCategoryDistribution().put(
                    category.toString(),
                    (long) categoryComplaints.size()
            );
        }

        // SDG Impact Statistics
        Map<String, Long> sdgImpact = new HashMap<>();
        for (ComplaintCategory category : ComplaintCategory.values()) {
            List<Complaint> complaints = complaintRepository.findBySdgGoal(category.getSdgMapping());
            sdgImpact.put(category.getSdgMapping(), (long) complaints.size());
        }
        stats.setSdgImpact(sdgImpact);

        // Calculate average resolution time
        List<Complaint> resolvedComplaints = complaintRepository.findResolvedComplaints();
        if (!resolvedComplaints.isEmpty()) {
            double avgTime = resolvedComplaints.stream()
                    .mapToDouble(c -> java.time.temporal.ChronoUnit.DAYS.between(c.getCreatedAt(), c.getResolvedAt()))
                    .average()
                    .orElse(0);
            stats.setAverageResolutionTime(Math.round(avgTime * 100.0) / 100.0);
        }

        return stats;
    }

    /**
     * Get area-wise complaint heatmap data (based on lat/long clustering)
     */
    public List<Complaint> getAllComplaintsForMap() {
        return complaintRepository.findAll();
    }

    /**
     * Get SDG-specific statistics
     */
    public Map<String, Object> getSDGStatistics() {
        Map<String, Object> sdgStats = new HashMap<>();

        for (ComplaintCategory category : ComplaintCategory.values()) {
            Map<String, Object> categoryMap = new HashMap<>();
            List<Complaint> complaints = complaintRepository.findBySdgGoal(category.getSdgMapping());
            
            categoryMap.put("sdg", category.getSdgMapping());
            categoryMap.put("totalComplaints", complaints.size());
            categoryMap.put("resolved", complaints.stream()
                    .filter(c -> c.getStatus().name().equals("RESOLVED"))
                    .count());
            categoryMap.put("pending", complaints.stream()
                    .filter(c -> c.getStatus().name().equals("PENDING"))
                    .count());

            sdgStats.put(category.toString(), categoryMap);
        }

        return sdgStats;
    }

    /**
     * Public dashboard statistics class
     */
    public static class PublicDashboardStats {
        private long totalComplaints;
        private long resolvedComplaints;
        private double resolutionRate;
        private double averageResolutionTime;
        private Map<String, Long> categoryDistribution = new HashMap<>();
        private Map<String, Long> sdgImpact = new HashMap<>();

        // Getters and setters
        public long getTotalComplaints() {
            return totalComplaints;
        }

        public void setTotalComplaints(long totalComplaints) {
            this.totalComplaints = totalComplaints;
        }

        public long getResolvedComplaints() {
            return resolvedComplaints;
        }

        public void setResolvedComplaints(long resolvedComplaints) {
            this.resolvedComplaints = resolvedComplaints;
        }

        public double getResolutionRate() {
            return resolutionRate;
        }

        public void setResolutionRate(double resolutionRate) {
            this.resolutionRate = resolutionRate;
        }

        public double getAverageResolutionTime() {
            return averageResolutionTime;
        }

        public void setAverageResolutionTime(double averageResolutionTime) {
            this.averageResolutionTime = averageResolutionTime;
        }

        public Map<String, Long> getCategoryDistribution() {
            return categoryDistribution;
        }

        public void setCategoryDistribution(Map<String, Long> categoryDistribution) {
            this.categoryDistribution = categoryDistribution;
        }

        public Map<String, Long> getSdgImpact() {
            return sdgImpact;
        }

        public void setSdgImpact(Map<String, Long> sdgImpact) {
            this.sdgImpact = sdgImpact;
        }
    }
}

