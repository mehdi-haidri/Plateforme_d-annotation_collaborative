package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Annotation;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnnotationRepository extends JpaRepository<Annotation, Long> {

    Optional<Annotation> findAnnotationByTextCouple (TextCouple textCouple);
}
