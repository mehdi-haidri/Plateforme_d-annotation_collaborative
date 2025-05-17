package com.project.plateforme_dannotation_collaborative.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;
import java.util.List;

@Entity
@Data
@AllArgsConstructor@NoArgsConstructor
public class Task {
    @Id
    @GeneratedValue
    long id;
    @Temporal(TemporalType.DATE)
    Date limitDate;
    Double advancement = 0d;
    Integer size;

    @ManyToOne
            @JsonBackReference
    Annotator annotator;

    @ManyToOne
            @JsonBackReference
    Dataset dataset;

    @OneToMany(mappedBy = "task")
            @JsonBackReference
    List<TextCouple> textCouples;

    @CreationTimestamp  // ✅ Automatically set when entity is created
    @Temporal(TemporalType.DATE)
    private Date createdAt;

    private  Integer checkpoint = 0;
}
