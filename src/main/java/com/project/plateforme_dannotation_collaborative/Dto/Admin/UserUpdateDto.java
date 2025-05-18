package com.project.plateforme_dannotation_collaborative.Dto.Admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
public class UserUpdateDto {
    Long id ;
    @NotBlank
    @NotNull
    String lastName;
    @NotBlank
    @NotNull
    String firstName;
    @Email
    @NotBlank
    String email;
    String password;
}
