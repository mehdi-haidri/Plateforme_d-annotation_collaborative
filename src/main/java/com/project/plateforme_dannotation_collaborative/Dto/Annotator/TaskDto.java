package com.project.plateforme_dannotation_collaborative.Dto.Annotator;

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
    Integer rowCount ;
    String dataset ;
    Date startDate ;
}
