package com.publicissapient.usersearch.repository;

import com.publicissapient.usersearch.model.User;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrSsnContainingIgnoreCase(
            String firstName, String lastName, String ssn
    );

    Optional<User> findByEmail(String email);

    Optional<User> findByFirstName(String firstName);

//    List<User> findAll(Pageable pageable);

}
