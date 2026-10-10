package com.example.edugameai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

import com.example.edugameai.config.AiProperties;
import com.example.edugameai.config.CoreApiProperties;

@SpringBootApplication
@EnableConfigurationProperties({ AiProperties.class, CoreApiProperties.class })
public class EduGameAiServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(EduGameAiServiceApplication.class, args);
	}

}