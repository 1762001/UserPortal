package com.publicissapient.usersearch.controller;

import com.publicissapient.usersearch.model.User;
import com.publicissapient.usersearch.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAllUsers() {
        User user = new User(1L, "Ashwini", "Doe", "john@example.com", "1234", 25, "Admin", "");
        when(userService.getAllUsers(0)).thenReturn(List.of(user));

        ResponseEntity<List<User>> response = userController.getAllUsers(0);
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
        verify(userService, times(1)).getAllUsers(0);
    }

    @Test
    void testGetUserById() {
        User user = new User(1L, "Ashwini", "Doe", "john@example.com", "1234", 25, "Admin", "");
        when(userService.getUserById(1L)).thenReturn(Optional.of(user));
        ResponseEntity<User> response = userController.getById(1L);
        assertNotNull(response.getBody());
        assertEquals("Ashwini", response.getBody().getFirstName());
    }

    @Test
    void testSearchUsers() {
        User user = new User(1L, "Ashwini", "Doe", "john@example.com", "1234", 25, "Admin", "");
        when(userService.searchUsers("Jo")).thenReturn(List.of(user));
        ResponseEntity<List<User>> response = userController.searchUsers("Jo");
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());

    }
}
