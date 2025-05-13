package com.project.plateforme_dannotation_collaborative.Dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class AnnotatorsMinResponseDto {
    Long id;
    String lastName;
    String firstName;
    Boolean state ;
}
