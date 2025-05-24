package com.project.plateforme_dannotation_collaborative.Dto.Admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;


@Getter
@Setter
public class DatasetRequestDto {

    @NotBlank
    private String name;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    @NotNull
    private Date datelimit;

    @NotBlank
    private String description;

    @NotBlank
    @NotNull
    private String classes;

    @NotBlank
    private String annotators;

    @NotNull
    private MultipartFile file;

    // Getters & setters
}
