package com.project.plateforme_dannotation_collaborative.Dto.Admin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

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
    private Integer advancement ;
    private  List <TaskDto> tasks ;
}
