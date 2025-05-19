package com.project.plateforme_dannotation_collaborative.Repository;

import com.project.plateforme_dannotation_collaborative.Model.Role;
import com.project.plateforme_dannotation_collaborative.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User , Long> {
    Optional<User> findByEmail(String username);
    long countByRole_Name(String roleName);
    long countByOnlineTrue();
    List<User> findByOnlineTrue();
    long countByRole(Role role);
    long countByRoleName(String roleName);  // if you have roles by name
    long countByState(Boolean status);  // for task status
    long countByRoleNameAndOnlineTrue(String roleName);


}
