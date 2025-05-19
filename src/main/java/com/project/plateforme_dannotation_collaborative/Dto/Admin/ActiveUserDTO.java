package com.project.plateforme_dannotation_collaborative.Dto.Admin;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ActiveUserDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Boolean status;
}
