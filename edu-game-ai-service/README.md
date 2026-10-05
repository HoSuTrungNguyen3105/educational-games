# Edu Game AI Service

## Project Overview
This is the Java Spring Boot AI Service for the Edu Game system. It is responsible for handling AI-related features such as generating questions, explaining answers, and analyzing learning results without impacting the existing Node.js backend.

## Architecture
```text
React Edu Game -> Existing Node.js Backend
React Edu Game -> Java AI Service -> Spring AI -> Ollama / LLM -> PostgreSQL (pgvector)
```

## Tech Stack
- Java 21
- Spring Boot 3.4.1
- Spring AI
- Maven
- Ollama
- Lombok

## Features
- Generate educational questions using AI
- Extensible AI provider architecture

## API Documentation
### POST /api/ai/generate-question
Generates multiple-choice questions based on learning criteria.

**Request:**
```json
{
  "subject": "Toán",
  "grade": 5,
  "topic": "Phân số",
  "difficulty": "medium",
  "quantity": 10
}
```

**Response:**
```json
{
  "questions": [
    {
      "content": "Phân số nào bằng 1/2?",
      "options": [
        "2/4",
        "3/4",
        "1/3",
        "4/5"
      ],
      "correctAnswer": "2/4",
      "points": 10
    }
  ]
}
```

## Local Setup
1. Install Java 21 and Maven.
2. Clone the repository.
3. Start Ollama and download the model (`ollama run llama3`).
4. Run the application: `mvn spring-boot:run`.
