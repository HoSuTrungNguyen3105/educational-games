// ===== DATA: nạp + kiểm tra dữ liệu câu hỏi/bài thi (mặc định từ data/questions.js, hoặc bản bạn sửa trong game) =====
let DATA=null;
const DEF_DATA=()=>JSON.parse(JSON.stringify(QUESTION_DATA)); // lấy từ data/questions.js
const ST=()=>Object.assign({questionsPerLesson:3,coinsPerCorrect:8,xpPerCorrect:6,energyPerLesson:10,energyPerExam:15},DATA.settings||{});
function vq(q,w){return(!q||typeof q.q!="string"||!Array.isArray(q.options)||q.options.length<2||!Number.isInteger(q.answer)||q.answer<0||q.answer>=q.options.length)?"Câu hỏi sai định dạng ở "+w+" (cần q, options[], answer là số thứ tự bắt đầu từ 0)":""}
function vd(d){if(!d||typeof d!="object"||!d.subjects)return "Thiếu mục subjects";
 for(const k of KS){const s=d.subjects[k];if(!s)return "Thiếu môn "+k;if(!["math","vocab","quiz"].includes(s.mode))return "Môn "+k+": mode phải là math, vocab hoặc quiz";
  if(s.mode=="vocab"&&!(s.vocab||[]).length)return "Môn "+k+" thiếu vocab";
  if(s.mode=="quiz"){if(!(s.questions||[]).length)return "Môn "+k+" thiếu questions";for(let i=0;i<s.questions.length;i++){const e=vq(s.questions[i],k+" #"+(i+1));if(e)return e}}}
 for(const e of d.exams||[]){if(!e.id||!KS.includes(e.subject)||!(e.questions||[]).length)return "Bài thi thiếu id / subject / questions";for(let i=0;i<e.questions.length;i++){const r=vq(e.questions[i],e.id+" #"+(i+1));if(r)return r}}
 return ""}
function loadData(){DATA=DEF_DATA();try{const c=localStorage.getItem("tvv_data");if(c){const x=JSON.parse(c);if(!vd(x))DATA=x}}catch(e){}}
