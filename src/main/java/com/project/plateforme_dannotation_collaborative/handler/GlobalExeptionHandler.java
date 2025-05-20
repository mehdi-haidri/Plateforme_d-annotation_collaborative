package com.project.plateforme_dannotation_collaborative.handler;


import com.project.plateforme_dannotation_collaborative.Controller.Response;
import com.project.plateforme_dannotation_collaborative.Exception.CustomeJwtValidityException;
import com.project.plateforme_dannotation_collaborative.Exception.CustomhandleMethodArgumentNotValidException;

import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;

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

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        Throwable cause = ex.getCause();
        if (cause instanceof ConstraintViolationException) {
            ConstraintViolationException consEx = (ConstraintViolationException) cause;
            if ("23505".equals(consEx.getSQLState())) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Duplicate entry error: unique constraint violated");
            }
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Database error occurred.");
    }

    @ExceptionHandler(CustomhandleMethodArgumentNotValidException.class)
    public ResponseEntity<?> customHandleMethodArgumentNotValidException(CustomhandleMethodArgumentNotValidException ex) {
       Response response = new Response();
       response.setError(true);
        response.getData().put("errorType" , "validation");
        response.getData().put("errors" , ex.getFieldError());
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomeJwtValidityException.class)
    public  ResponseEntity<?> customeJwtValidityException(CustomeJwtValidityException ex) {
        Response response = new Response();
        response.setError(true);
        response.getData().put("errorType" , "auth");
        response.getData().put("error" , ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.UNAUTHORIZED);
    }
}
