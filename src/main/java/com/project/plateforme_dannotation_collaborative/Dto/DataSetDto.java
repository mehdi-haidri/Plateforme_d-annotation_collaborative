package com.project.plateforme_dannotation_collaborative.Dto;


import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Getter
@Setter
public class DataSetDto {
    Date datelimit;
    String name;
    String description ;
    MultipartFile file ;
    List<String> classes ;
    List<Long> annotators ;
}
