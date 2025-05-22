package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Dataset;
import com.project.plateforme_dannotation_collaborative.Model.Task;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TextCoupleRepository extends JpaRepository<TextCouple, Long> {


    List<TextCouple> findAllByDataset(Dataset dataset);
    Page<TextCouple> findAllByDataset_Id(Long dataset_id ,PageRequest pageRequest);
    Page<TextCouple> findByTask(Task task, Pageable pageable);
}
