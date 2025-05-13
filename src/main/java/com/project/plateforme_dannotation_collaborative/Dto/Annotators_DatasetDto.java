package com.project.plateforme_dannotation_collaborative.Dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Getter
@Setter
public class Annotators_DatasetDto {
    List<Long>Annotators;
    Long datasetId ;
}
