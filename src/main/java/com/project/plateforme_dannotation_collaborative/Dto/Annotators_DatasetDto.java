package com.project.plateforme_dannotation_collaborative.Dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.util.Date;
import java.util.List;


@Getter
@Setter
public class Annotators_DatasetDto {
    List<Long>annotators;
    Long datasetId ;
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    Date datelimit;
}
