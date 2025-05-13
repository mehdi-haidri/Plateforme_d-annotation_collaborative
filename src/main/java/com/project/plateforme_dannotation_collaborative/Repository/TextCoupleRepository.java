package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TextCoupleRepository extends JpaRepository<TextCouple, Long> {

    List<TextCouple> findAllByDataset(Dataset dataset);
}
