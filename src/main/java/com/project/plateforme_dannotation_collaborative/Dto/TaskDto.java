package com.project.plateforme_dannotation_collaborative.Dto;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import jakarta.persistence.*;
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
