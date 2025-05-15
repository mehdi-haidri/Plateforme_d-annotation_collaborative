package com.project.plateforme_dannotation_collaborative.handler;


import com.project.plateforme_dannotation_collaborative.Controller.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.HashMap;

@ControllerAdvice
public class GlobalExeptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {

        HashMap<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error ).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        Response response  = new Response();
        response.setError(true);
        response.getData().put("errorType" , "validation");
        response.getData().put("errors" , errors);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
