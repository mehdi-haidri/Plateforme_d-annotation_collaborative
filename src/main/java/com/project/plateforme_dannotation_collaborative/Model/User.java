package com.project.plateforme_dannotation_collaborative.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@Table(name = "users")
public abstract class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String lastName;
    String firstName;
    @Column(unique = true , nullable = false)
    String email;
    String password;
    @ManyToOne
    @JsonManagedReference
    Role role;
    Boolean state = true ;
    Boolean online = false;
}
