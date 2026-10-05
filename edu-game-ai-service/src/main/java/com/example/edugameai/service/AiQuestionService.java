package com.example.edugameai.service;

import com.example.edugameai.dto.QuestionRequest;
import com.example.edugameai.dto.QuestionResponse;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.PromptTemplate;
import org.springframework.ai.converter.BeanOutputConverter;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class AiQuestionService {

    private final ChatClient chatClient;

    public AiQuestionService(ChatClient.Builder chatClientBuilder) {
        this.chatClient = chatClientBuilder.build();
    }

    public QuestionResponse generateQuestions(QuestionRequest request) {
        BeanOutputConverter<QuestionResponse> converter = new BeanOutputConverter<>(QuestionResponse.class);

        String promptText = """
                Bạn là một giáo viên chuyên nghiệp. Hãy tạo các câu hỏi trắc nghiệm dựa trên yêu cầu sau:
                Môn học: {subject}
                Lớp: {grade}
                Chủ đề: {topic}
                Độ khó: {difficulty}
                Số lượng: {quantity}
                
                {format}
                """;

        PromptTemplate template = new PromptTemplate(promptText);
        template.add("subject", request.getSubject());
        template.add("grade", request.getGrade());
        template.add("topic", request.getTopic());
        template.add("difficulty", request.getDifficulty());
        template.add("quantity", request.getQuantity());
        template.add("format", converter.getFormat());

        String response = chatClient.prompt(template.create()).call().content();
        
        return converter.convert(response);
    }
}
