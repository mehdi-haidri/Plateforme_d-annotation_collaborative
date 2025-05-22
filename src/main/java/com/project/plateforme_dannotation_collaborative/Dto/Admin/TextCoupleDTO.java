package com.project.plateforme_dannotation_collaborative.Dto.Admin;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class TextCoupleDTO {
    Long id;
    String text1;
    String text2;
    Boolean annotated ;
    String classe;
}
