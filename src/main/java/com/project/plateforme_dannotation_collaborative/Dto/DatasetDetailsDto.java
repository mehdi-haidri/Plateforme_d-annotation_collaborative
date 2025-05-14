package com.project.plateforme_dannotation_collaborative.Dto;

import com.project.plateforme_dannotation_collaborative.Model.Task;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
public class DatasetDetailsDto {
    private Long id;
    private Date limitDate;
    private  Integer size ;
    private String name;
    private String description ;
    private List<String> classes ;
    private List<Long> annotators ;
    private Double advancement ;
    private  List <TaskDto> tasks ;
}
