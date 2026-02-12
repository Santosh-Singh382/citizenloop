package com.citizenloop.citizenloop_backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.citizenloop.citizenloop_backend.model.Complaint;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    
    // Citizen operations
    List<Complaint> findByUserId(Long userId);
    Optional<Complaint> findByComplaintId(String complaintId);

    // Admin operations
    List<Complaint> findByStatus(Complaint.ComplaintStatus status);
    List<Complaint> findByCategory(Complaint.ComplaintCategory category);
    
    // Analytics queries
    List<Complaint> findBySdgGoal(String sdgGoal);
    
    @Query("SELECT c FROM Complaint c WHERE c.status = 'RESOLVED'")
    List<Complaint> findResolvedComplaints();
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = 'PENDING'")
    long countPendingComplaints();
    
    @Query("SELECT COUNT(c) FROM Complaint c WHERE c.status = 'RESOLVED'")
    long countResolvedComplaints();
    
    @Query("SELECT c FROM Complaint c WHERE c.category = :category AND c.status = :status")
    List<Complaint> findByCategoryAndStatus(@Param("category") Complaint.ComplaintCategory category, 
                                           @Param("status") Complaint.ComplaintStatus status);
    
    @Query("SELECT c FROM Complaint c WHERE YEAR(c.createdAt) = :year AND MONTH(c.createdAt) = :month")
    List<Complaint> findByMonthYear(@Param("year") int year, @Param("month") int month);
}

