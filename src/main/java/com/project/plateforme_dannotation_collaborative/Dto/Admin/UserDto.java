package com.project.plateforme_dannotation_collaborative.Dto.Admin;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.validator.constraints.Length;

@Getter
@Setter
@ToString
public class UserDto {
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
    @Length(min = 5, max = 20)
    String password ;
    @NotBlank
    String role;
}
