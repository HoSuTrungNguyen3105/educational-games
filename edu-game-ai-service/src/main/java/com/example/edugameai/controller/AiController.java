package com.example.edugameai.controller;

import com.example.edugameai.dto.QuestionRequest;
import com.example.edugameai.dto.QuestionResponse;
import com.example.edugameai.service.AiQuestionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiQuestionService aiQuestionService;

    public AiController(AiQuestionService aiQuestionService) {
        this.aiQuestionService = aiQuestionService;
    }

    @PostMapping("/generate-question")
    public ResponseEntity<QuestionResponse> generateQuestion(@RequestBody QuestionRequest request) {
        QuestionResponse response = aiQuestionService.generateQuestions(request);
        return ResponseEntity.ok(response);
    }
}
