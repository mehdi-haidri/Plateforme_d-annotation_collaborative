package com.project.plateforme_dannotation_collaborative.Controller;


@RestController
public class HealthController {

   @GetMapping("/health")
    public String health() {
        return "OK";
    }

}