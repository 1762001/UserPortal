package com.publicissapient.usersearch.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String ssn;
    private Integer age;
    private String role;
    private String image;
}
