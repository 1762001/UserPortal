package com.publicissapient.usersearch.controller;

import com.publicissapient.usersearch.exception.UserNotFoundException;
import com.publicissapient.usersearch.model.User;
import com.publicissapient.usersearch.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.hibernate.query.Page;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
@Tag(name = "Users API", description = "Manage and Search Users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Operation(summary = "Load users from external dataset into H2 DB")
    @PostMapping("/load")
    public ResponseEntity<String> loadUsers() {
        logger.info("Received request to load users from external dataset");
        return ResponseEntity.ok(userService.loadUsersFromExternal());
    }

    @Operation(summary = "Search users by free text (firstName, lastName, SSN)")
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam("query") String query) {
        logger.info("Searching users with query: {}", query);
        List<User> results = userService.searchUsers(query);
        if (results.isEmpty()) {
            throw new UserNotFoundException("No users found matching query: " + query);
        }
        return ResponseEntity.ok(results);
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<User> getById(@PathVariable Long id) {
        logger.info("Fetching user by ID: {}", id);
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @Operation(summary = "Get user by Email")
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/allusers")
    public ResponseEntity<List<User>> getAllUsers(@RequestParam(defaultValue = "0")  int pageNumber) {

        return ResponseEntity.ok(userService.getAllUsers(pageNumber));
    }

}

