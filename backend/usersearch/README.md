# User Search Backend (Spring Boot)

This is the backend for the User Search application, built with Spring Boot. It loads user data from an external dataset into an in-memory H2 database and provides REST APIs to search and retrieve users based on different criteria.

## Overview

* Loads user data from [https://dummyjson.com/users](https://dummyjson.com/users) into H2.
* Exposes APIs to:

    * Load all users from the external source.
    * Fetch all users from the database.
    * Search users by first name, last name, or SSN.
    * Fetch a user by ID.
* Includes clean code, exception handling, structured logging, and Swagger documentation.

## Tech Stack

| Layer             | Technology                  |
| ----------------- | --------------------------- |
| Framework         | Spring Boot 3.x             |
| Database          | H2 (In-memory)              |
| ORM               | Spring Data JPA             |
| REST Client       | RestTemplate                |
| API Documentation | Springdoc OpenAPI (Swagger) |
| Build Tool        | Maven                       |
| Language          | Java 17+                    |

## Project Structure

```
src/main/java/com/publicissapient/usersearch
├── config/               # Configuration classes
├── controller/           # REST Controllers
├── exception/            # Global exception handling + custom exceptions
├── model/                # Entity classes
├── repository/           # Spring Data JPA Repositories
├── service/              # Business logic & orchestration
└── UsersearchApplication.java  # Application entry point
```

## Configuration

### application.properties

```
spring.application.name=usersearch
server.port=8080
spring.datasource.url=jdbc:h2:mem:usersdb
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.h2.console.enabled=true
spring.jpa.hibernate.ddl-auto=create
external.api.url=https://dummyjson.com/users
springdoc.api-docs.path=/api-docs
springdoc.swagger-ui.path=/swagger-ui.html
```

You can create multiple environment property files such as `application-dev.properties` or `application-prod.properties` for environment layering. Activate profiles as needed:

```
java -jar target/usersearch.jar --spring.profiles.active=dev
```

## Features

### Load Users from External API

**POST /api/users/load**

* Fetches users from the external dataset and loads them into H2.

### Get All Users

**GET /api/users/allUsers**

* Retrieves all users from the in-memory database.

### Search Users

**GET /api/users/search?query=John**

* Performs a free-text search across first name, last name, and SSN.

### Get User by ID

**GET /api/users/{id}**

* Fetches a user by their unique ID.

## Clean Code Practices

* Centralized exception handling with `@RestControllerAdvice`.
* Custom exceptions: `UserNotFoundException`, `ExternalApiException`.
* Consistent JSON error responses via `ApiErrorResponse`.
* Structured logging with SLF4J.
* Externalized configuration for easy environment management.
* Swagger integration for interactive API documentation.

## Example Error Response

```
{
  "timestamp": "2025-10-16T20:12:43.342",
  "status": 404,
  "error": "User Not Found",
  "message": "No users found matching query: abcxyz"
}
```

## Example Log Output

```
INFO  [UserController] Received request to load users from external dataset
INFO  [UserService] Successfully fetched 100 users from external API
ERROR [GlobalExceptionHandler] UserNotFoundException: No users found in the database.
```

## Swagger Documentation

After starting the application, open your browser and visit:

```
http://localhost:8080/swagger-ui.html
```

You will see all endpoints including:

* /api/users/load
* /api/users/allUsers
* /api/users/search
* /api/users/{id}

## Testing

To run the application:

```
mvn clean install
mvn spring-boot:run
```

Test endpoints using Postman or curl:

```
curl -X POST http://localhost:8080/api/users/load
curl http://localhost:8080/api/users/allUsers
curl http://localhost:8080/api/users/search?query=John
curl http://localhost:8080/api/users/1
```

## Accessing H2 Database

Open your browser and go to:

```
http://localhost:8080/h2-console
```

Then use these settings:

* JDBC URL: jdbc:h2:mem:usersdb
* User Name: sa
* Password: (leave blank)

## Sample User Response

```
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@demo.com",
    "age": 30,
    "role": "Admin",
    "ssn": "1234"
  }
]
```

## Key Highlights

| Area                 | Description                                       |
| -------------------- | ------------------------------------------------- |
| Exception Handling   | Centralized with descriptive messages             |
| Environment Layering | Separate profiles for dev and prod                |
| Logging              | Structured, meaningful log statements             |
| Search               | Free-text search on multiple user attributes      |
| Modular Design       | Follows Controller → Service → Repository pattern |
| Swagger Docs         | Automatically generated interactive documentation |
| Testing Ready        | Supports JUnit and Mockito for unit testing       |

## Author

Ashwini Kumar
Java Full Stack Developer — Spring Boot, Angular, GCP

