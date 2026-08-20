import { useState, useRef, useEffect } from 'react';
import { useQuestionImportStore } from '../../store/questionImportStore';
import { parseExcel } from '../../services/question-import/excel.parser';
import { parseWord } from '../../services/question-import/word.parser';
import { validateQuestion } from '../../services/question-import/question.validator';
import { Modal, PrimaryButton, GhostButton } from '../../components/ui';

export default function QuestionImportModal({ onClose, onImport }) {
  const fileInputRef = useRef(null);
  const { 
    file, fileType, questions, isParsing, isValid, 
    setFile, setQuestions, setIsParsing, updateQuestion, 
    removeQuestion, clearImport 
  } = useQuestionImportStore();

  const [editIdx, setEditIdx] = useState(null);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    return () => clearImport();
  }, []);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      alert("File vượt quá dung lượng cho phép. Dung lượng tối đa: 10MB");
      return;
    }

    const name = selectedFile.name.toLowerCase();
    let type = null;
    if (name.endsWith('.xlsx') || name.endsWith('.xls')) type = 'xlsx';
    else if (name.endsWith('.docx')) type = 'docx';

    if (!type) {
      alert("File không được hỗ trợ. Vui lòng chọn .xlsx, .xls hoặc .docx");
      return;
    }

    setFile(selectedFile, type);
    setIsParsing(true);

    try {
      let parsed = [];
      if (type === 'xlsx') {
        parsed = await parseExcel(selectedFile);
      } else {
        parsed = await parseWord(selectedFile);
      }
      setQuestions(parsed);
    } catch (err) {
      alert("Lỗi khi parse file: " + err.message);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dt = new DataTransfer();
      dt.items.add(e.dataTransfer.files[0]);
      if (fileInputRef.current) {
        fileInputRef.current.files = dt.files;
        handleFileChange({ target: fileInputRef.current });
      }
    }
  };

  const startEdit = (idx) => {
    setEditIdx(idx);
    setEditForm(JSON.parse(JSON.stringify(questions[idx]))); // deep copy
  };

  const saveEdit = () => {
    const validated = validateQuestion(editForm);
    updateQuestion(editIdx, validated);
    setEditIdx(null);
    setEditForm(null);
  };

  const handleConfirm = () => {
    if (!isValid) return;
    onImport(questions);
    onClose();
  };

  if (editIdx !== null) {
    return (
      <Modal onClose={() => setEditIdx(null)}>
        <h2 className="font-display text-xl mb-4">Chỉnh sửa câu hỏi</h2>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          <div>
            <label className="text-sm font-semibold">Nội dung câu hỏi</label>
            <textarea 
              className="w-full note-card px-3 py-2 text-sm border-ink/10 mt-1" 
              value={editForm.question} 
              onChange={e => setEditForm({...editForm, question: e.target.value})} 
            />
          </div>
          {editForm.answers.map((ans, i) => (
            <div key={i}>
              <label className="text-sm font-semibold">Đáp án {ans.key}</label>
              <input 
                className="w-full note-card px-3 py-2 text-sm border-ink/10 mt-1" 
                value={ans.content} 
                onChange={e => {
                  const newAnswers = [...editForm.answers];
                  newAnswers[i].content = e.target.value;
                  setEditForm({...editForm, answers: newAnswers});
                }} 
              />
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold">Đáp án đúng</label>
            <select 
              className="w-full note-card px-3 py-2 text-sm border-ink/10 mt-1"
              value={editForm.correctAnswer || ""}
              onChange={e => setEditForm({...editForm, correctAnswer: e.target.value})}
            >
              <option value="">-- Chọn đáp án đúng --</option>
              {editForm.answers.map(a => <option key={a.key} value={a.key}>{a.key}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-semibold">Thời gian</label>
              <input type="number" className="w-full note-card px-3 py-2 text-sm border-ink/10 mt-1" value={editForm.time || ""} onChange={e => setEditForm({...editForm, time: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-sm font-semibold">Điểm</label>
              <input type="number" className="w-full note-card px-3 py-2 text-sm border-ink/10 mt-1" value={editForm.score || ""} onChange={e => setEditForm({...editForm, score: Number(e.target.value)})} />
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4 justify-end">
          <GhostButton onClick={() => setEditIdx(null)}>Hủy</GhostButton>
          <PrimaryButton onClick={saveEdit}>Lưu</PrimaryButton>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h2 className="font-display text-2xl mb-4 text-center">Import câu hỏi</h2>
      
      {!file && !isParsing && (
        <>
          <div 
            className="border-2 border-dashed border-ink/20 rounded-2xl p-10 text-center hover:bg-ink/5 transition cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="text-4xl mb-2">📁</div>
            <p className="font-semibold text-ink">Kéo file vào đây</p>
            <p className="text-sm text-[#8A7C63]">hoặc click để chọn file</p>
            <p className="text-xs text-[#8A7C63] mt-2">Hỗ trợ .xlsx, .xls, .docx (Max: 10MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .docx" 
            onChange={handleFileChange} 
          />
          <div className="flex justify-between mt-6 text-sm">
            <a href="/sample.xlsx" download className="text-teal hover:underline font-semibold">Tải file Excel mẫu</a>
            <a href="/sample.docx" download className="text-teal hover:underline font-semibold">Tải file Word mẫu</a>
          </div>
        </>
      )}

      {isParsing && (
        <div className="py-10 text-center">
          <p className="font-semibold text-ink animate-pulse">Đang xử lý file...</p>
        </div>
      )}

      {file && !isParsing && questions.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Kết quả: {questions.length} câu</h3>
            <div className="text-sm">
              <span className="text-teal mr-3">✓ {questions.filter(q => q.status === 'valid').length} hợp lệ</span>
              <span className="text-ticket">✕ {questions.filter(q => q.status === 'invalid').length} lỗi</span>
            </div>
          </div>
          
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-2 mb-4">
            {questions.map((q, i) => (
              <div key={i} className={`p-3 rounded-xl border ${q.status === 'valid' ? 'border-teal/30 bg-teal/5' : 'border-ticket/30 bg-ticket/5'}`}>
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{q.question || "(Trống)"}</p>
                    <p className="text-xs text-[#8A7C63] mt-1">Đúng: {q.correctAnswer || "?"} | {q.time || 10}s</p>
                    {q.errors.map((e, ei) => <p key={ei} className="text-xs text-ticket mt-1">- {e.message}</p>)}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(i)} className="text-xs font-semibold text-teal hover:underline">Sửa</button>
                    <button onClick={() => removeQuestion(i)} className="text-xs font-semibold text-ticket hover:underline">Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-3">
            <GhostButton onClick={clearImport} className="flex-1">Hủy bỏ</GhostButton>
            <PrimaryButton onClick={handleConfirm} disabled={!isValid} className="flex-1">
              Confirm Import
            </PrimaryButton>
          </div>
        </>
      )}
    </Modal>
  );
}
