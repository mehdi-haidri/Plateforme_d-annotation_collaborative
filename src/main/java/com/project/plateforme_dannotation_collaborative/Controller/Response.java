package com.project.plateforme_dannotation_collaborative.Controller;

import lombok.Getter;
import lombok.Setter;

import java.util.HashMap;


@Getter
@Setter
public class Response {
    boolean error ;
    HashMap<String ,Object> data = new HashMap<>(); ;
}
