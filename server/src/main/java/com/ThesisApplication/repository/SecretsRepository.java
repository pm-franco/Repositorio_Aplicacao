package com.ThesisApplication.repository;

import com.ThesisApplication.DAO_Classes.SecretsDAO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecretsRepository extends JpaRepository<SecretsDAO, String> {

    List<SecretsDAO> findAllByOrderByTypeAsc();
}
