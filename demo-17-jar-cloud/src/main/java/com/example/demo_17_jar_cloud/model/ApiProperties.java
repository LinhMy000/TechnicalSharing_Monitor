package com.example.demo_17_jar_cloud.model;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "api.common-service")
public class ApiProperties {
    private String url;
}
