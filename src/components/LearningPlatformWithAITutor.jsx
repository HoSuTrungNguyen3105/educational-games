import React, { useState } from 'react';

export default function LearningPlatformWithAITutor() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Chào bạn! Tôi là trợ lý AI của khóa học **Kiến trúc Phần mềm**. Bạn có thắc mắc gì về bài giảng hôm nay không?',
      sources: []
    },
    {
      id: 2,
      sender: 'user',
      text: 'Sự khác biệt chính giữa Monolithic và Microservices là gì?'
    },
    {
      id: 3,
      sender: 'ai',
      text: 'Dựa trên giáo trình của bài học này, có 3 điểm khác biệt cốt lõi:\n\n1. **Cấu trúc triển khai:** Monolithic đóng gói toàn bộ ứng dụng thành một khối duy nhất, còn Microservices chia nhỏ thành các dịch vụ độc lập.\n2. **Khả năng mở rộng:** Microservices cho phép mở rộng riêng từng dịch vụ đang quá tải thay vì phải nhân bản toàn bộ hệ thống.\n3. **Độ phức tạp:** Monolithic dễ phát triển lúc đầu, nhưng Microservices đòi hỏi quản lý giao tiếp mạng phức tạp hơn.',
      sources: [
        { type: 'video', label: 'Video 05:20', time: 320 },
        { type: 'pdf', label: 'Slide trang 14', page: 14 }
      ]
    }
  ]);

  const [input, setInput] = useState('');
  const [activeNote, setActiveNote] = useState('Đang phát video bài giảng...');

  const quickPrompts = [
    'Tóm tắt bài này trong 3 ý',
    'Cho ví dụ thực tế về Microservices',
    'Tạo 3 câu hỏi trắc nghiệm ôn tập'
  ];

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Giả lập phản hồi từ Backend RAG
    setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        sender: 'ai',
        text: `Đây là phần giải thích chi tiết từ tài liệu khóa học cho câu hỏi: "${textToSend}". Bạn nên lưu ý cách các service giao tiếp qua REST API hoặc Message Broker.`,
        sources: [{ type: 'pdf', label: 'Slide trang 18', page: 18 }]
      };
      setMessages((prev) => [...prev, aiMsg]);
    }, 600);
  };

  const handleSourceClick = (source) => {
    if (source.type === 'video') {
      setActiveNote(`⏩ Đã tua video đến mốc ${source.label}`);
    } else {
      setActiveNote(`📖 Đang mở tài liệu tại ${source.label}`);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-800">
      {/* CỘT TRÁI: NỘI DUNG BÀI HỌC (65%) */}
      <div className="w-2/3 flex flex-col border-r border-gray-200 bg-white">
        {/* Header khóa học */}
        <div className="h-14 border-b px-6 flex items-center justify-between">
          <h1 className="font-bold text-lg text-indigo-900">
            Bài 4: Kiến trúc Microservices căn bản
          </h1>
          <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full font-medium">
            {activeNote}
          </span>
        </div>

        {/* Khung trình chiếu Video / Slide */}
        <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto">
          <div className="w-full aspect-video bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-inner">
            <div className="text-center">
              <p className="text-xl font-semibold mb-2">🎬 Trình phát Video Bài Giảng</p>
              <p className="text-sm text-slate-400">Bấm vào thẻ trích dẫn bên khung chat AI để tự động tua video</p>
            </div>
          </div>

          {/* Tóm tắt bên dưới video */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="font-semibold mb-2">Tài liệu đính kèm bài học:</h2>
            <p className="text-sm text-gray-600">
              • Giáo trình_KienTrucPhanMem_Chuong4.pdf (24 trang)<br />
              • Source_code_demo_microservices.zip
            </p>
          </div>
        </div>
      </div>

      {/* CỘT PHẢI: GIA SƯ AI - RAG TUTOR (35%) */}
      <div className="w-1/3 flex flex-col bg-slate-50">
        {/* Header khung chat */}
        <div className="h-14 border-b bg-white px-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
            <h2 className="font-bold text-gray-800">Gia sư AI (Tài liệu khóa học)</h2>
          </div>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-medium">
            RAG Active
          </span>
        </div>

        {/* Danh sách tin nhắn */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-none'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                }`}
              >
                {msg.text}

                {/* Hiển thị nguồn trích dẫn từ RAG */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-gray-100 flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400 w-full">Nguồn trích dẫn:</span>
                    {msg.sources.map((src, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSourceClick(src)}
                        className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-md transition flex items-center gap-1 font-medium"
                      >
                        {src.type === 'video' ? '⏱️' : '📄'} {src.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Gợi ý câu hỏi nhanh */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleSend(prompt)}
              className="whitespace-nowrap text-xs bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 border border-gray-300 px-3 py-1.5 rounded-full transition"
            >
              ✨ {prompt}
            </button>
          ))}
        </div>

        {/* Ô nhập câu hỏi */}
        <div className="p-3 bg-white border-t border-gray-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hỏi bất cứ điều gì về bài học này..."
              className="flex-1 text-sm border border-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition"
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
