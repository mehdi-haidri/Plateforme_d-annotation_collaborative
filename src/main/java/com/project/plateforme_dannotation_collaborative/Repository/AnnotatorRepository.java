package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AnnotatorRepository extends JpaRepository<Annotator, Long> {


     List<Annotator> findByState(Boolean state);
}
