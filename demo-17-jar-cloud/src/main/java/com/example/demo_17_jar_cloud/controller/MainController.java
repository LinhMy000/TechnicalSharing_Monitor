package com.example.demo_17_jar_cloud.controller;

import com.example.demo_17_jar_cloud.service.CallService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class MainController {

    private final CallService callService;

    @GetMapping
    public ResponseEntity<?> healthCheck() {
        return ResponseEntity.ok("Healthy");
    }

    @GetMapping("api1")
    public ResponseEntity<?> callOk() {
        return ResponseEntity.ok(callService.callOkEndpoint());
    }

    @GetMapping("api2")
    public ResponseEntity<?> callError() {
        return ResponseEntity.ok(callService.callErrorEndpoint());
    }

    @GetMapping("api3")
    public ResponseEntity<?> callRandom() {
        return ResponseEntity.ok(callService.callRandomEndpoint());
    }
}
