package com.blasty;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class BlastyApplication {

	public static void main(String[] args) {
		SpringApplication.run(BlastyApplication.class, args);
	}

}
