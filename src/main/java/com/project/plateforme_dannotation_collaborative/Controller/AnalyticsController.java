package com.project.plateforme_dannotation_collaborative.Controller;

import com.project.plateforme_dannotation_collaborative.Service.DashboardService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RequestMapping("/app/v1/analytics")
@RestController
@RequiredArgsConstructor
@Transactional
public class AnalyticsController {




        private final DashboardService dashboardService;

        @GetMapping("/logins/last7days")
        public ResponseEntity<Map<String, Long>> getLast7DaysLogins() {
            return ResponseEntity.ok(dashboardService.getLast7DaysLoginCount());
        }

        @GetMapping("/dashboard")
        public ResponseEntity<?> getDasboard() {
                try {
                return  ResponseEntity.ok(dashboardService.getDashboardStats());

                }catch (RuntimeException e){
                        e.printStackTrace();
                        return ResponseEntity.badRequest().body("eeeee");
                }
        }

}
