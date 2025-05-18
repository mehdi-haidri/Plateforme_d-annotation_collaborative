package com.project.plateforme_dannotation_collaborative;

import com.project.plateforme_dannotation_collaborative.Model.Admin;
import com.project.plateforme_dannotation_collaborative.Model.Annotator;
import com.project.plateforme_dannotation_collaborative.Model.Role;
import com.project.plateforme_dannotation_collaborative.Repository.RoleRepository;
import com.project.plateforme_dannotation_collaborative.Repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
@RequiredArgsConstructor
public class PlateformeDAnnotationCollaborativeApplication implements CommandLineRunner {
    private  final UserRepository userRepository;
    private final RoleRepository repository;
    private final RoleRepository roleRepository;

    public static void main(String[] args) {
        SpringApplication.run(PlateformeDAnnotationCollaborativeApplication.class, args);


    }
    @Override
    public void run(String[] args) {

        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
        Role role1 = new Role();
        role1.setName("ROLE_ADMIN");
        Role role2 = new Role();
        role2.setName("ROLE_ANNOTATOR");
        roleRepository.save(role1);
        roleRepository.save(role2);


        Annotator annotator1 = new Annotator();
        annotator1.setForAnnotator("11111111");
        annotator1.setFirstName("mehdi");
        annotator1.setLastName("haidri");
        annotator1.setEmail("11@gmail.com");
        annotator1.setPassword(encoder.encode("1234567"));
        annotator1.setRole(role2);
        annotator1.setState(true);
        userRepository.save( annotator1);


        Annotator annotator2 = new Annotator();
        annotator2.setForAnnotator("2222222");
        annotator2.setFirstName("2222222");
        annotator2.setRole(role2);
        annotator2.setEmail("22@gmail.com");
        annotator2.setPassword(encoder.encode("1234567"));
        annotator2.setState(true);
        userRepository.save( annotator2);

        Annotator annotator3 = new Annotator();
        annotator3.setForAnnotator("333333333");
        annotator3.setFirstName("333333333");
        annotator3.setEmail("333333333@dddd.com");
        annotator3.setState(true);
        annotator3.setRole(role2);
        userRepository.save( annotator3);

        Admin admin1 = new Admin();
        admin1.setFirstName("admin1");
        admin1.setLastName("admin1");
        admin1.setEmail("admin1@gmail.com");
        admin1.setPassword(encoder.encode("1234567"));
        admin1.setRole(role1);
        userRepository.save( admin1);
    }




}
