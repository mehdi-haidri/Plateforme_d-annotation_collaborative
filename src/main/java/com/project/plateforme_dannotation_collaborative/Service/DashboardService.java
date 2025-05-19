package com.project.plateforme_dannotation_collaborative.Service;

import com.project.plateforme_dannotation_collaborative.Dto.Admin.ActiveUserDTO;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DashboardStatsDTO;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.DataSetsDistributionDto;
import com.project.plateforme_dannotation_collaborative.Model.Role;
import com.project.plateforme_dannotation_collaborative.Model.User;
import com.project.plateforme_dannotation_collaborative.Repository.*;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService  {


      private final DataSetRepository datasetRepository;
      private final UserRepository userRepository;
      private final  TaskRepository taskRepository;
      private final UserLoginEventRepository userLoginEventRepository;
      private final RoleRepository roleRepository;

    public Map<String, Long> getLast7DaysLoginCount() {
        LocalDate today = LocalDate.now();
        LocalDate sevenDaysAgo = today.minusDays(6); // Includes today

        // Fetch from DB (your existing query)
        List<Object[]> rawData = userLoginEventRepository.getLoginStatsLast7Days(
                sevenDaysAgo.atStartOfDay()
        );

        // Convert DB result to a Map
        Map<String, Long> dbMap = rawData.stream()
                .collect(Collectors.toMap(
                        row -> (String) row[0],
                        row -> ((Number) row[1]).longValue()
                ));

        // Build final result with all days (fill missing with 0)
        Map<String, Long> finalResult = new LinkedHashMap<>();
        for (int i = 0; i < 7; i++) {
            LocalDate date = sevenDaysAgo.plusDays(i);
            String key = date.toString(); // Format: yyyy-MM-dd
            finalResult.put(key, dbMap.getOrDefault(key, 0L));
        }

        return finalResult;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> response = new HashMap<>();

        // 1. Stats like totalUsers, totalDatasets, totalAnnotators, etc.
        long totalUsers = userRepository.count();
        long totalDatasets = datasetRepository.count();
        long totalAnnotators = userRepository.countByRole(roleRepository.findByName("ROLE_ANNOTATOR").orElseThrow());
        long totalTasks = taskRepository.count();
        long completedTasks = taskRepository.countByAdvancement(100d);
        long pendingTasks = taskRepository.countByAdvancementLessThan(100d);
        long activeUsers = userRepository.countByOnlineTrue(); // example: count active users with "ROLE_USER"

        long completedDatasets = datasetRepository.countByAdvancementEqualsSize();
        long annotatedNotCompletedDatasets = datasetRepository.countAnnotatedButNotCompleted();
        long notAnnotatedDatasets = datasetRepository.countByAnnotatedFalse();

        DashboardStatsDTO stats = new DashboardStatsDTO();
        stats.setTotalUsers(totalUsers);
        stats.setTotalDatasets(totalDatasets);
        stats.setTotalAnnotators(totalAnnotators);
        stats.setTotalTasks(totalTasks);
        stats.setCompletedTasks(completedTasks);
        stats.setPendingTasks(pendingTasks);
        stats.setActiveUsers(activeUsers);

        // 2. Active users list: last 1 hour or last 30 minutes, e.g.
        LocalDateTime lastHour = LocalDateTime.now().minusHours(1);
        List<User> activeUsersList = userRepository.findByOnlineTrue();

        List<ActiveUserDTO> activeUserDTOs = activeUsersList.stream().map(user -> {
            // create helper method to convert to "2 minutes ago"
            Boolean status = user.getState();

            return new ActiveUserDTO(
                    user.getId(),
                    user.getFirstName() +" " + user.getLastName(),
                    user.getEmail(),
                    user.getRole().getName().replace("ROLE_", ""),  // remove "ROLE_" prefix for cleaner UI
                    status
            );
        }).collect(Collectors.toList());

        // 3. User distribution example (tasks by status)
        List<DataSetsDistributionDto> distribution = List.of(
                new DataSetsDistributionDto("Completed", completedDatasets),
                new DataSetsDistributionDto("Pending", annotatedNotCompletedDatasets),
                new DataSetsDistributionDto("NotAssigned",notAnnotatedDatasets) // example
        );

        // Compose final response map
        response.put("stats", stats);
        response.put("activeUsers", activeUserDTOs);
        response.put("userDistribution", distribution);

        return response;
    }



}

