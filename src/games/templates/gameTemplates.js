// Nơi lưu trữ danh sách các template tĩnh (hoặc mock API) và hàm đăng ký
// Sau này có thể chuyển sang fetch từ API

const gameTemplates = [
  {
    id: "duoi-hinh-bat-chu",
    name: "Đuổi Hình Bắt Chữ",
    slug: "duoi-hinh-bat-chu",
    type: "canvas",
    version: 1,
    description: "Trò chơi nhìn hình đoán chữ kinh điển.",
    canvas: {
      width: 1200,
      height: 800,
      background: "#FFF6E7"
    },
    customizable: {
      canvasBackground: true,
      elements: {
        text: true,
        image: true,
        shape: true,
        button: true,
        // Template specific
        "question-text": { position: true, font: true, color: true, size: true },
        "question-image": { position: true, size: true, radius: true },
        "answer-input": { position: true, size: true, font: true, color: true },
        "timer": { position: true, size: true, color: true, font: true },
        "score": { position: true, size: true, color: true, font: true }
      }
    },
    // Default design elements when creating a new game from this template
    elements: [
      {
        id: "title-text",
        type: "text",
        x: 400,
        y: 40,
        width: 400,
        height: 60,
        zIndex: 1,
        properties: { text: "ĐUỔI HÌNH BẮT CHỮ", fontSize: 40, fontWeight: 800, align: "center", color: "#E4572E" }
      },
      {
        id: "question-image",
        type: "game-component",
        component: "QuestionImage",
        x: 300,
        y: 120,
        width: 600,
        height: 400,
        zIndex: 2,
        properties: { radius: 16 }
      },
      {
        id: "question-text",
        type: "game-component",
        component: "QuestionText",
        x: 200,
        y: 540,
        width: 800,
        height: 60,
        zIndex: 3,
        properties: { fontSize: 24, fontWeight: 600, align: "center", color: "#1D2E4A" }
      },
      {
        id: "answer-input",
        type: "game-component",
        component: "AnswerInput",
        x: 200,
        y: 620,
        width: 800,
        height: 80,
        zIndex: 4,
        properties: { gap: 12 }
      },
      {
        id: "timer-display",
        type: "game-component",
        component: "TimerDisplay",
        x: 40,
        y: 40,
        width: 120,
        height: 60,
        zIndex: 5,
        properties: { color: "#E4572E", fontSize: 36, fontWeight: 700 }
      },
      {
        id: "score-display",
        type: "game-component",
        component: "ScoreDisplay",
        x: 1040,
        y: 40,
        width: 120,
        height: 60,
        zIndex: 6,
        properties: { color: "#1B998B", fontSize: 36, fontWeight: 700 }
      }
    ],
    gameConfig: {}
  },
  {
    id: "trac-nghiem",
    name: "Trắc Nghiệm (Quiz)",
    slug: "trac-nghiem",
    type: "canvas",
    version: 1,
    description: "Trò chơi trắc nghiệm chọn 1 đáp án đúng.",
    canvas: {
      width: 1200,
      height: 800,
      background: "#F4F7F6"
    },
    customizable: {
      canvasBackground: true,
      elements: {
        text: true,
        image: true,
        shape: true,
        button: true,
        "question": { position: true, size: true, font: true, color: true },
        "answer": { position: true, size: true, font: true, color: true }
      }
    },
    elements: [
      {
        id: "question-display",
        type: "question",
        x: 100,
        y: 100,
        width: 1000,
        height: 150,
        zIndex: 1,
        properties: { fontSize: 36, fontWeight: 700, align: "center", color: "#1D2E4A" }
      },
      {
        id: "answer-options",
        type: "answer",
        x: 100,
        y: 350,
        width: 1000,
        height: 300,
        zIndex: 2,
        properties: { columns: 2, gap: 20 }
      }
    ],
    gameConfig: {}
  }
];

class TemplateRegistry {
  constructor() {
    this.templates = new Map();
    gameTemplates.forEach(t => this.templates.set(t.id, t));
  }

  register(template) {
    this.templates.set(template.id, template);
  }

  get(id) {
    return this.templates.get(id);
  }

  getAll() {
    return Array.from(this.templates.values());
  }
}

export const gameTemplateRegistry = new TemplateRegistry();
