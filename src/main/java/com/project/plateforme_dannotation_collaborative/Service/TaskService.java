package com.project.plateforme_dannotation_collaborative.Service;


import com.project.plateforme_dannotation_collaborative.Dto.Annotator.TaskDto;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Model.Task;
import com.project.plateforme_dannotation_collaborative.Repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final AnnotatorSevice annotatorSevice;


    public Task  saveTask(Task task){
        return taskRepository.save(task);
    }

    public List<TaskDto> getAllTasksByAnnotator(Long annotatorId){
        Annotator annotator = annotatorSevice.getAnnotatorById(annotatorId);

        List<TaskDto>  tasks = taskRepository.findAllByAnnotator(annotator).stream().map(t->
                new TaskDto(t.getId(),t.getLimitDate(),t.getAdvancement(),t.getSize(),t.getDataset().getName(),t.getCreatedAt())
        ).toList();
        return tasks ;
    }

    public Task geTaskById(Long id) {
        return  taskRepository.findById(id).orElse(new Task());
    }
}
