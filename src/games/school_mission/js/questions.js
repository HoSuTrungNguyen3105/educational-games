// ===== QUESTIONS: tạo câu hỏi từ dữ liệu (toán ngẫu nhiên / từ vựng / quiz) =====
function shq(q){const o=sh(q.options.map((t,i)=>[t,i==q.answer]));return{q:q.q,o:o.map(x=>String(x[0])),a:o.findIndex(x=>x[1]),x:q.explain||""}}
function mk(type){const s=DATA.subjects[type];
 if(s.mode=="math"){const m=3+S.lv*3,a=1+Math.floor(Math.random()*m),b=1+Math.floor(Math.random()*m),o=["+","-","×"][Math.floor(Math.random()*(S.lv>1?3:2))];
  let r=o=="+"?a+b:o=="-"?a-b:a*b;let st=new Set([r]);while(st.size<4)st.add(r+Math.floor(Math.random()*9)-4);
  const op=sh([...st]);return{q:`${a} ${o} ${b} = ?`,o:op.map(String),a:op.indexOf(r),x:""}}
 if(s.mode=="vocab"){const V=s.vocab,w=V[Math.floor(Math.random()*V.length)];const ws=sh(V.filter(x=>x!=w)).slice(0,3).map(x=>x[1]);const op=sh([w[1],...ws]);return{q:`"${w[0]}" nghĩa là gì?`,o:op,a:op.indexOf(w[1]),x:""}}
 return shq(s.questions[Math.floor(Math.random()*s.questions.length)])}
