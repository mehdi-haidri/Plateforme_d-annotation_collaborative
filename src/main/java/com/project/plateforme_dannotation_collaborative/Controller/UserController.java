package com.project.plateforme_dannotation_collaborative.Controller;


import com.project.plateforme_dannotation_collaborative.Dto.UserDto;
import com.project.plateforme_dannotation_collaborative.Model.User;
import com.project.plateforme_dannotation_collaborative.Service.UserSevice;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/app/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserSevice userSevice;
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@RequestBody UserDto user){

        Response response  = new Response();
        try {
            User newUser = userSevice.saveUser(user);
            response.setError(false);
            response.getData().put("user" , newUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
        }catch (Exception e){
            response.setError(true);
            response.getData().put("error" , e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
