import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{U as r,vt as i}from"./index-7bCPGtMS.js";import a from"./HtmlGameLoader-CQtiFMnU.js";var o=e(t(),1),s=`<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Math Adventure – Phiêu lưu Toán học</title>
<style>
  /* ============================================================
     MATH ADVENTURE — 1 file HTML thuần (HTML + CSS + JS)
     Phong cách: cute cartoon / fantasy garden / Edu Garden
     ============================================================ */
  :root{
    --green:#22C55E; --green-d:#16A34A;
    --yellow:#FBBF24; --yellow-d:#F59E0B;
    --blue:#3B82F6;  --blue-l:#60A5FA;
    --red:#EF4444;   --purple:#8B5CF6;
    --bg:#F8FAFC;    --ink:#1E293B; --muted:#64748B;
    --card:#FFFFFF;  --line:#E2E8F0;
    --shadow:0 8px 22px rgba(15,60,120,.10);
    --r-lg:22px; --r-md:16px; --r-sm:12px;
  }
  *{box-sizing:border-box}
  html,body{height:100%}
  body{
    margin:0; overflow:hidden; color:var(--ink);
    font-family:"Segoe UI",system-ui,-apple-system,"Helvetica Neue",Arial,sans-serif;
    background:linear-gradient(180deg,#DCEFFF 0%,#EFF8FF 45%,#F0FDF4 100%);
    -webkit-tap-highlight-color:transparent;
  }
  button{font-family:inherit;cursor:pointer;border:0;background:none;color:inherit}
  .app{height:100vh;display:flex;flex-direction:column}

  /* ---------- HEADER ---------- */
  .topbar{
    display:flex;align-items:center;gap:10px;padding:8px 14px;
    background:rgba(255,255,255,.92);border-bottom:1px solid var(--line);
    backdrop-filter:blur(8px);z-index:30;flex:0 0 auto;
  }
  .brand{display:flex;align-items:center;gap:8px;font-weight:900;font-size:17px}
  .brand .logo{
    width:34px;height:34px;border-radius:12px;display:grid;place-items:center;
    background:linear-gradient(135deg,#4ADE80,#16A34A);color:#fff;font-size:18px;
    box-shadow:0 4px 10px rgba(22,163,74,.35)
  }
  .brand small{display:block;font-size:10px;font-weight:700;color:var(--muted);letter-spacing:.4px}
  .top-stats{display:flex;align-items:center;gap:8px;margin-left:auto}
  .chip{
    display:flex;align-items:center;gap:7px;background:#fff;border:1px solid var(--line);
    border-radius:999px;padding:6px 12px;font-weight:800;font-size:13px;box-shadow:var(--shadow);
    white-space:nowrap
  }
  .chip .ico{
    width:22px;height:22px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:12px;
    background:linear-gradient(135deg,var(--yellow),var(--yellow-d));box-shadow:0 3px 6px rgba(245,158,11,.4)
  }
  .chip.lv .ico{background:linear-gradient(135deg,#FDE047,var(--yellow-d))}
  .chip.heart .ico{background:linear-gradient(135deg,#FB7185,var(--red))}
  .chip .exp-wrap{display:flex;flex-direction:column;gap:3px;min-width:96px}
  .chip .exp-top{display:flex;justify-content:space-between;font-size:11px;font-weight:800}
  .bar{height:7px;border-radius:999px;background:#F1F5F9;overflow:hidden}
  .bar > i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,var(--green),#4ADE80);transition:width .5s cubic-bezier(.34,1.56,.64,1)}
  .bar.blue > i{background:linear-gradient(90deg,var(--blue),var(--blue-l))}
  .bar.red > i{background:linear-gradient(90deg,#F87171,var(--red))}
  .avatar{
    display:flex;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);
    border-radius:999px;padding:5px 12px 5px 5px;font-weight:800;font-size:13px;box-shadow:var(--shadow)
  }
  .avatar .face{
    width:30px;height:30px;border-radius:50%;display:grid;place-items:center;font-size:16px;
    background:linear-gradient(135deg,#FDE68A,#FCA5A5)
  }
  .icon-btn{
    width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid var(--line);
    display:grid;place-items:center;box-shadow:var(--shadow);font-size:15px;transition:.15s
  }
  .icon-btn:hover{transform:translateY(-2px)}
  .icon-btn.off{opacity:.5}

  /* ---------- BODY ---------- */
  .body{flex:1;display:flex;min-height:0}

  /* rail trái */
  .rail{
    width:96px;flex:0 0 auto;background:#fff;border-right:1px solid var(--line);
    display:flex;flex-direction:column;gap:6px;padding:12px 8px;overflow:auto
  }
  .rail button{
    display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 4px;border-radius:14px;
    font-size:10.5px;font-weight:800;color:var(--muted);transition:.15s
  }
  .rail button .ri{font-size:19px;line-height:1}
  .rail button:hover{background:#F1F5F9;color:var(--ink)}
  .rail button.on{background:linear-gradient(135deg,#DCFCE7,#BBF7D0);color:var(--green-d)}

  /* sân chơi */
  .stage{position:relative;flex:1;min-width:0;display:flex;flex-direction:column;gap:10px;padding:12px;overflow:auto}

  /* cảnh vườn */
  .scene{
    position:relative;height:132px;border-radius:var(--r-lg);overflow:hidden;flex:0 0 auto;
    background:linear-gradient(180deg,#8ED6FF 0%,#C7EEFF 55%,#A7E8A0 56%,#7ED17A 100%);
    box-shadow:var(--shadow)
  }
  .scene .cloud{position:absolute;font-size:26px;opacity:.95;animation:drift 26s linear infinite}
  .scene .c1{top:10px;left:-40px}
  .scene .c2{top:34px;left:35%;font-size:20px;animation-duration:34s}
  @keyframes drift{from{transform:translateX(0)}to{transform:translateX(120vw)}}
  .scene .hills{position:absolute;left:0;right:0;bottom:0;height:52px;
    background:radial-gradient(60px 40px at 12% 100%,#5CC56B 60%,transparent 61%),
               radial-gradient(90px 46px at 45% 100%,#4FBF63 60%,transparent 61%),
               radial-gradient(70px 40px at 82% 100%,#5CC56B 60%,transparent 61%),
               linear-gradient(#8AE08A,#6BCF77)}
  .scene .plot{
    position:absolute;bottom:10px;left:50%;transform:translateX(-50%);text-align:center;width:190px
  }
  .scene .plot .soil{
    background:#8B5E3C;border-radius:50%/40%;height:20px;box-shadow:inset 0 -4px 0 #7A4E2E
  }
  .scene .plant{font-size:34px;line-height:1;position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
    transition:.4s;filter:drop-shadow(0 4px 6px rgba(0,0,0,.2))}
  .scene .plant.pop{animation:pop .5s}
  @keyframes pop{0%{transform:translateX(-50%) scale(.6)}60%{transform:translateX(-50%) scale(1.2)}100%{transform:translateX(-50%) scale(1)}}
  .scene .grow-tag{
    position:absolute;bottom:6px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,.92);
    border-radius:999px;padding:2px 10px;font-size:10.5px;font-weight:900;color:var(--green-d);box-shadow:var(--shadow)
  }
  .scene .farmer{position:absolute;left:16%;bottom:26px;font-size:46px;animation:bob 2.6s ease-in-out infinite;filter:drop-shadow(0 6px 6px rgba(0,0,0,.18))}
  .scene .tree{position:absolute;bottom:24px;font-size:36px;filter:drop-shadow(0 5px 5px rgba(0,0,0,.15))}
  .scene .tree.t1{left:4%} .scene .tree.t2{right:6%;font-size:44px}
  @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}

  .scene .pet-bubble{
    position:absolute;left:22%;bottom:78px;background:#fff;border:2px solid var(--yellow);
    border-radius:14px 14px 14px 4px;padding:5px 10px;font-size:12px;font-weight:800;box-shadow:var(--shadow);
    max-width:190px;opacity:0;transform:translateY(6px);transition:.25s;pointer-events:none
  }
  .scene .pet-bubble.show{opacity:1;transform:translateY(0)}
  .scene .pet{position:absolute;left:8%;bottom:26px;font-size:34px;animation:bob 2.1s ease-in-out infinite}

  /* thẻ câu hỏi */
  .qcard{
    background:var(--card);border-radius:var(--r-lg);box-shadow:var(--shadow);padding:14px 16px;
    display:flex;flex-direction:column;gap:12px;flex:1;min-height:0;position:relative
  }
  .qhead{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .qhead .title{font-weight:900;font-size:15px;display:flex;align-items:center;gap:6px}
  .pill{
    display:flex;align-items:center;gap:6px;background:#F1F5F9;border-radius:999px;padding:5px 11px;
    font-size:12px;font-weight:800;color:var(--muted)
  }
  .pill.diff{background:#FEF3C7;color:#B45309}
  .pill.time{background:#DBEAFE;color:#1D4ED8;font-variant-numeric:tabular-nums}
  .qhead .spacer{flex:1}
  .mini-btn{
    display:flex;align-items:center;gap:6px;background:#FFF7ED;border:1.5px solid #FDBA74;color:#C2410C;
    border-radius:999px;padding:6px 12px;font-size:12px;font-weight:900;transition:.15s
  }
  .mini-btn:hover{transform:translateY(-1px);background:#FFEDD5}
  .mini-btn:disabled{opacity:.5;transform:none;cursor:not-allowed}
  .prog-line{display:flex;align-items:center;gap:10px}
  .prog-line .bar{flex:1;height:10px}
  .prog-line b{font-size:12.5px;color:var(--muted);white-space:nowrap}

  .qtext{text-align:center;font-size:30px;font-weight:900;letter-spacing:.5px;margin:2px 0 0}
  .qsub{text-align:center;font-size:13.5px;color:var(--muted);font-weight:700;margin-top:-4px}
  .visual{display:flex;flex-wrap:wrap;justify-content:center;gap:8px 14px;align-items:center;min-height:52px}
  .vgroup{
    background:#FFF7ED;border:2px dashed #FDBA74;border-radius:16px;padding:8px 12px;font-size:24px;
    line-height:1.35;letter-spacing:2px;max-width:240px;text-align:center
  }
  .vop{font-size:28px;font-weight:900;color:var(--purple)}

  /* khu vực kéo thả */
  .play-area{display:flex;gap:16px;align-items:stretch;justify-content:center;flex-wrap:wrap}
  .dropzone{
    width:170px;min-height:120px;border:3px dashed #93C5FD;border-radius:20px;background:#EFF6FF;
    display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;
    font-weight:900;color:#3B82F6;transition:.15s;text-align:center;padding:8px
  }
  .dropzone.over{border-color:var(--green);background:#DCFCE7;transform:scale(1.04)}
  .dropzone .slot{
    min-width:110px;min-height:56px;border-radius:16px;background:#fff;border:2px solid #BFDBFE;
    display:grid;place-items:center;font-size:30px;font-weight:900;box-shadow:inset 0 2px 6px rgba(59,130,246,.12)
  }
  .dropzone .hint-txt{font-size:11.5px;font-weight:800;color:#60A5FA;max-width:140px}
  .options{display:grid;grid-template-columns:repeat(2,minmax(112px,1fr));gap:12px;flex:1;max-width:420px}
  .opt{
    position:relative;background:linear-gradient(180deg,#FFFFFF,#F8FAFC);border:2.5px solid var(--line);
    border-radius:20px;min-height:86px;display:flex;flex-direction:column;align-items:center;justify-content:center;
    gap:2px;font-size:30px;font-weight:900;box-shadow:0 6px 0 #E2E8F0;transition:.14s;user-select:none;
    touch-action:none
  }
  .opt small{font-size:11px;color:#94A3B8;font-weight:800}
  .opt:hover{transform:translateY(-3px);border-color:#93C5FD;box-shadow:0 9px 0 #E2E8F0}
  .opt:active{transform:translateY(2px);box-shadow:0 3px 0 #E2E8F0}
  .opt.ok{border-color:var(--green);background:linear-gradient(180deg,#F0FDF4,#DCFCE7);box-shadow:0 6px 0 #86EFAC;color:var(--green-d);animation:bounce .5s}
  .opt.bad{border-color:var(--red);background:#FEF2F2;box-shadow:0 6px 0 #FECACA;animation:shake .4s}
  .opt.used{opacity:.45;pointer-events:none}
  @keyframes bounce{0%{transform:scale(1)}40%{transform:scale(1.12)}100%{transform:scale(1)}}
  @keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-9px)}40%{transform:translateX(9px)}60%{transform:translateX(-6px)}80%{transform:translateX(6px)}}

  .drag-ghost{
    position:fixed;z-index:99;pointer-events:none;transform:translate(-50%,-50%) scale(1.06) rotate(-3deg);
    background:#fff;border:2.5px solid var(--blue);border-radius:18px;padding:12px 22px;font-size:28px;
    font-weight:900;box-shadow:0 14px 26px rgba(59,130,246,.35)
  }

  /* cột phải */
  .side{
    width:296px;flex:0 0 auto;background:#fff;border-left:1px solid var(--line);padding:12px;
    overflow:auto;display:flex;flex-direction:column;gap:12px
  }
  .panel{background:#fff;border:1px solid var(--line);border-radius:var(--r-md);box-shadow:var(--shadow);padding:12px}
  .panel h3{margin:0 0 10px;font-size:14px;display:flex;align-items:center;gap:8px}
  .panel h3 .badge{
    margin-left:auto;background:var(--red);color:#fff;border-radius:999px;font-size:11px;
    padding:2px 8px;font-weight:900
  }
  .panel h3 a{margin-left:auto;font-size:11.5px;color:var(--blue);font-weight:800;text-decoration:none}
  .task{display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-top:1px dashed var(--line)}
  .task:first-of-type{border-top:0}
  .task .tic{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;font-size:15px;background:#DBEAFE}
  .task.done .tic{background:#DCFCE7}
  .task .tinfo{flex:1;min-width:0}
  .task .tname{font-size:12.5px;font-weight:800;line-height:1.3}
  .task .trow{display:flex;align-items:center;gap:8px;margin-top:5px}
  .task .trow .bar{flex:1;height:7px}
  .task .trow b{font-size:11px;color:var(--muted);white-space:nowrap}
  .task .rw{font-size:11.5px;font-weight:900;color:#B45309;white-space:nowrap;display:flex;align-items:center;gap:4px}
  .reward-box{
    display:flex;gap:8px;justify-content:space-between;background:#FFFBEB;border:1.5px dashed #FCD34D;
    border-radius:12px;padding:8px 10px;margin-top:6px
  }
  .reward-box span{font-size:11.5px;font-weight:900;color:#92400E}

  .pet-panel .pet-top{display:flex;gap:10px;align-items:center}
  .pet-ava{
    width:66px;height:66px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFF7ED,#FED7AA);
    display:grid;place-items:center;font-size:36px;box-shadow:0 0 0 3px var(--yellow),0 6px 12px rgba(0,0,0,.12)
  }
  .pet-meta{flex:1;min-width:0}
  .pet-meta .nm{display:flex;align-items:center;gap:8px;font-weight:900;font-size:14px}
  .lv-tag{background:#FEF3C7;color:#B45309;font-size:11px;font-weight:900;border-radius:999px;padding:2px 8px}
  .mood{color:var(--red);font-size:11.5px;font-weight:900;display:flex;align-items:center;gap:4px;justify-content:flex-end}
  .pet-exp{display:flex;align-items:center;gap:8px;margin-top:8px}
  .pet-exp .bar{flex:1}
  .pet-exp b{font-size:11px;color:var(--muted)}
  .pet-say{
    margin-top:9px;background:#FFF7ED;border:1.5px solid #FDBA74;border-radius:14px 14px 14px 4px;
    padding:8px 10px;font-size:12px;font-weight:800;color:#9A3412;min-height:34px;display:flex;align-items:center;gap:6px
  }
  .achv{display:flex;align-items:center;gap:9px;padding:7px 0;border-top:1px dashed var(--line)}
  .achv:first-of-type{border-top:0}
  .achv .ai{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;font-size:15px;background:#EDE9FE}
  .achv .an{font-size:12px;font-weight:800;flex:1}
  .achv .av{font-size:11.5px;font-weight:900;color:#B45309;white-space:nowrap}
  .achv .bar{width:74px;height:6px}
  .achv .ap{font-size:10.5px;color:var(--muted);font-weight:800;white-space:nowrap}

  /* ---------- MODAL ---------- */
  .overlay{
    position:fixed;inset:0;background:rgba(15,23,42,.45);display:none;align-items:center;justify-content:center;
    z-index:60;padding:16px;backdrop-filter:blur(3px)
  }
  .overlay.show{display:flex}
  .modal{
    width:min(460px,96vw);background:#fff;border-radius:26px;box-shadow:0 24px 60px rgba(0,0,0,.3);
    padding:22px;text-align:center;animation:pop-in .35s cubic-bezier(.34,1.56,.64,1);max-height:92vh;overflow:auto
  }
  @keyframes pop-in{from{transform:scale(.8);opacity:0}to{transform:scale(1);opacity:1}}
  .modal h2{margin:6px 0 4px;font-size:24px}
  .modal .sub{color:var(--muted);font-weight:700;font-size:13.5px;margin-bottom:12px}
  .reward-list{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin:12px 0}
  .reward-list .r{
    background:#FFFBEB;border:2px solid #FCD34D;border-radius:16px;padding:10px 14px;font-weight:900;
    font-size:14px;color:#92400E;animation:pop .45s
  }
  .plant-line{
    background:linear-gradient(135deg,#DCFCE7,#BBF7D0);border-radius:16px;padding:10px;font-weight:900;
    color:#166534;font-size:13.5px;margin-top:6px
  }
  .btn{
    display:inline-flex;align-items:center;justify-content:center;gap:8px;border-radius:999px;
    padding:12px 26px;font-weight:900;font-size:15px;transition:.15s;box-shadow:0 6px 0 rgba(0,0,0,.12)
  }
  .btn:active{transform:translateY(3px);box-shadow:0 2px 0 rgba(0,0,0,.12)}
  .btn.green{background:linear-gradient(135deg,#4ADE80,var(--green-d));color:#fff}
  .btn.blue{background:linear-gradient(135deg,#60A5FA,#2563EB);color:#fff}
  .btn.purple{background:linear-gradient(135deg,#A78BFA,#7C3AED);color:#fff}
  .btn.ghost{background:#F1F5F9;color:var(--muted);box-shadow:0 4px 0 #E2E8F0}
  .btn.block{display:flex;width:100%;margin-top:10px}

  /* start screen */
  .mode-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px;margin:14px 0}
  .mode{
    border:2.5px solid var(--line);border-radius:18px;padding:12px 8px;background:#F8FAFC;transition:.15s;
    display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:900;font-size:12.5px
  }
  .mode .mi{font-size:28px}
  .mode small{font-size:10.5px;color:var(--muted);font-weight:700;line-height:1.3}
  .mode:hover{transform:translateY(-3px);border-color:#93C5FD}
  .mode.on{border-color:var(--green);background:#DCFCE7;color:var(--green-d);box-shadow:0 6px 0 #86EFAC}
  .mode.locked{opacity:.55;cursor:not-allowed}
  .mode.locked:hover{transform:none;border-color:var(--line)}

  /* ---------- BOSS / MAZE ---------- */
  .boss-wrap{background:linear-gradient(135deg,#FEE2E2,#FFE4E6);border:2px solid #FECACA;border-radius:18px;padding:12px}
  .boss-top{display:flex;align-items:center;gap:12px}
  .boss-face{font-size:44px;animation:bob 1.8s ease-in-out infinite;filter:drop-shadow(0 6px 8px rgba(0,0,0,.2))}
  .boss-info{flex:1}
  .boss-name{font-weight:900;color:#B91C1C;display:flex;align-items:center;gap:8px;font-size:14px}
  .boss-hp{display:flex;align-items:center;gap:8px;margin-top:6px}
  .boss-hp .bar{flex:1;height:12px;background:#FECACA}
  .boss-hp .bar > i{background:linear-gradient(90deg,#F87171,#DC2626)}
  .boss-hp b{font-size:12px;color:#B91C1C;font-variant-numeric:tabular-nums;white-space:nowrap}
  .dmg-float{position:absolute;right:24px;top:16px;font-size:22px;font-weight:900;color:#DC2626;animation:float-up .9s forwards;pointer-events:none}
  @keyframes float-up{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-46px)}}

  .maze-wrap{display:flex;flex-direction:column;align-items:center;gap:8px}
  .maze-tag{font-size:12px;font-weight:900;color:var(--muted);display:flex;align-items:center;gap:6px}
  .maze{display:grid;grid-template-columns:repeat(3,84px);grid-auto-rows:76px;gap:6px}
  .cell{
    border-radius:14px;background:#fff;border:2.5px solid var(--line);box-shadow:0 5px 0 #E2E8F0;
    display:grid;place-items:center;font-size:26px;font-weight:900;transition:.12s;position:relative
  }
  .cell:hover{border-color:#93C5FD;transform:translateY(-2px)}
  .cell.here{border-color:var(--blue);background:#EFF6FF}
  .cell.here::after{content:"🧍";position:absolute;font-size:30px;filter:drop-shadow(0 3px 4px rgba(0,0,0,.25))}
  .cell.here span{opacity:0}
  .cell.goal{border-color:var(--green);background:#DCFCE7;color:var(--green-d)}
  .maze-keys{display:flex;gap:6px;font-size:11.5px;font-weight:800;color:var(--muted)}
  .kbd{background:#F1F5F9;border:1px solid var(--line);border-bottom-width:3px;border-radius:8px;padding:3px 8px}

  /* toast + confetti */
  .toast{
    position:absolute;left:50%;top:12px;transform:translateX(-50%) translateY(-12px);opacity:0;
    background:#fff;border:2px solid var(--yellow);border-radius:16px;padding:9px 16px;font-weight:900;
    font-size:13.5px;box-shadow:var(--shadow);z-index:20;transition:.25s;text-align:center;max-width:90%
  }
  .toast.show{opacity:1;transform:translateX(-50%) translateY(0)}
  .toast.good{border-color:var(--green);color:var(--green-d);background:#F0FDF4}
  .toast.bad{border-color:#FDBA74;color:#C2410C;background:#FFF7ED}
  .confetti{position:absolute;top:-14px;font-size:18px;animation:fall linear forwards;pointer-events:none;z-index:40}
  @keyframes fall{to{transform:translateY(120vh) rotate(560deg);opacity:.2}}

  .footer-note{font-size:11px;color:#94A3B8;text-align:center;font-weight:700;padding:2px 0 6px}

  /* responsive */
  @media (max-width:1120px){
    .side{display:none}
    .rail{width:78px}
  }
  @media (max-width:820px){
    .rail{display:none}
    .qtext{font-size:24px}
    .brand small{display:none}
    .chip .exp-wrap{min-width:70px}
    .avatar span.nm{display:none}
    .options{max-width:none}
  }
  @media (max-width:560px){
    .chip.hide-sm{display:none}
    .scene{height:110px}
    .maze{grid-template-columns:repeat(3,72px);grid-auto-rows:64px}
    .mode-grid{grid-template-columns:1fr}
  }
</style>
</head>
<body>
<div class="app">

  <!-- ============ HEADER ============ -->
  <header class="topbar">
    <div class="brand">
      <div class="logo">🌱</div>
      <div>Edu Garden<small>Math Adventure</small></div>
    </div>

    <div class="top-stats">
      <div class="chip" id="coinChip" title="Coin">
        <span class="ico">🪙</span><span id="coinVal">1.250</span>
      </div>
      <div class="chip lv" title="Cấp độ &amp; EXP">
        <span class="ico">⭐</span>
        <span class="exp-wrap">
          <span class="exp-top"><span id="lvVal">Lv 12</span><span id="expTxt">320 / 600</span></span>
          <span class="bar"><i id="expBar" style="width:53%"></i></span>
        </span>
      </div>
      <div class="chip heart hide-sm" title="Lương tâm ❤️">
        <span class="ico">❤️</span><span id="heartVal">100</span>
      </div>
      <button class="icon-btn" id="soundBtn" title="Bật/tắt âm thanh">🔊</button>
      <div class="avatar"><span class="face">🧒</span><span class="nm" id="playerName">An Nhiên</span></div>
    </div>
  </header>

  <div class="body">

    <!-- ============ RAIL TRÁI ============ -->
    <nav class="rail" id="rail">
      <button data-act="home" title="Về trang chủ"><span class="ri">🏠</span>Trang chủ</button>
      <button data-act="play" class="on" title="Chơi game"><span class="ri">🎮</span>Chơi game</button>
      <button data-act="learn" title="Học tập"><span class="ri">📚</span>Học tập</button>
      <button data-act="quest" title="Nhiệm vụ"><span class="ri">🎯</span>Nhiệm vụ</button>
      <button data-act="garden" title="Khu vườn"><span class="ri">🌱</span>Khu vườn</button>
      <button data-act="bag" title="Kho đồ"><span class="ri">🎒</span>Kho đồ</button>
      <button data-act="achv" title="Thành tựu"><span class="ri">🏆</span>Thành tựu</button>
      <button data-act="settings" title="Cài đặt"><span class="ri">⚙️</span>Cài đặt</button>
    </nav>

    <!-- ============ SÂN CHƠI ============ -->
    <main class="stage" id="stage">
      <div class="toast" id="toast"></div>

      <!-- cảnh vườn nhỏ -->
      <div class="scene">
        <div class="cloud c1">☁️</div><div class="cloud c2">☁️</div>
        <div class="tree t1">🌳</div>
        <div class="tree t2">🌲</div>
        <div class="farmer">🧑‍🌾</div>
        <div class="pet">🐶</div>
        <div class="pet-bubble" id="petBubble">Chào bạn! Cùng học Toán nhé~</div>
        <div class="hills"></div>
        <div class="plot">
          <div class="plant" id="plant">🌱</div>
          <div class="soil"></div>
          <div class="grow-tag" id="growTag">Cà rốt · 0/5</div>
        </div>
      </div>

      <!-- thẻ câu hỏi -->
      <section class="qcard" id="qcard">
        <div class="qhead">
          <span class="title" id="qTitle">🌳 TOÁN HỌC</span>
          <span class="pill" id="qCounter">Câu 1 / 10</span>
          <span class="pill diff" id="qDiff">Độ khó: Dễ ⭐☆☆☆</span>
          <span class="pill time">⏱ <span id="timer">00:00</span></span>
          <span class="spacer"></span>
          <button class="mini-btn" id="hintBtn">💡 Mẹo nhỏ</button>
          <button class="mini-btn" id="soundBtn2" title="Âm thanh">🔊</button>
        </div>

        <div class="prog-line">
          <span class="bar"><i id="progBar" style="width:10%"></i></span>
          <b id="progTxt">10%</b>
        </div>

        <div id="playSlot"><!-- question + answers được render vào đây --></div>

        <div class="footer-note">💡 Kéo đáp án vào ô xanh, hoặc bấm trực tiếp để trả lời</div>
      </section>
    </main>

    <!-- ============ CỘT PHẢI ============ -->
    <aside class="side">
      <div class="panel">
        <h3>🎯 Nhiệm vụ hiện tại <span class="badge" id="taskBadge">3</span></h3>

        <div class="task" id="task1">
          <div class="tic">📚</div>
          <div class="tinfo">
            <div class="tname">Làm 5 câu Toán</div>
            <div class="trow">
              <span class="bar"><i id="t1bar" style="width:0%"></i></span>
              <b id="t1txt">0 / 5</b>
            </div>
          </div>
          <div class="rw">🪙 +50</div>
        </div>

        <div class="task" id="task2">
          <div class="tic">✅</div>
          <div class="tinfo">
            <div class="tname">Trả lời đúng 3 câu</div>
            <div class="trow">
              <span class="bar"><i id="t2bar" style="width:0%"></i></span>
              <b id="t2txt">0 / 3</b>
            </div>
          </div>
          <div class="rw">⭐ +20</div>
        </div>

        <div class="task" id="task3">
          <div class="tic">🏆</div>
          <div class="tinfo">
            <div class="tname">Hoàn thành 1 màn chơi</div>
            <div class="trow">
              <span class="bar"><i id="t3bar" style="width:0%"></i></span>
              <b id="t3txt">0 / 1</b>
            </div>
          </div>
          <div class="rw">🪙 +100</div>
        </div>

        <div class="reward-box">
          <span>🎁 Phần thưởng</span><span>⭐ +10 EXP</span><span>🪙 +20 Coin</span><span>💧 +1 Nước</span>
        </div>
      </div>

      <div class="panel pet-panel">
        <h3>🐶 Thứ cưng <a href="#" onclick="return false">Xem thêm ›</a></h3>
        <div class="pet-top">
          <div class="pet-ava" id="petAva">🐶</div>
          <div class="pet-meta">
            <div class="nm">Bồng <span class="lv-tag" id="petLv">Lv 3</span></div>
            <div class="mood" id="petMood">❤️ Đang vui</div>
          </div>
        </div>
        <div class="pet-exp">
          <span class="bar"><i id="petExpBar" style="width:60%"></i></span>
          <b id="petExpTxt">120 / 200</b>
        </div>
        <div class="pet-say" id="petSay">💬 Cùng nhau khám phá thế giới tri thức!</div>
      </div>

      <div class="panel">
        <h3>🏅 Thành tích nổi bật</h3>
        <div class="achv">
          <div class="ai">🌟</div><div class="an">Hoàn thành 100 câu hỏi</div>
          <div><div class="bar"><i style="width:68%"></i></div></div><div class="ap">68/100</div>
          <div class="av">🪙 +50</div>
        </div>
        <div class="achv">
          <div class="ai">📅</div><div class="an">Đăng nhập 7 ngày liền</div>
          <div><div class="bar"><i style="width:71%"></i></div></div><div class="ap">5/7</div>
          <div class="av">⭐ +100</div>
        </div>
        <div class="achv">
          <div class="ai">🌳</div><div class="an">Trồng 50 cây</div>
          <div><div class="bar"><i style="width:36%"></i></div></div><div class="ap">18/50</div>
          <div class="av">🪙 +75</div>
        </div>
        <div class="achv">
          <div class="ai">⚔️</div><div class="an">Hạ gục Boss đầu tiên</div>
          <div><div class="bar"><i style="width:0%"></i></div></div><div class="ap">0/1</div>
          <div class="av">🪙 +200</div>
        </div>
      </div>
    </aside>
  </div>
</div>

<!-- ============ OVERLAY: START ============ -->
<div class="overlay show" id="startOverlay">
  <div class="modal">
    <div style="font-size:52px">🧮</div>
    <h2>Math Adventure</h2>
    <div class="sub">Phiêu lưu Toán học — vừa học vừa chơi, nhận quà mỗi câu đúng!</div>

    <div class="mode-grid" id="modeGrid">
      <button class="mode on" data-mode="adventure">
        <span class="mi">🌱</span>Chinh phục<small>Kéo đáp án, tưới cây lớn lên</small>
      </button>
      <button class="mode" data-mode="maze">
        <span class="mi">🌀</span>Mê cung<small>Đi đến ô có đáp án đúng</small>
      </button>
      <button class="mode" data-mode="boss" id="bossModeBtn">
        <span class="mi">🐉</span>Boss Battle<small id="bossLockTxt">Mở khóa sau 3 câu đúng</small>
      </button>
    </div>

    <div class="pill" style="display:inline-flex">Độ khó: Dễ <span style="color:#F59E0B">⭐☆☆☆</span></div>
    <button class="btn green block" id="startBtn">▶ BẮT ĐẦU</button>
    <button class="btn ghost block" id="howBtn">❓ Cách chơi</button>
  </div>
</div>

<!-- ============ OVERLAY: REWARD ============ -->
<div class="overlay" id="rewardOverlay">
  <div class="modal">
    <div style="font-size:54px" id="rewardIcon">🎉</div>
    <h2 id="rewardTitle">Chính xác!</h2>
    <div class="sub" id="rewardSub">Bạn trả lời đúng</div>
    <div class="reward-list" id="rewardList">
      <div class="r">⭐ +10 EXP</div>
      <div class="r">🪙 +20 Coin</div>
      <div class="r">💧 +1 Nước</div>
    </div>
    <div class="plant-line" id="plantLine">🌱 Cây cà rốt đã lớn hơn!</div>
    <button class="btn green block" id="nextBtn">Câu tiếp theo →</button>
  </div>
</div>

<!-- ============ OVERLAY: KẾT THÚC ============ -->
<div class="overlay" id="doneOverlay">
  <div class="modal">
    <div style="font-size:56px">🎁</div>
    <h2>Hoàn thành màn chơi!</h2>
    <div class="sub" id="doneSub">Tuyệt vời, bạn đã phiêu lưu cùng Toán học!</div>
    <div class="reward-list">
      <div class="r" id="doneCorrect">✅ 8/10 câu đúng</div>
      <div class="r" id="doneExp">⭐ +80 EXP</div>
      <div class="r" id="doneCoin">🪙 +160 Coin</div>
      <div class="r" id="doneTime">⏱ 02:31</div>
    </div>
    <div class="plant-line" id="donePlant">🌳 Vườn nhà bạn đã xanh tươi hơn!</div>
    <button class="btn blue block" id="replayBtn">🔄 Chơi lại</button>
    <button class="btn ghost block" id="homeBtn">🏠 Về trang chủ</button>
  </div>
</div>

<!-- ============ OVERLAY: CÁCH CHƠI ============ -->
<div class="overlay" id="howOverlay">
  <div class="modal" style="text-align:left">
    <h2 style="text-align:center">❓ Cách chơi</h2>
    <div class="sub" style="text-align:center">Ba cách để bạn chinh phục Toán học</div>
    <div class="task"><div class="tic">🌱</div><div class="tinfo">
      <div class="tname">Chinh phục</div>
      <div style="font-size:12.5px;color:#64748B;margin-top:4px">Kéo (hoặc bấm) đáp án vào ô xanh. Đúng thì tưới cây, nhận EXP + Coin.</div>
    </div></div>
    <div class="task"><div class="tic">🌀</div><div class="tinfo">
      <div class="tname">Mê cung Toán học</div>
      <div style="font-size:12.5px;color:#64748B;margin-top:4px">Dùng phím ← ↑ → ↓ hoặc bấm ô kề để đi đến ô có đáp án đúng.</div>
    </div></div>
    <div class="task"><div class="tic">🐉</div><div class="tinfo">
      <div class="tname">Boss Battle</div>
      <div style="font-size:12.5px;color:#64748B;margin-top:4px">Trả lời đúng để tấn công Rồng Toán học. Sai vẫn được động viên, không phạt nặng!</div>
    </div></div>
    <button class="btn green block" id="howClose">Đã hiểu!</button>
  </div>
</div>

<script>
/* ==================================================================
   GAME STATE
   ================================================================== */
const STORE_KEY = "math_adventure_v1";

const S = {
  screen: "start",           // start | play | done
  mode: "adventure",         // adventure | maze | boss
  difficulty: "Dễ",

  questionIndex: 0,
  correct: 0,
  wrong: 0,
  exp: 320,                  // EXP trong level hiện tại
  expPerLevel: 600,
  level: 12,
  coins: 1250,
  hearts: 100,
  water: 0,
  petExp: 120, petExpMax: 200, petLevel: 3,

  hintsLeft: 3,
  selected: null,
  locked: false,

  bossHp: 500, bossMax: 500,
  mazePos: 4, mazeCells: [],
  correctSeen: 0,

  startedAt: 0, elapsed: 0,
  sound: true,
  playerName: "An Nhiên",
  gameId: null,
  apiBase: null,
  pendingAward: 0
};

/* ---------- persistence (sandboxed iframe → localStorage có thể bị chặn) ---------- */
const store = {
  get(k, def){
    try { const v = localStorage.getItem(k); return v == null ? def : JSON.parse(v); }
    catch (e) { return def; }
  },
  set(k, v){
    try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* ignore */ }
  }
};

function saveProgress(){
  store.set(STORE_KEY, {
    coins:S.coins, exp:S.exp, level:S.level, petExp:S.petExp, petLevel:S.petLevel,
    correctSeen:S.correctSeen, water:S.water, sound:S.sound, playerName:S.playerName
  });
}
function loadProgress(){
  const d = store.get(STORE_KEY, null);
  if (!d) return;
  ["coins","exp","level","petExp","petLevel","correctSeen","water"].forEach(k => {
    if (typeof d[k] === "number") S[k] = d[k];
  });
  if (typeof d.sound === "boolean") S.sound = d.sound;
  if (d.playerName) S.playerName = d.playerName;
}

/* ==================================================================
   QUESTIONS (mock data — sau này thay bằng API)
   ================================================================== */
const questions = [
  { id:1, type:"addition", question:"6 + 3 = ?", answer:9, options:[7,9,10,12],
    visual:{ groups:[6,3], op:"+", emoji:"🍎" },
    hint:"Đếm tổng số quả táo trong hai nhóm nhé!" },
  { id:2, type:"subtraction", question:"8 - 3 = ?", answer:5, options:[4,5,6,7],
    visual:{ groups:[8], op:"-", minus:3, emoji:"🥕" },
    hint:"Bớt đi 3 củ, còn lại bao nhiêu?" },
  { id:3, type:"multiplication", question:"3 × 4 = ?", answer:12, options:[9,11,12,14],
    visual:{ groups:[4,4,4], op:"×", label:"3 nhóm × 4 quả", emoji:"🍊" },
    hint:"Ba nhóm, mỗi nhóm 4 quả — cộng lại nhé!" },
  { id:4, type:"counting", question:"Có bao nhiêu củ cà rốt?", answer:5, options:[4,5,6,7],
    visual:{ groups:[5], emoji:"🥕", label:"Đếm từng củ" },
    hint:"Chỉ tay và đếm từ 1 đến 5 thôi." },
  { id:5, type:"division", question:"12 ÷ 3 = ?", answer:4, options:[3,4,5,6],
    visual:{ groups:[4,4,4], op:"÷", label:"12 quả chia đều cho 3 bạn", emoji:"🍓" },
    hint:"Mỗi bạn nhận được bao nhiêu?" },
  { id:6, type:"fraction", question:"3/4 + 1/4 = ?", answer:"1", options:["1","2/4","4/8","1/2"],
    visual:{ groups:[4], emoji:"🍕", label:"4 phần — đã ăn 3 phần, thêm 1 phần" },
    hint:"Cộng tử số, giữ nguyên mẫu số." },
  { id:7, type:"compare", question:"8 □ 5", answer:">", options:[">","<","="],
    visual:{ groups:[8], op:"vs", emoji:"🐟", groups2:[5] },
    hint:"Con số nào nhiều hơn?" },
  { id:8, type:"word", question:"Có 3 luống cây. Mỗi luống có 4 cây. Tất cả bao nhiêu cây?", answer:12, options:[7,10,12,14],
    visual:{ groups:[4,4,4], op:"×", label:"3 luống × 4 cây", emoji:"🌳" },
    hint:"Cộng 4 + 4 + 4 nhé!" },
  { id:9, type:"subtraction", question:"9 - 4 = ?", answer:5, options:[3,4,5,6],
    visual:{ groups:[9], op:"-", minus:4, emoji:"🍬" },
    hint:"Bớt 4 viên kẹo đi." },
  { id:10, type:"addition", question:"7 + 5 = ?", answer:12, options:[10,11,12,13],
    visual:{ groups:[7,5], op:"+", emoji:"⭐" },
    hint:"Bảy cộng năm — đếm tiếp từ 7 nhé." },
  { id:11, type:"multiplication", question:"5 × 6 = ?", answer:30, options:[25,30,35,36],
    visual:{ groups:[6,6,6,6,6], op:"×", label:"5 nhóm × 6", emoji:"🐞" },
    hint:"Năm nhóm, mỗi nhóm 6 bạn." },
  { id:12, type:"division", question:"20 ÷ 4 = ?", answer:5, options:[4,5,6,8],
    visual:{ groups:[5,5,5,5], op:"÷", label:"20 chia đều cho 4", emoji:"🍪" },
    hint:"Mỗi phần bằng bao nhiêu?" },
  { id:13, type:"counting", question:"Có bao nhiêu con cá?", answer:7, options:[5,6,7,8],
    visual:{ groups:[7], emoji:"🐟", label:"Đếm từng con" },
    hint:"Đếm từ trái sang phải." },
  { id:14, type:"compare", question:"6 + 1 □ 7", answer:"=", options:[">","<","="],
    visual:{ groups:[6,1], op:"+", emoji:"🐤" },
    hint:"Tính vế trái trước, rồi so sánh." },
  { id:15, type:"fraction", question:"2/5 + 3/5 = ?", answer:"1", options:["1","5/10","2/5","3/5"],
    visual:{ groups:[5], emoji:"🍫", label:"5 phần — 2 + 3 phần" },
    hint:"Cộng tử số, giữ nguyên mẫu số." },
  { id:16, type:"word", question:"Bạn An có 10 bóng, tặng bạn 3 bóng. Còn lại bao nhiêu?", answer:7, options:[6,7,8,13],
    visual:{ groups:[10], op:"-", minus:3, emoji:"🎈" },
    hint:"Mười trừ đi ba." }
];

const TOTAL_PLAY = 10;         // số câu mỗi màn
const DIFFS = ["Dễ","Trung bình","Khó"];

/* ==================================================================
   POSTMESSAGE BRIDGE (React parent)
   ================================================================== */
let parentOk = (window.parent && window.parent !== window);
function postToParent(type, data){
  if (!parentOk) return;
  try { window.parent.postMessage({ type, data: data || {} }, "*"); } catch (e) { /* ignore */ }
}
/* sự kiện nhiệm vụ — HtmlGameLoader chuyển sang /api/tasks/events */
function emit(type, data){
  if (!parentOk) return;
  try {
    window.parent.postMessage({ source:"game", type, data: Object.assign({ gameId: S.gameId || null }, data || {}) }, "*");
  } catch (e) { /* ignore */ }
}

window.addEventListener("message", (e) => {
  const m = e.data;
  if (!m || typeof m !== "object") return;

  if (m.type === "init") {
    const d = m.data || {};
    if (typeof d.coins === "number" && d.coins > 0) S.coins = d.coins;
    if (d.playerName && d.playerName !== "Player") S.playerName = d.playerName;
    if (d.gameId) S.gameId = d.gameId;
    if (d.apiBase) S.apiBase = d.apiBase;
    renderHeader();
    saveProgress();
  }
  if (m.type === "coins-added") {
    const d = m.data || {};
    if (d.success) {
      if (typeof d.coins === "number" && d.coins > 0) S.coins = d.coins;
      else S.coins += S.pendingAward;
    } else {
      S.coins += S.pendingAward;   // offline vẫn hiển thị tạm
    }
    S.pendingAward = 0;
    renderHeader(); saveProgress();
  }
});

/* ==================================================================
   UI HELPERS
   ================================================================== */
const $ = (id) => document.getElementById(id);
const fmt = (n) => (n || 0).toLocaleString("vi-VN");
const mmss = (sec) => String(Math.floor(sec/60)).padStart(2,"0") + ":" + String(sec%60).padStart(2,"0");

function renderHeader(){
  $("coinVal").textContent = fmt(S.coins);
  $("lvVal").textContent = "Lv " + S.level;
  $("expTxt").textContent = Math.round(S.exp) + " / " + S.expPerLevel;
  $("expBar").style.width = Math.min(100, (S.exp / S.expPerLevel) * 100) + "%";
  $("heartVal").textContent = S.hearts;
  $("playerName").textContent = S.playerName;
  const sIcon = S.sound ? "🔊" : "🔇";
  $("soundBtn").textContent = sIcon;
  $("soundBtn2").textContent = sIcon;
  $("soundBtn2").classList.toggle("off", !S.sound);
}

function renderProgress(){
  const total = S.mode === "adventure" ? TOTAL_PLAY : (S.mode === "boss" ? 6 : TOTAL_PLAY);
  const done = Math.min(S.questionIndex, total);
  const pct = Math.round((done / total) * 100);
  $("qCounter").textContent = "Câu " + Math.min(done + (S.screen === "done" ? 0 : 1), total) + " / " + total;
  $("progBar").style.width = Math.max(pct, done === total ? 100 : pct) + "%";
  $("progTxt").textContent = Math.max(pct, done === total ? 100 : pct) + "%";
  const di = DIFFS.indexOf(S.difficulty);
  $("qDiff").textContent = "Độ khó: " + S.difficulty + " " + "⭐".repeat(di+1) + "☆".repeat(3-di);
}

function renderTasks(){
  const qMade = Math.min(S.questionIndex + (S.correct + S.wrong > 0 ? 1 : 0), TOTAL_PLAY);
  const t1 = Math.min(5, qMade), t2 = Math.min(3, S.correct), t3 = S.screen === "done" ? 1 : 0;
  const set = (barId, txtId, val, target) => {
    $(barId).style.width = Math.round((val/target)*100) + "%";
    $(txtId).textContent = val + " / " + target;
    if (val >= target) $(barId).closest(".task").classList.add("done");
  };
  set("t1bar","t1txt",t1,5);
  set("t2bar","t2txt",t2,3);
  set("t3bar","t3txt",t3,1);
  const pending = [t1<5, t2<3, t3<1].filter(Boolean).length;
  $("taskBadge").textContent = pending;
  refreshBossLock();
}

const PLANTS = ["🌱","🌿","🪴","🥕","🥕","🌳"];
function renderPlant(pop){
  const stage = Math.min(S.correct, PLANTS.length - 1);
  const el = $("plant");
  el.textContent = PLANTS[stage];
  $("growTag").textContent = "Cà rốt · " + Math.min(S.correct,5) + "/5";
  if (pop) { el.classList.remove("pop"); void el.offsetWidth; el.classList.add("pop"); }
}

function renderPet(){
  const pct = Math.min(100, Math.round((S.petExp / S.petExpMax) * 100));
  $("petExpBar").style.width = pct + "%";
  $("petExpTxt").textContent = Math.round(S.petExp) + " / " + S.petExpMax;
  $("petLv").textContent = "Lv " + S.petLevel;
}
function petSay(text, mood){
  $("petSay").textContent = "💬 " + text;
  const b = $("petBubble");
  b.textContent = text;
  b.classList.add("show");
  if (mood) $("petMood").innerHTML = mood;
  clearTimeout(petSay._t);
  petSay._t = setTimeout(() => b.classList.remove("show"), 3200);
}
function addPetExp(n){
  S.petExp += n;
  if (S.petExp >= S.petExpMax) {
    S.petExp = 0; S.petLevel += 1;
    petSay("Tui lên Lv " + S.petLevel + " rồi, cảm ơn bạn nha!", "🎉 Đang sung sức");
  }
  renderPet(); saveProgress();
}

/* toast phản hồi nhanh */
let toastT;
function toast(msg, kind){
  const t = $("toast");
  t.textContent = msg;
  t.className = "toast show " + (kind || "");
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove("show"), 1800);
}

/* confetti nhẹ */
function confetti(n){
  const stage = $("stage");
  const chars = ["🎉","✨","⭐","🌟","🍬","💛"];
  for (let i = 0; i < (n || 16); i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = chars[i % chars.length];
    c.style.left = (10 + Math.random() * 80) + "%";
    c.style.animationDuration = (1.4 + Math.random() * 1.2) + "s";
    stage.appendChild(c);
    setTimeout(() => c.remove(), 2800);
  }
}

/* âm thanh nhỏ bằng WebAudio (không cần file) */
let actx = null;
function beep(kind){
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.connect(g); g.connect(actx.destination);
    const now = actx.currentTime;
    o.type = "sine";
    if (kind === "good") { o.frequency.setValueAtTime(660, now); o.frequency.exponentialRampToValueAtTime(990, now+.16); }
    else if (kind === "bad") { o.frequency.setValueAtTime(300, now); o.frequency.exponentialRampToValueAtTime(190, now+.18); }
    else { o.frequency.setValueAtTime(520, now); }
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.14, now+.02);
    g.gain.exponentialRampToValueAtTime(0.0001, now+.25);
    o.start(now); o.stop(now+.26);
  } catch (e) { /* ignore */ }
}

/* coin bay lên header */
function flyCoin(fromEl, text){
  const target = $("coinChip").getBoundingClientRect();
  const from = (fromEl || $("qcard")).getBoundingClientRect();
  const c = document.createElement("div");
  c.textContent = text || "🪙";
  c.style.cssText = "position:fixed;z-index:99;font-size:24px;pointer-events:none;left:" +
    (from.left + from.width/2) + "px;top:" + (from.top + from.height/2) + "px;transition:.8s cubic-bezier(.4,-.2,.6,1)";
  document.body.appendChild(c);
  requestAnimationFrame(() => {
    c.style.left = (target.left + target.width/2) + "px";
    c.style.top = (target.top + target.height/2) + "px";
    c.style.transform = "scale(.5)";
    c.style.opacity = ".2";
  });
  setTimeout(() => c.remove(), 900);
}

/* ==================================================================
   GAME LOGIC
   ================================================================== */
function currentQuestion(){ return questions[S.questionIndex % questions.length]; }

function startGame(mode){
  S.mode = mode || S.mode;
  S.screen = "play";
  S.questionIndex = 0; S.correct = 0; S.wrong = 0; S.hintsLeft = 3;
  S.selected = null; S.locked = false;
  S.hearts = 100; S.bossHp = S.bossMax; S.water = 0;
  S.startedAt = Date.now(); S.elapsed = 0;
  $("hintBtn").textContent = "💡 Mẹo (" + S.hintsLeft + ")";
  $("hintBtn").disabled = false;
  hide("startOverlay"); hide("doneOverlay"); hide("rewardOverlay");
  renderHeader(); renderProgress(); renderTasks(); renderPlant(false);
  petSay(mode === "boss" ? "Cẩn thận nhé, rồng đang đợi!" : "Bắt đầu nào! Tui ở bên bạn nha~", "🔥 Đang sẵn sàng");
  renderQuestion();
}

function checkAnswer(value, chipEl){
  if (S.locked || S.screen !== "play") return;
  S.locked = true;

  const q = currentQuestion();
  const ok = String(value) === String(q.answer);

  emit("QUESTION_ANSWERED", { metadata:{ amount:1 } });

  if (ok) {
    S.correct++; S.correctSeen++;
    if (chipEl) { chipEl.classList.add("ok"); }
    beep("good"); confetti(14);
    addExp(10); addCoins(20, chipEl);
    S.water += 1;
    addPetExp(8);
    renderPlant(true);
    emit("ANSWER_CORRECT", { metadata:{ amount:1 } });

    if (S.mode === "boss") {
      const dmg = 100;
      S.bossHp = Math.max(0, S.bossHp - dmg);
      floatDmg("-" + dmg + " HP");
      petSay("Boom! Đánh trúng rồng rồi!", "💪 Đang hăng say");
    } else {
      petSay("Tuyệt vời! Đúng rồi đó!", "❤️ Đang vui");
    }

    renderProgress(); renderTasks();
    setTimeout(() => showReward(ok), 420);
  } else {
    S.wrong++;
    if (chipEl) { chipEl.classList.add("bad"); setTimeout(() => chipEl.classList.remove("bad"), 600); }
    beep("bad");
    addExp(2);                                  // vẫn được thưởng nhẹ
    if (S.mode === "boss") { S.hearts = Math.max(0, S.hearts - 10); renderHeader(); }
    petSay("Thử lại nhé! Bạn làm được mà~", "💡 Đang nghĩ");
    toast("💡 Gần đúng rồi! Hãy thử lại — bạn vẫn được +2 EXP.", "bad");
    renderProgress(); renderTasks();
    S.locked = false;                            // cho phép trả lời lại
    clearSlot();
    if (S.hearts <= 0) { finish(); }
  }
}

function addExp(n){
  S.exp += n;
  while (S.exp >= S.expPerLevel) { S.exp -= S.expPerLevel; S.level += 1; toast("🎉 Lên Lv " + S.level + "!", "good"); }
  renderHeader(); saveProgress();
}
function addCoins(n, fromEl){
  S.pendingAward = n;
  postToParent("add-coins", { amount: n });
  flyCoin(fromEl, "+" + n);
  if (!parentOk) { S.coins += n; S.pendingAward = 0; renderHeader(); }
  clearTimeout(S._awardT);
  if (S.pendingAward > 0) {                 // không có parent trả lời → cộng tạm offline
    S._awardT = setTimeout(() => {
      if (S.pendingAward > 0) {
        S.coins += S.pendingAward; S.pendingAward = 0;
        renderHeader(); saveProgress();
      }
    }, 1200);
  }
  saveProgress();
}

function floatDmg(text){
  const wrap = $("playSlot");
  const d = document.createElement("div");
  d.className = "dmg-float"; d.textContent = text;
  wrap.style.position = "relative";
  wrap.appendChild(d);
  setTimeout(() => d.remove(), 950);
}

function showReward(ok){
  if (!ok) return;
  const bossKilled = S.mode === "boss" && S.bossHp <= 0;
  $("rewardIcon").textContent = bossKilled ? "🏆" : "🎉";
  $("rewardTitle").textContent = bossKilled ? "Đã hạ gục Rồng!" : "Chính xác!";
  $("rewardSub").textContent = "Bạn trả lời đúng câu " + (S.questionIndex + 1);
  $("plantLine").textContent = S.correct % 5 === 0 && S.correct > 0
    ? "🌱 Cây cà rốt đã lớn thêm một khúc!"
    : "🌱 Cây trong vườn đã lớn hơn!";
  const isLast = S.questionIndex + 1 >= TOTAL_PLAY || bossKilled;
  $("nextBtn").textContent = isLast ? "🎁 Xem phần thưởng" : "Câu tiếp theo →";
  show("rewardOverlay");
}

function nextQuestion(){
  hide("rewardOverlay");
  if (S.mode === "boss" && S.bossHp <= 0) { finish(); return; }
  S.questionIndex++;
  if (S.mode === "adventure" && S.questionIndex >= TOTAL_PLAY) { finish(); return; }
  if (S.mode === "boss" && S.questionIndex >= 6) { finish(); return; }
  S.selected = null; S.locked = false;
  renderQuestion();
}

function finish(){
  S.screen = "done";
  S.locked = true;
  S.elapsed = Math.round((Date.now() - S.startedAt) / 1000);

  emit("GAME_PLAYED", { metadata:{ amount:1 } });
  if (S.correct > 0) emit("GAME_WON", { metadata:{ amount:1, score: S.correct * 10, won:true } });

  const total = S.mode === "adventure" ? TOTAL_PLAY : Math.max(1, S.questionIndex + 1);
  const expGain = S.correct * 10;
  $("doneCorrect").textContent = "✅ " + S.correct + "/" + total + " câu đúng";
  $("doneExp").textContent = "⭐ +" + expGain + " EXP";
  $("doneCoin").textContent = "🪙 +" + (S.correct * 20) + " Coin";
  $("doneTime").textContent = "⏱ " + mmss(S.elapsed);
  $("donePlant").textContent = S.correct >= total * 0.8
    ? "🌳 Vườn nhà bạn xanh tươi — Bồng rất tự hào!"
    : "🌱 Vườn đã lớn hơn một chút, lần sau giỏi hơn nhé!";

  postToParent("game-over", {
    score: S.correct * 10,
    correct: S.correct,
    totalQuestions: total,
    timeUsed: S.elapsed,
    coinReward: 0            // coin đã cộng theo từng câu qua add-coins
  });

  renderTasks();
  setTimeout(() => { show("doneOverlay"); confetti(24); beep("good"); }, 350);
  saveProgress();
}

/* ==================================================================
   RENDER: câu hỏi + đáp án
   ================================================================== */
function renderQuestion(){
  const q = currentQuestion();
  renderProgress();
  $("qTitle").textContent = q.type === "boss" ? "⚔️" : "🌳 " + questionLabel(q.type);

  const host = $("playSlot");
  host.innerHTML = "";

  const head = document.createElement("div");
  head.innerHTML =
    '<div class="qtext">' + esc(q.question) + '</div>' +
    (q.hintText ? '<div class="qsub">' + esc(q.hintText) + '</div>' : '');
  host.appendChild(head);

  if (q.visual) host.appendChild(buildVisual(q.visual));

  if (S.mode === "maze") {
    host.appendChild(buildMazeWrap());
    paintMaze();                 // grid đã nằm trong DOM mới vẽ được trạng thái
  }
  else if (S.mode === "boss") host.appendChild(buildBossWrap(q));
  else host.appendChild(buildPlayWrap(q));
}

function questionLabel(t){
  return ({
    addition:"CỘNG", subtraction:"TRỪ", multiplication:"NHÂN", division:"CHIA",
    counting:"ĐẾM VẬT", fraction:"PHÂN SỐ", compare:"SO SÁNH", word:"BÀI TOÁN HÌNH ẢNH"
  })[t] || "TOÁN HỌC";
}

function buildVisual(v){
  const wrap = document.createElement("div");
  wrap.className = "visual";
  let html = "";
  v.groups.forEach((n, i) => {
    if (i > 0) html += '<div class="vop">' + (v.op === "×" ? "+" : v.op === "vs" ? "vs" : v.op) + '</div>';
    let cells = "";
    for (let k = 0; k < n; k++) cells += v.emoji;
    html += '<div class="vgroup">' + cells + (v.minus ? ' <span style="opacity:.45;text-decoration:line-through">' +
      (v.emoji.repeat(v.minus)) + '</span>' : '') + '</div>';
  });
  if (v.groups2) {
    html += '<div class="vop">vs</div>';
    let cells = ""; for (let k = 0; k < v.groups2[0]; k++) cells += v.emoji;
    html += '<div class="vgroup">' + cells + '</div>';
  }
  wrap.innerHTML = html + (v.label ? '<div class="qsub" style="width:100%">' + esc(v.label) + '</div>' : "");
  return wrap;
}

/* --- chế độ Chinh phục: kéo & thả --- */
function buildPlayWrap(q){
  const wrap = document.createElement("div");
  wrap.className = "play-area";

  const dz = document.createElement("div");
  dz.className = "dropzone";
  dz.id = "dz";
  dz.innerHTML = '<div class="slot" id="slot">?</div><div class="hint-txt">Kéo đáp án vào đây</div>';

  const opts = document.createElement("div");
  opts.className = "options";
  opts.id = "options";
  shuffle(q.options.slice()).forEach(val => opts.appendChild(makeChip(val)));

  wrap.appendChild(dz);
  wrap.appendChild(opts);
  return wrap;
}

function makeChip(val){
  const b = document.createElement("button");
  b.className = "opt";
  b.type = "button";
  b.dataset.val = val;
  b.innerHTML = '<span>' + esc(String(val)) + '</span><small>🎯 kéo hoặc bấm</small>';
  b.addEventListener("click", () => { if (!b._dragged) place(val, b); });
  b.addEventListener("pointerdown", (e) => startDrag(e, b, val));
  return b;
}

function place(val, chip){
  if (S.locked) return;
  S.selected = val;
  const slot = $("slot");
  if (slot) slot.textContent = String(val);
  const chips = document.querySelectorAll(".opt");
  chips.forEach(c => c.classList.add("used"));
  if (chip) chip.classList.remove("used");
  setTimeout(() => checkAnswer(val, chip), 180);
}
function clearSlot(){
  const slot = $("slot"); if (slot) slot.textContent = "?";
  document.querySelectorAll(".opt").forEach(c => c.classList.remove("used","ok","bad"));
}

/* kéo thả bằng pointer (hoạt động cả chuột & cảm ứng) */
let drag = null;
function startDrag(e, chip, val){
  if (S.locked) return;
  if (e.button && e.button !== 0) return;
  drag = { chip, val, x0:e.clientX, y0:e.clientY, moved:false, ghost:null };
  document.addEventListener("pointermove", onDragMove);
  document.addEventListener("pointerup", onDragEnd, { once:true });
}
function onDragMove(e){
  if (!drag) return;
  const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
  if (!drag.moved && Math.hypot(dx, dy) < 7) return;
  if (!drag.moved) {
    drag.moved = true;
    drag.chip._dragged = true;
    const g = document.createElement("div");
    g.className = "drag-ghost";
    g.textContent = String(drag.val);
    document.body.appendChild(g);
    drag.ghost = g;
    const dz = $("dz"); if (dz) dz.classList.add("over");
  }
  drag.ghost.style.left = e.clientX + "px";
  drag.ghost.style.top = e.clientY + "px";
}
function onDragEnd(e){
  document.removeEventListener("pointermove", onDragMove);
  if (!drag) return;
  const d = drag; drag = null;
  if (d.ghost) d.ghost.remove();
  const dz = $("dz");
  if (dz) dz.classList.remove("over");

  if (d.moved) {
    const r = dz ? dz.getBoundingClientRect() : null;
    const inside = r && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (inside) place(d.val, d.chip);
  }
  setTimeout(() => { d.chip._dragged = false; }, 0);
}

/* --- Mê cung --- */
function buildMazeWrap(){
  const q = currentQuestion();
  const wrap = document.createElement("div");
  wrap.className = "maze-wrap";

  const nums = [q.answer];
  let guard = 0;
  while (nums.length < 9 && guard++ < 60) {
    const d = Math.floor(Math.random() * 12) - 5;
    const v = Number(q.answer) + d;
    if (v !== Number(q.answer) && v >= 0 && !nums.includes(v)) nums.push(v);
  }
  while (nums.length < 9) nums.push(nums.length + 11);
  S.mazeCells = shuffle(nums);
  S.mazePos = 4;
  // đáp án không được nằm đúng ô xuất phát của nhân vật
  if (String(S.mazeCells[4]) === String(q.answer)) {
    const k = S.mazeCells.findIndex((v, i) => i !== 4 && String(v) !== String(q.answer));
    if (k >= 0) {
      const t = S.mazeCells[4]; S.mazeCells[4] = S.mazeCells[k]; S.mazeCells[k] = t;
    }
  }

  const tag = document.createElement("div");
  tag.className = "maze-tag";
  tag.innerHTML = "🚩 START ↓ &nbsp;·&nbsp; Đi đến ô có đáp án đúng ↓ 🏆";
  wrap.appendChild(tag);

  const grid = document.createElement("div");
  grid.className = "maze";
  grid.id = "mazeGrid";
  S.mazeCells.forEach((v, i) => {
    const c = document.createElement("button");
    c.className = "cell";
    c.type = "button";
    c.dataset.i = i;
    c.innerHTML = "<span>" + esc(String(v)) + "</span>";
    c.addEventListener("click", () => mazeStep(i));
    grid.appendChild(c);
  });
  wrap.appendChild(grid);

  const keys = document.createElement("div");
  keys.className = "maze-keys";
  keys.innerHTML = '<span class="kbd">←</span><span class="kbd">↑</span><span class="kbd">↓</span><span class="kbd">→</span><span>hoặc bấm ô kề</span>';
  wrap.appendChild(keys);

  paintMaze();
  return wrap;
}
function paintMaze(){
  const grid = $("mazeGrid"); if (!grid) return;
  [...grid.children].forEach((c, i) => {
    c.classList.toggle("here", i === S.mazePos);
    c.classList.toggle("goal", i !== S.mazePos && String(S.mazeCells[i]) === String(currentQuestion().answer));
  });
}
function mazeStep(target){
  if (S.locked) return;
  const a = S.mazePos, b = target;
  const ar = Math.floor(a/3), ac = a%3, br = Math.floor(b/3), bc = b%3;
  const dist = Math.abs(ar-br) + Math.abs(ac-bc);
  if (dist > 1) { toast("Chỉ đi được 1 ô thôi nhé!", ""); return; }
  S.mazePos = target;
  paintMaze();
  const v = S.mazeCells[target];
  if (String(v) === String(currentQuestion().answer)) {
    const cell = $("mazeGrid").children[target];
    checkAnswer(v, cell);
  } else {
    beep("bad");
    toast("🌀 Ô này sai rồi — đi tiếp nhé!", "bad");
    petSay("Không sao, cứ thử ô khác!", "💡 Đang nghĩ");
  }
}
document.addEventListener("keydown", (e) => {
  if (S.mode !== "maze" || S.screen !== "play" || S.locked) return;
  const map = { ArrowUp:-3, ArrowDown:3, ArrowLeft:-1, ArrowRight:1 };
  if (!(e.key in map)) return;
  e.preventDefault();
  const delta = map[e.key];
  const next = S.mazePos + delta;
  if (next < 0 || next > 8) return;
  if (delta === -1 && S.mazePos % 3 === 0) return;
  if (delta === 1 && S.mazePos % 3 === 2) return;
  mazeStep(next);
});

/* --- Boss Battle --- */
function buildBossWrap(q){
  const wrap = document.createElement("div");
  wrap.innerHTML =
    '<div class="boss-wrap">' +
      '<div class="boss-top">' +
        '<div class="boss-face">🐉</div>' +
        '<div class="boss-info">' +
          '<div class="boss-name">⚔️ RỒNG TOÁN HỌC <span class="lv-tag">Boss</span></div>' +
          '<div class="boss-hp">' +
            '<span class="bar"><i id="bossBar" style="width:' + (S.bossHp/S.bossMax*100) + '%"></i></span>' +
            '<b id="bossHpTxt">' + S.bossHp + '/' + S.bossMax + '</b>' +
          '</div>' +
          '<div style="font-size:11.5px;color:#B91C1C;font-weight:800;margin-top:6px">Trả lời đúng để tấn công · ❤️ ' + S.hearts + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  const opts = document.createElement("div");
  opts.className = "options";
  opts.style.maxWidth = "460px";
  opts.style.margin = "12px auto 0";
  shuffle(q.options.slice()).forEach(val => opts.appendChild(makeChip(val)));
  wrap.appendChild(opts);
  return wrap;
}

/* ==================================================================
   RENDER phụ
   ================================================================== */
function renderSide(){ renderTasks(); renderPet(); }

function esc(s){
  return String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function shuffle(arr){
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
function show(id){ $(id).classList.add("show"); }
function hide(id){ $(id).classList.remove("show"); }

/* ==================================================================
   EVENTS / UI
   ================================================================== */
$("startBtn").addEventListener("click", () => startGame(S.mode));
$("howBtn").addEventListener("click", () => show("howOverlay"));
$("howClose").addEventListener("click", () => hide("howOverlay"));

document.querySelectorAll("#modeGrid .mode").forEach(btn => {
  btn.addEventListener("click", () => {
    if (btn.classList.contains("locked")) {
      toast("🌟 Trả lời đúng 3 câu để mở khóa Boss!", "");
      return;
    }
    document.querySelectorAll("#modeGrid .mode").forEach(b => b.classList.remove("on"));
    btn.classList.add("on");
    S.mode = btn.dataset.mode;
  });
});

$("nextBtn").addEventListener("click", nextQuestion);
$("replayBtn").addEventListener("click", () => { hide("doneOverlay"); startGame(S.mode); });
$("homeBtn").addEventListener("click", () => { hide("doneOverlay"); postToParent("quit"); toast("Về trang chủ nhé! 🌱", ""); setTimeout(() => { S.screen="start"; show("startOverlay"); }, 400); });

$("hintBtn").addEventListener("click", () => {
  const q = currentQuestion();
  if (S.hintsLeft <= 0) { toast("Bạn đã dùng hết mẹo rồi, cố lên lần sau! 💪", ""); return; }
  S.hintsLeft--;
  toast("💡 " + (q.hint || "Đọc kỹ đề bài rồi thử nhé!"), "");
  petSay(q.hint || "Đọc kỹ đề bài nhé!", "💡 Đang nghĩ");
  $("hintBtn").textContent = "💡 Mẹo (" + S.hintsLeft + ")";
  if (S.hintsLeft <= 0) $("hintBtn").disabled = true;
});

function toggleSound(){ S.sound = !S.sound; renderHeader(); saveProgress(); if (S.sound) beep("ok"); }
$("soundBtn").addEventListener("click", toggleSound);
$("soundBtn2").addEventListener("click", toggleSound);

$("rail").addEventListener("click", (e) => {
  const b = e.target.closest("button"); if (!b) return;
  const act = b.dataset.act;
  if (act === "home") { postToParent("quit"); toast("Về trang chủ nhé! 🌱", ""); return; }
  if (act === "play") {
    document.querySelectorAll("#rail button").forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    if (S.screen !== "play") show("startOverlay");
    return;
  }
  toast("⚠️ Tính năng này nằm ngoài prototype Math Adventure.", "");
});

/* timer */
setInterval(() => {
  if (S.screen === "play") {
    S.elapsed = Math.round((Date.now() - S.startedAt) / 1000);
    $("timer").textContent = mmss(S.elapsed);
  }
}, 1000);

/* unlock boss sau 3 câu đúng */
function refreshBossLock(){
  const locked = S.correctSeen < 3;
  const btn = $("bossModeBtn");
  btn.classList.toggle("locked", locked);
  $("bossLockTxt").textContent = locked ? ("Mở khóa sau " + Math.max(0, 3 - S.correctSeen) + " câu đúng") : "Thử thách Rồng Toán học!";
  if (locked && S.mode === "boss") S.mode = "adventure";
}

/* ==================================================================
   INIT
   ================================================================== */
function initGame(){
  if (initGame._done) return;
  initGame._done = true;
  loadProgress();
  refreshBossLock();
  renderHeader();
  renderProgress();
  renderSide();
  renderPlant(false);
  petSay("Chào " + S.playerName + "! Cùng học Toán thôi~", "❤️ Đang vui");

  $("hintBtn").textContent = "💡 Mẹo (" + S.hintsLeft + ")";

  if (parentOk) {
    postToParent("ready");
    postToParent("hide-hud");      // game tự render header → tắt HUD của app
  } else {
    renderQuestion();
  }
  window.addEventListener("resize", () => { if (S.mode === "maze") paintMaze(); });
}

/* Khi nhận init từ parent → render câu hỏi lần đầu */
window.addEventListener("message", (e) => {
  if (e.data && e.data.type === "init" && S.screen === "start") {
    if (questions[S.questionIndex]) renderQuestion();
  }
});

document.addEventListener("DOMContentLoaded", initGame);
if (document.readyState !== "loading") initGame();
<\/script>
</body>
</html>
`,c=n(),l={id:`math-adventure`,code:`math-adventure`,name:`Math Adventure`,title:`Math Adventure – Phiêu lưu Toán học`,subject:`Toán học`},u=(e=0)=>`${String(Math.floor(e/60)).padStart(2,`0`)}:${String(e%60).padStart(2,`0`)}`;function d(){let{user:e,token:t}=r(),n=e?{user:e,token:t}:null,[d,f]=(0,o.useState)(null),[p,m]=(0,o.useState)(0),h=(0,o.useCallback)(e=>f(e),[]),g=(0,o.useCallback)(()=>i(`/`),[]);return(0,c.jsxs)(`div`,{className:`fixed inset-0 bg-paper`,children:[(0,c.jsx)(a,{htmlContent:s,game:l,questions:[],playerName:e?.fullName||e?.username||`An Nhiên`,playMode:`solo`,userAuth:n,onFinish:h,onQuit:g,onStateUpdate:()=>{}},`math-adventure-${p}`),d&&(0,c.jsx)(`div`,{className:`fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 backdrop-blur-sm p-4`,children:(0,c.jsxs)(`div`,{className:`w-full max-w-[420px] rounded-[26px] bg-white p-6 text-center shadow-2xl`,children:[(0,c.jsx)(`div`,{className:`text-5xl`,children:`🎁`}),(0,c.jsx)(`h2`,{className:`mt-2 text-2xl font-display font-bold text-ink`,children:`Hoàn thành màn chơi!`}),(0,c.jsxs)(`p`,{className:`mt-1 text-sm font-semibold text-slate-500`,children:[d.correct,`/`,d.totalQuestions,` câu đúng · `,u(d.timeUsed)]}),(0,c.jsxs)(`div`,{className:`mt-4 grid grid-cols-3 gap-2`,children:[(0,c.jsxs)(`div`,{className:`rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-3 text-sm font-extrabold text-amber-700`,children:[`⭐ +`,d.correct*10,` EXP`]}),(0,c.jsxs)(`div`,{className:`rounded-2xl border-2 border-amber-200 bg-amber-50 px-2 py-3 text-sm font-extrabold text-amber-700`,children:[`🪙 +`,d.correct*20]}),(0,c.jsxs)(`div`,{className:`rounded-2xl border-2 border-emerald-200 bg-emerald-50 px-2 py-3 text-sm font-extrabold text-emerald-700`,children:[`💧 +`,d.correct]})]}),(0,c.jsx)(`button`,{onClick:()=>{f(null),m(e=>e+1)},className:`mt-5 w-full rounded-full bg-gradient-to-br from-sky-400 to-blue-600 px-6 py-3 text-sm font-extrabold text-white shadow-lg transition active:translate-y-0.5`,children:`🔄 Chơi lại`}),(0,c.jsx)(`button`,{onClick:()=>i(`/`),className:`mt-2 w-full rounded-full bg-slate-100 px-6 py-3 text-sm font-extrabold text-slate-500 shadow transition hover:bg-slate-200`,children:`🏠 Về trang chủ`})]})})]})}export{d as default};