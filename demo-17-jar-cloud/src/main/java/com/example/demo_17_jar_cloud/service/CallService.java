package com.example.demo_17_jar_cloud.service;

import com.example.demo_17_jar_cloud.model.ApiProperties;
import com.example.demo_17_jar_cloud.model.User;
import com.example.demo_17_jar_cloud.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Arrays;
import java.util.List;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
public class CallService {

    private final ApiProperties apiProperties;
    private final RestClient restClient;
    private final UserRepository userRepository;

    public String callOkEndpoint() {
        String url = apiProperties.getUrl() + "/ok";
        log.info("Calling endpoint at: {}", url);
        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }

    public String callErrorEndpoint() {
        String url = apiProperties.getUrl() + "/err";
        log.info("Calling error endpoint at: {}", url);
        return restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
    }

    public String callRandomEndpoint() {
        String url = apiProperties.getUrl() + "/random";
        log.info("Calling random endpoint at: {}", url);
        var random = restClient.get()
                .uri(url)
                .retrieve()
                .body(String.class);
        return getUsers().stream().filter(x -> Objects.equals(x.getId(), random)).map(x -> x.getName()).findFirst().orElseThrow();
    }

    private List<User> getUsers() {
        var users = userRepository.findAll();
        if (users.isEmpty()) {
            log.warn("No USER found in the database.");
            users = Arrays.asList(
                    User.builder().id("1").name("Alice").build(),
                    User.builder().id("2").name("Bob Gosh Whale").build(),
                    User.builder().id("3").name("Charles Liz").build()
            );
            userRepository.saveAll(users);
        }
        return users;
    }
}
