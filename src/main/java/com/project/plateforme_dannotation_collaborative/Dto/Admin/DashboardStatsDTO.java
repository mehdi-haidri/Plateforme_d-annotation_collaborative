package com.project.plateforme_dannotation_collaborative.Dto.Admin;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DashboardStatsDTO {
    private long totalUsers;
    private long totalDatasets;
    private long totalAnnotators;
    private long totalTasks;
    private long activeUsers;
    private long completedTasks;
    private long pendingTasks;

}