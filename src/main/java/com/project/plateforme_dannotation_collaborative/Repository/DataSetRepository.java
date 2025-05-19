package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DataSetRepository extends JpaRepository<Dataset ,Long> {
    long countByAnnotatedFalse();
    @Query("SELECT COUNT(d) FROM Dataset d WHERE d.annotated = true AND d.advancement < d.size")
    long countAnnotatedButNotCompleted();

    @Query("SELECT COUNT(d) FROM Dataset d WHERE d.annotated = true AND d.advancement = d.size")
    long countByAdvancementEqualsSize();
}
