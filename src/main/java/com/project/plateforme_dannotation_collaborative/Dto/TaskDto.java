package com.project.plateforme_dannotation_collaborative.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
@Getter
@Setter
@AllArgsConstructor
public class TaskDto {
    Long id;
    Date limitDate;
    Double advancement ;
    Integer size;
    String annotatorName;
}
