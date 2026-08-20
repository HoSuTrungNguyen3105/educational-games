import React from 'react';
import { fontStack } from '../elementUtils.js';

// Các component đặc thù của game "Đuổi hình bắt chữ"
// Trong thực tế, có thể tách các component này ra từng file riêng

function QuestionImage({ el, context }) {
  const p = el.properties || {};
  const { question } = context;
  const src = question?.image || p.src || "https://placehold.co/600x400/E9E4D6/8A7C63.png?text=Image";
  
  return (
    <div style={{ width: '100%', height: '100%', borderRadius: p.radius || 0, overflow: 'hidden' }}>
      <img src={src} alt="Question" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}

function QuestionText({ el, context }) {
  const p = el.properties || {};
  const { question } = context;
  const text = question?.content || p.text || "Câu hỏi sẽ hiển thị ở đây";
  
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: p.align || 'center',
      fontSize: p.fontSize || 24, fontWeight: p.fontWeight || 600, color: p.color || '#1D2E4A',
      fontFamily: fontStack(p.font)
    }}>
      {text}
    </div>
  );
}

function AnswerInput({ el, context }) {
  const p = el.properties || {};
  const { question, selected, revealed } = context;
  const answerStr = question?.correctAnswer || "DAPAN";
  const letters = answerStr.split('');
  
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: p.gap || 8 }}>
      {letters.map((letter, i) => (
        <div key={i} style={{
          width: 40, height: 50,
          background: '#FFF', border: '2px solid #1D2E4A', borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, fontWeight: 700, color: '#1D2E4A'
        }}>
          {revealed ? letter : ''}
        </div>
      ))}
    </div>
  );
}

function TimerDisplay({ el, context }) {
  const p = el.properties || {};
  const { timeLeft } = context;
  const seconds = timeLeft ?? 30;
  const ss = String(Math.round(seconds)).padStart(2, "0");
  
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: p.fontSize || 36, fontWeight: p.fontWeight || 700, color: p.color || '#E4572E',
      fontFamily: fontStack(p.font)
    }}>
      ⏱ {ss}
    </div>
  );
}

function ScoreDisplay({ el, context }) {
  const p = el.properties || {};
  const { score } = context;
  const currentScore = score ?? 0;
  
  return (
    <div style={{ 
      width: '100%', height: '100%', 
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: p.fontSize || 36, fontWeight: p.fontWeight || 700, color: p.color || '#1B998B',
      fontFamily: fontStack(p.font)
    }}>
      ⭐ {currentScore}
    </div>
  );
}

// Registry map
const componentMap = {
  "QuestionImage": QuestionImage,
  "QuestionText": QuestionText,
  "AnswerInput": AnswerInput,
  "TimerDisplay": TimerDisplay,
  "ScoreDisplay": ScoreDisplay,
};

export function GameComponentRenderer({ el, context, editing }) {
  const Component = componentMap[el.component];
  if (!Component) {
    return <div style={{ 
      width: '100%', height: '100%', 
      background: 'rgba(255,0,0,0.1)', border: '1px dashed red',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, color: 'red'
    }}>Unknown Component: {el.component}</div>;
  }
  
  return <Component el={el} context={context} editing={editing} />;
}
