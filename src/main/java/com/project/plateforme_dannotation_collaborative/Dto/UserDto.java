package com.project.plateforme_dannotation_collaborative.Dto;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDto {
    Long id ;
    String lastName;
    String firstName;
    String email;
    String password;
    String role;
}
