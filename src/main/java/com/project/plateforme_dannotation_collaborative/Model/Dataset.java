package com.project.plateforme_dannotation_collaborative.Model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Dataset {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     Long id;
     String name;
     String description;
     Integer size;
     Double advancement = 0d;
     Boolean annotated = false;

     @OneToMany(mappedBy = "dataset" , cascade = CascadeType.ALL, orphanRemoval = true)
             @JsonManagedReference
     List<Classes> classes ;

     @OneToMany(mappedBy = "dataset")
     @JsonManagedReference
     List<Task> tasks ;

     @OneToMany(mappedBy = "dataset")
     @JsonManagedReference
     List<TextCouple> textCouples;

}
