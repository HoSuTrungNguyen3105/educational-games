package com.example.edugameai.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/** Response của endpoint cũ {@code POST /api/ai/generate-question}. Giữ nguyên shape. */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuestionResponse {
    private List<QuestionDto> questions;
}