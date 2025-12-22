package com.publicissapient.usersearch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.publicissapient.usersearch.exception.UserNotFoundException;
import com.publicissapient.usersearch.model.User;
import com.publicissapient.usersearch.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    void setup() {
        userService.setExternalApiUrl("https://dummyjson.com/users");
    }

    @Test
    void testLoadUsersFromExternal_Success() throws Exception {
        String mockJson = """
            {
              "users": [
                {"id": 1, "firstName": "Ashwini", "lastName": "Kumar", "email": "ash@example.com", "ssn": "123", "age": 28, "role": "Admin", "image" : " "}
              ]
            }
        """;

        ObjectMapper mapper = new ObjectMapper();
        JsonNode mockNode = mapper.readTree(mockJson);
        when(restTemplate.getForEntity(anyString(), eq(JsonNode.class)))
                .thenReturn(new ResponseEntity<>(mockNode, HttpStatus.OK));

        String result = userService.loadUsersFromExternal();

        assertEquals("Users loaded successfully!", result);
        verify(userRepository, times(1)).saveAllAndFlush(anyList());
    }

    @Test
    void testFallbackLoadUsers() {
        String result = userService.fallbackLoadUsers(new RuntimeException("API down"));
        assertTrue(result.contains("Failed to load users"));
    }
    @Test
    void testGetAllUsers_Success() {
        List<User> mockUsers = List.of(
                new User(1L, "Ashwini", "Kumar", "ash@example.com", "123", 28, "Admin", "")
        );

        when(userRepository.findAll()).thenReturn(mockUsers);

        List<User> result = userService.getAllUsers();

        assertEquals(1, result.size());
        assertEquals("Ashwini", result.get(0).getFirstName());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void testGetAllUsers_ThrowsExceptionWhenEmpty() {
        when(userRepository.findAll()).thenReturn(new ArrayList<>());

        assertThrows(UserNotFoundException.class, () -> userService.getAllUsers());
    }

    @Test
    void testSearchUsers() {
        String query = "Ash";
        List<User> mockList = List.of(
                new User(1L, "Ashwini", "Kumar", "ash@example.com", "123", 28, "Admin", "")
        );

        when(userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrSsnContainingIgnoreCase(query, query, query))
                .thenReturn(mockList);

        List<User> result = userService.searchUsers(query);

        assertEquals(1, result.size());
        verify(userRepository, times(1))
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrSsnContainingIgnoreCase(query, query, query);
    }

    @Test
    void testGetUserById_Success() {
        User mockUser = new User(1L, "Ashwini", "Kumar", "ash@example.com", "123", 28, "Admin", "");
        when(userRepository.findById(1L)).thenReturn(Optional.of(mockUser));

        Optional<User> result = userService.getUserById(1L);

        assertTrue(result.isPresent());
        assertEquals("Ashwini", result.get().getFirstName());
    }

    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(UserNotFoundException.class, () -> userService.getUserById(99L));
    }


    @Test
    void testGetUserByEmail() {
        User user = new User(1L, "Ashwini", "Kumar", "ash@example.com", "123", 28, "Admin", "");
        when(userRepository.findByEmail("ash@example.com")).thenReturn(Optional.of(user));

        Optional<User> result = userService.getUserByEmail("ash@example.com");

        assertTrue(result.isPresent());
        assertEquals("Ashwini", result.get().getFirstName());
    }
}
