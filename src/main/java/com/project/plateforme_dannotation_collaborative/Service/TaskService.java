package com.project.plateforme_dannotation_collaborative.Service;


import com.project.plateforme_dannotation_collaborative.Model.Task;
import com.project.plateforme_dannotation_collaborative.Repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;


    public Task  saveTask(Task task){
        return taskRepository.save(task);
    }
}
