package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.UserDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<UserDTO, String> {

    List<UserDTO> findByEmailAndPassword(String email, String password);

    List<UserDTO> findByEmailAndRole(String email, String role);
}
