package com.project.plateforme_dannotation_collaborative.Controller;

import com.project.plateforme_dannotation_collaborative.Dto.Annotator.SaveTextCoupleDto;
import com.project.plateforme_dannotation_collaborative.Dto.Annotator.TaskDto;
import com.project.plateforme_dannotation_collaborative.Dto.Annotator.TaskInfoDto;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Model.Task;
import com.project.plateforme_dannotation_collaborative.Model.TextCouple;
import com.project.plateforme_dannotation_collaborative.Service.AnnotatorSevice;
import com.project.plateforme_dannotation_collaborative.Service.TaskService;
import com.project.plateforme_dannotation_collaborative.Service.TextCoupleService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/app/v1/annotator/")
public class AnnotatorController {

    private  final TaskService taskService;
    private final TextCoupleService textCoupleService;
    @GetMapping("/tasks")
    public ResponseEntity<?> getTasks(HttpServletRequest request) {
        Long annotator_id = (Long) request.getAttribute("userId");
        Response response = new Response();
        response.setError(false);
        List<TaskDto> tasks = taskService.getAllTasksByAnnotator(annotator_id);
        response.getData().put("tasks", tasks);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/task/{id}")
    public ResponseEntity<?> getTask(@PathVariable Long id) {
        Task task = taskService.geTaskById(id);
        TaskInfoDto taskInfoDto = new TaskInfoDto(
                task.getId(),
                task.getLimitDate(),
                task.getAdvancement(),
                task.getSize(),
                task.getDataset().getName(),
                task.getDataset().getSize(),
                task.getCreatedAt(),
                task.getDataset().getDescription()
        );
        Response response = new Response();
        response.setError(false);
        response.getData().put("task", taskInfoDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/task/{id}/textcouple/{index}")
    public ResponseEntity<?> getTaskTextCouple( @PathVariable Long id, @PathVariable Integer index) {
        Task task = taskService.geTaskById(id);
        Response response = textCoupleService.getTextCoupleByTaskAndAnnotatorAndPage(task , index);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/task/{id}/lastAnnotated")
    public ResponseEntity<?> getLatestTaskTextCouple(@PathVariable Long id) {
        Task task = taskService.geTaskById(id);
        Response response = textCoupleService.getTextCoupleByTaskAndAnnotatorAndPage(task , task.getCheckpoint() );
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/saveTextCouple")
    public ResponseEntity<?> saveTextCouple(HttpServletRequest request , @RequestBody SaveTextCoupleDto textCouple) {
        Response response = new Response();
        Long annotator_id = (Long) request.getAttribute("userId");
        Boolean r = textCoupleService.saveAnnotation(annotator_id,textCouple);
        response.setError(!r);
        if(r){
        return new ResponseEntity<>(response, HttpStatus.OK);
        }
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

}
