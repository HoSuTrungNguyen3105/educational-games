package com.example.edugameai.dto;

import lombok.Data;

@Data
public class QuestionRequest {
    private String subject;
    private int grade;
    private String topic;
    private String difficulty;
    private int quantity;
}
