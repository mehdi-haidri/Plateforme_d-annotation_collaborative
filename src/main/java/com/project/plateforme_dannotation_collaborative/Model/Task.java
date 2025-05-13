package com.project.plateforme_dannotation_collaborative.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.List;

@Entity
@Data
@AllArgsConstructor@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue
    long id;
    @DateTimeFormat(pattern = "dd/mm/yyyy")
    String limitDate;
    Double advancement = 0d;
    Integer size;

    @ManyToOne
            @JsonBackReference
    Annotator annotator;

    @ManyToOne
            @JsonBackReference
    Dataset dataset;

    @OneToMany(mappedBy = "task")
            @JsonManagedReference
    List<TextCouple> textCouples;
}
