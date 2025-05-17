package com.project.plateforme_dannotation_collaborative.Model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter

public class Annotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private  Long id;

    private String classe;

    @ManyToOne
    private  TextCouple textCouple;

    @ManyToOne
    private Annotator annotator;
}
