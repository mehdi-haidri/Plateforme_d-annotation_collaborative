package com.project.plateforme_dannotation_collaborative.Exception;

import org.springframework.core.MethodParameter;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;

import java.util.HashMap;

public class CustomhandleMethodArgumentNotValidException extends  RuntimeException {

    private  HashMap <String  , String> fieldError;
    public CustomhandleMethodArgumentNotValidException(HashMap <String ,String> fieldError) {
        this.fieldError = fieldError;
    }
    final public HashMap <String  , String> getFieldError() {
        return fieldError;
    }

}
