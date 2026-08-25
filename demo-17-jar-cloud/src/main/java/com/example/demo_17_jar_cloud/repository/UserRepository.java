package com.example.demo_17_jar_cloud.repository;

import com.example.demo_17_jar_cloud.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
