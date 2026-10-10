package com.example.edugameai.dto;

import java.util.List;

import lombok.Data;

/** Response của endpoint cũ {@code POST /api/ai/generate-question}. Giữ nguyên shape. */
@Data
public class QuestionResponse {
    private List<QuestionDto> questions;
}