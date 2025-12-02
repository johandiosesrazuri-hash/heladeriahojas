package com.choccoDelight;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class ChoccoDelightApplication {

    public static void main(String[] args) {
        SpringApplication.run(ChoccoDelightApplication.class, args);
    }

}
