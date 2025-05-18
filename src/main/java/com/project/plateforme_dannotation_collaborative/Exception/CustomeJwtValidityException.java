package com.project.plateforme_dannotation_collaborative.Exception;

import lombok.Getter;

@Getter
public class CustomeJwtValidityException extends RuntimeException {

    public CustomeJwtValidityException(String message) {
        super(message);
    }
}
