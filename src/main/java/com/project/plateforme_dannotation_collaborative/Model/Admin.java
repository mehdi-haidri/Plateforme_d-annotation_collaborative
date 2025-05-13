package com.project.plateforme_dannotation_collaborative.Model;


import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor @AllArgsConstructor
@DiscriminatorValue("ADMI")
public class Admin extends User{
    String forAdmin;
}
