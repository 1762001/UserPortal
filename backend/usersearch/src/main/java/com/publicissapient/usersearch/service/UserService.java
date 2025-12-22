package com.publicissapient.usersearch.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.publicissapient.usersearch.exception.ExternalApiException;
import com.publicissapient.usersearch.exception.UserNotFoundException;
import com.publicissapient.usersearch.model.User;
import com.publicissapient.usersearch.repository.UserRepository;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.query.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;


import java.awt.print.Pageable;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    private final RestTemplate restTemplate;

    public UserService(UserRepository userRepository, RestTemplate restTemplate) {
        this.userRepository = userRepository;
        this.restTemplate = restTemplate;
    }

    @Value("${external.api.url}")
    private String externalApiUrl;

    public void setExternalApiUrl(String url){
        this.externalApiUrl = url;
    }

    @CircuitBreaker(name = "externalApi", fallbackMethod = "fallbackLoadUsers")
    @EventListener(ApplicationReadyEvent.class)
    public String loadUsersFromExternal() {
        log.info("Calling external API: {}", externalApiUrl);
        ResponseEntity<JsonNode> response = restTemplate.getForEntity(externalApiUrl, JsonNode.class);
        JsonNode usersNode = response.getBody().get("users");

        if (usersNode.isMissingNode()) {
            throw new ExternalApiException("Invalid response format from external API");
        }

        List<User> users = new ArrayList<>();
        for (JsonNode userNode : usersNode) {
            User user = new User();
            user.setId(userNode.has("id")?userNode.get("id").asLong() : 0);
            user.setFirstName(userNode.has("firstName")?userNode.get("firstName").asText() : "NA");
            user.setLastName(userNode.has("lastName")?userNode.get("lastName").asText() : "NA");
            user.setEmail(userNode.has("email")?userNode.get("email").asText() : "NA");
            user.setSsn(userNode.has("ssn")?userNode.get("ssn").asText() : "NA");
            user.setAge(userNode.has("age")?userNode.get("age").asInt() : 0);
            user.setRole(userNode.has("role")?userNode.get("role").asText() : "NA");
            user.setImage(userNode.has("image")?userNode.get("image").asText(): null);
            users.add(user);
        }

        userRepository.saveAllAndFlush(users);
        log.info("Successfully loaded {} users from external API.", users.size());

        return "Users loaded successfully!";
    }

    public String fallbackLoadUsers(Throwable t) {
        log.error("External API failed: {}", t.getMessage());
        return "Failed to load users from external API. Please try again later.";
    }

    public List<User> getAllUsers(int pageNumber){

        int pageSize = 10;
        int page = pageNumber *pageSize;


        List<User> users = userRepository.findAll();
        return users.stream().skip(page).limit(pageSize).toList();
    }

    public List<User> searchUsers(String query) {

        return userRepository.findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrSsnContainingIgnoreCase(query, query, query) .stream().limit(10).toList();
    }

    public Optional<User> getUserById(Long id) {
        return Optional.ofNullable(userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found with id " + id)));
    }

    public Optional<User> getUserByEmail( @PathVariable String email) {
        return userRepository.findByEmail(email);
    }

}

