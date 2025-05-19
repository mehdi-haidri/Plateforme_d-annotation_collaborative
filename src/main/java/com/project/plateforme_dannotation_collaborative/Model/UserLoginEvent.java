package com.project.plateforme_dannotation_collaborative.Model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_login_events")
@Getter
@Setter
public class UserLoginEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private LocalDateTime loginTime;

    // Getters and setters
}

