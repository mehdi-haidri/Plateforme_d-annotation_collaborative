package com.project.plateforme_dannotation_collaborative.Controller;


import com.project.plateforme_dannotation_collaborative.Dto.Admin.AnnotatorsMinResponseDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.UserDto;
import com.project.plateforme_dannotation_collaborative.Dto.Admin.UserUpdateDto;
import com.project.plateforme_dannotation_collaborative.Dto.UserLoginDto;
import com.project.plateforme_dannotation_collaborative.Exception.CustomhandleMethodArgumentNotValidException;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Repository.UserLoginEventRepository;
import com.project.plateforme_dannotation_collaborative.Service.AnnotatorSevice;
import com.project.plateforme_dannotation_collaborative.Service.UserSevice;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/app/v1/users")
@RequiredArgsConstructor
@CrossOrigin(originPatterns = "*")
public class UserController {
    private final UserSevice userSevice;
    private final AnnotatorSevice annotatorSevice;
    @PostMapping("/addUser")
    public ResponseEntity<?> addUser(@Valid @RequestBody UserDto user) throws CustomhandleMethodArgumentNotValidException {

        Response response  = new Response();

             userSevice.saveUser(user);

            response.setError(false);
            response.getData().put("message" , "added successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);

    }

    @PostMapping("/annotator/update")
    public ResponseEntity<?> annotatorUpdate(@Valid @RequestBody UserUpdateDto user)  {
        Response response  = new Response();
        response.setError(false);
        userSevice.updateUser(user);
        response.getData().put("message" , "annotator updated successfully");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/annotators/{state}")
    public ResponseEntity<?> getAnnotators( @PathVariable Boolean state){
        System.out.println(state);
        Response response  = new Response();
        List<AnnotatorsMinResponseDto> annotators = annotatorSevice.getAnnotatorsByState(state);
        response.setError(false);
        response.getData().put("annotators" , annotators);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    @GetMapping("/annotators")
    public ResponseEntity<?> getAnnotators( ){
        Response response  = new Response();
        List<AnnotatorsMinResponseDto> annotators = annotatorSevice.getAllAnnotators();
        response.setError(false);
        response.getData().put("annotators" , annotators);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/annotators/annotator/{id}")
    public ResponseEntity<?> getAnnotator(@PathVariable Long id){
        Response response  = new Response();
        response.setError(false);
        AnnotatorsMinResponseDto annotator = annotatorSevice.getAnnotatorDtoById(id);
        response.getData().put("annotator" , annotator);
        return  new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UserLoginDto user) {
        Response response = userSevice.verify(user);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDto user) throws CustomhandleMethodArgumentNotValidException {
        return addUser(user);
    }
    @GetMapping("/isAuth")
    public ResponseEntity<?> isAuth() {
        Response response  = new Response();
        response.setError(false);
        response.getData().put("isAuth" , "true");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/annotators/toggleActivation/{id}")
    public ResponseEntity<?> deactivate(@PathVariable Long id){
        Response response  = new Response();
        response.setError(false);
        Annotator annotator =   annotatorSevice.getAnnotatorById(id);
        annotator.setState(!annotator.getState());
        annotatorSevice.save(annotator);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
