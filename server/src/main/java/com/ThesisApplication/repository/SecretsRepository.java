package com.ThesisApplication.repository;

import com.ThesisApplication.DTOClasses.SecretsDTO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecretsRepository extends JpaRepository<SecretsDTO, String> {

    List<SecretsDTO> findAllByOrderByTypeAsc();
}
