package org.example.commonservice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Random;

@RestController
@Slf4j
public class Controller {

    @GetMapping("ok")
    public String ok() {
        log.info("Everything is okay");
        return "OK";
    }

    @GetMapping("err")
    public String error() {
        log.error("Error occurred !!!");
        throw new RuntimeException("ERROR");
    }

    @GetMapping("random")
    public int random() {
        int random = new Random().nextInt(1, 6);
        if (random > 3) {
            log.warn("Random number is greater than 3: {}", random);
        }
        return random;
    }
}
