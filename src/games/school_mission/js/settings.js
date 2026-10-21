// ===== SETTINGS: bảng ⚙️ Dữ liệu — sửa JSON câu hỏi ngay trong game =====
function cfg(){if(open_)return;
 modal(`<h2>⚙️ Dữ liệu câu hỏi & bài thi</h2><p style="font-size:13px;margin:4px 0">Sửa JSON bên dưới rồi bấm <b>Áp dụng</b>. Dữ liệu được lưu trên trình duyệt của bạn. Muốn sửa vĩnh viễn: chép JSON này dán đè vào file <code>data/questions.js</code>.</p><textarea id="ta" spellcheck="false"></textarea><div id="er"></div><button class="btn" id="ap">✅ Áp dụng</button> <button class="btn" id="cp" style="background:#bfe6ff;box-shadow:0 3px 0 #8ab">📋 Sao chép</button> <button class="btn" id="rs" style="background:#ffd0d0;box-shadow:0 3px 0 #c99">↩️ Mặc định</button> <button class="btn" id="cl" style="background:#ddd;box-shadow:0 3px 0 #aaa">Đóng</button>`);
 $("ta").value=JSON.stringify(DATA,null,1);
 $("ap").onclick=()=>{try{const x=JSON.parse($("ta").value),er=vd(x);if(er){$("er").textContent="❌ "+er;return}DATA=x;try{localStorage.setItem("tvv_data",JSON.stringify(x))}catch(e){}close_();toast("✅ Đã cập nhật câu hỏi & bài thi!")}catch(e){$("er").textContent="❌ JSON lỗi: "+e.message}};
 $("cp").onclick=()=>{try{navigator.clipboard.writeText($("ta").value).then(()=>toast("📋 Đã sao chép JSON"),()=>{$("ta").select()})}catch(e){$("ta").select()}};
 $("rs").onclick=()=>{try{localStorage.removeItem("tvv_data")}catch(e){}loadData();close_();toast("↩️ Đã khôi phục dữ liệu mặc định")};
 $("cl").onclick=close_}
