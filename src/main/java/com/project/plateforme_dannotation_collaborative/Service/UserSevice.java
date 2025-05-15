package com.project.plateforme_dannotation_collaborative.Service;


import com.project.plateforme_dannotation_collaborative.Dto.UserDto;
import com.project.plateforme_dannotation_collaborative.Dto.UserLoginDto;
import com.project.plateforme_dannotation_collaborative.Jwt.Service.JWTService;
import com.project.plateforme_dannotation_collaborative.Model.Admin;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Model.Role;
import com.project.plateforme_dannotation_collaborative.Model.User;
import com.project.plateforme_dannotation_collaborative.Repository.AnnotatorRepository;
import com.project.plateforme_dannotation_collaborative.Repository.RoleRepository;
import com.project.plateforme_dannotation_collaborative.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserSevice {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AnnotatorRepository annotatorRepository;


    private final JWTService jwtService;
    private  final AuthenticationManager authManager;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    private User DToToUser(UserDto userDto) {
        Role userRole = roleRepository.findByName(userDto.getRole()).orElse(null);
        if(userRole == null) {
            System.out.println(userDto.getRole());
            return null;
        }
        if(userRole.getName().equals("ROLE_ADMIN")) {
            Admin user = new Admin();
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());
            user.setRole(userRole);
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            return user;
        }
        else if(userRole.getName().equals("ROLE_ANNOTATOR")) {
            Annotator user = new Annotator();
            user.setEmail(userDto.getEmail());
            user.setPassword(userDto.getPassword());
            user.setRole(userRole);
            user.setFirstName(userDto.getFirstName());
            user.setLastName(userDto.getLastName());
            return user;
        }
        return null;
    }
    public User saveUser(UserDto userDto) throws Exception {
        User user = DToToUser(userDto);
        user.setPassword(encoder.encode(user.getPassword()));
        if(user != null) {
            return userRepository.save(user);
        }
        throw new Exception("eeee");

    }

    public List<Annotator>  findAllAnnotatorsById(List<Long> ids) {
        return  annotatorRepository.findAllById(ids);
    }

    public void updateUser(UserDto user) {
        User userToUpdate = DToToUser(user);
        user.setPassword(encoder.encode(user.getPassword()));
        if(userToUpdate != null) userRepository.save(userToUpdate);
    }

    public String verify(UserLoginDto user) {
        Authentication authentication = authManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
        if (authentication.isAuthenticated()) {
            String role = userRepository.findByEmail(user.getUsername()).getRole().getName();
            List <String> roles = List.of(role);
            return jwtService.generateToken(user.getUsername() , roles);
        } else {
            return "fail";
        }
    }

}
