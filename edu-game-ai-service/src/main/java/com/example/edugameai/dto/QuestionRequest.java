package com.example.edugameai.dto;

import lombok.Data;

/** Yêu cầu của endpoint cũ {@code POST /api/ai/generate-question}. Giữ nguyên shape. */
@Data
public class QuestionRequest {
    private String subject;
    private int grade;
    private String topic;
    private String difficulty;
    private int quantity;
}