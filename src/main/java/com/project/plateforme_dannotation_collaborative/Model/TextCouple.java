package com.project.plateforme_dannotation_collaborative.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Data
@NoArgsConstructor @AllArgsConstructor
public class TextCouple {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    String text1;
    String text2;
    @ManyToOne
    @JsonBackReference
    Dataset dataset;
    @ManyToOne
            @JsonBackReference
    Task task ;

    @OneToOne(mappedBy = "textCouple" , cascade = CascadeType.ALL, orphanRemoval = true )
            @JsonManagedReference
    Annotation annotation;
    }
