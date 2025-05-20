package com.project.plateforme_dannotation_collaborative.Dto.Annotator;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@AllArgsConstructor
public class TaskInfoDto {
    Long id;
    Date limitDate;
    Double advancement ;
    Integer rowCount ;
    String dataset ;
    Integer totalRows ;
    Date startDate ;
    String description ;
}
