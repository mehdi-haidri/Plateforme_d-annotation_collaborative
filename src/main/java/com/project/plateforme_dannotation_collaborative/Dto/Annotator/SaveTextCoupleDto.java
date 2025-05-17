package com.project.plateforme_dannotation_collaborative.Dto.Annotator;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SaveTextCoupleDto {
    private Long textCoupleId;
    private String classe ;
    private Integer index;
}
