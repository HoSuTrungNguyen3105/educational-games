package com.example.edugameai.dto;

import java.util.List;
import lombok.Data;

@Data
public class QuestionResponse {
    private List<QuestionDto> questions;
}
