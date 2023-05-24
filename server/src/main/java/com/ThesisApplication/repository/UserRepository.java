package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.UserDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<UserDAO, String> {

    List<UserDAO> findByEmailAndPassword(String email, String password);

    List<UserDAO> findByEmailAndRole(String email, String role);
}
