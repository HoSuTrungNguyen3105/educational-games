package com.example.edugameai.dto;

import java.util.List;
import lombok.Data;

@Data
public class QuestionDto {
    private String content;
    private List<String> options;
    private String correctAnswer;
    private int points;
}
