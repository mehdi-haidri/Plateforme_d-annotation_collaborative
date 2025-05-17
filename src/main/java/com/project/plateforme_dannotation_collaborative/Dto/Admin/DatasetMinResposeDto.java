package com.project.plateforme_dannotation_collaborative.Dto.Admin;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;



@AllArgsConstructor
@Getter
@Setter
public class DatasetMinResposeDto  {
    Long id;
    String name;
    String description;
    Double advancement ;
    Boolean annotated ;
    Integer size ;
    Integer numberClasses;
}
