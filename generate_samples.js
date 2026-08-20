import * as XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';

// Create sample Excel
const ws_data = [
  { question: "Thủ đô Việt Nam là gì?", answer_a: "Hà Nội", answer_b: "Huế", answer_c: "Đà Nẵng", answer_d: "TP.HCM", correct_answer: "A", time: 30, score: 100, category: "Địa lý", difficulty: "easy", explanation: "Hà Nội là thủ đô Việt Nam" },
  { question: "1 + 1 bằng bao nhiêu?", answer_a: "1", answer_b: "2", answer_c: "3", answer_d: "4", correct_answer: "B", time: 20, score: 100, category: "Toán", difficulty: "easy", explanation: "Kết quả là 2" }
];
const ws = XLSX.utils.json_to_sheet(ws_data);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Questions");
const excelBuffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync(path.join('public', 'sample.xlsx'), excelBuffer);
