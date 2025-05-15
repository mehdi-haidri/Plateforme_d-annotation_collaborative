package com.project.plateforme_dannotation_collaborative.Model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.*;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@DiscriminatorValue("ANNO")
public class Annotator extends User{
    String forAnnotator;
    @OneToMany(mappedBy = "annotator")
    @JsonManagedReference
    List<Task> tasks;
}
