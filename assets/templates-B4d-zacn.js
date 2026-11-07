import{r as e}from"./api-Ds8_HBCA.js";function t(e={}){let t=new URLSearchParams;for(let[n,r]of Object.entries(e))r!=null&&r!==``&&t.set(n,r);let n=t.toString();return n?`?${n}`:``}var n={async listMine(n={}){return e(`/documents/mine${t(n)}`,{_withPagination:!0})},async get(t){return e(`/documents/${encodeURIComponent(t)}`)},async create(t){return e(`/documents`,{method:`POST`,body:t})},async update(t,n){return e(`/documents/${encodeURIComponent(t)}`,{method:`PUT`,body:n})},async remove(t){return e(`/documents/${encodeURIComponent(t)}`,{method:`DELETE`})}},r=`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Bài 1: Phép cộng trong phạm vi 100</title>
<style>
.lesson-slide {
  font-family: Arial, sans-serif;
  padding: 32px;
  color: #1f2937;
}

.lesson-slide h1 {
  color: #2563eb;
  font-size: 28px;
}

.lesson-description {
  font-size: 18px;
  line-height: 1.6;
}
</style>
</head>
<body>
<section class="lesson-slide">
  <h1>Bài 1: Phép cộng trong phạm vi 100</h1>

  <p class="lesson-description">
    Học sinh hiểu và thực hiện được phép cộng
    hai số có hai chữ số.
  </p>

  <ul>
    <li>Nhận biết các thành phần của phép cộng.</li>
    <li>Thực hiện phép cộng có nhớ.</li>
    <li>Giải bài toán thực tế.</li>
  </ul>
</section>
</body>
</html>
`,i=`<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<title>Bài 1: Phép cộng trong phạm vi 100</title>
<style>
.slide {
  font-family: Arial, sans-serif;
  color: #1f2937;
  padding: 40px;
}

.slide h1 {
  color: #2563eb;
  font-size: 36px;
  text-align: center;
}

.slide h2 {
  color: #2563eb;
  font-size: 26px;
}

.slide-subtitle {
  text-align: center;
  font-size: 20px;
  color: #6b7280;
}
</style>
</head>
<body>
<section class="slide">
  <h1>Phép cộng trong phạm vi 100</h1>
  <p class="slide-subtitle">Toán lớp 2</p>
</section>

<section class="slide">
  <h2>Mục tiêu bài học</h2>
  <ul>
    <li>Nhận biết các thành phần của phép cộng.</li>
    <li>Thực hiện phép cộng có nhớ.</li>
    <li>Giải bài toán thực tế.</li>
  </ul>
</section>

<section class="slide">
  <h2>Ví dụ</h2>
  <ul>
    <li>35 + 27 = ?</li>
    <li>35 + 20 = 55</li>
    <li>55 + 7 = 62</li>
  </ul>
</section>
</body>
</html>
`,a={type:`document`,title:`Bài 1: Phép cộng trong phạm vi 100`,subject:`Toán`,grade:2,blocks:[{type:`heading`,level:1,text:`Bài 1: Phép cộng trong phạm vi 100`},{type:`paragraph`,text:`Học sinh hiểu và thực hiện được phép cộng hai số có hai chữ số.`},{type:`heading`,level:2,text:`Mục tiêu bài học`},{type:`list`,ordered:!1,items:[`Nhận biết các thành phần của phép cộng.`,`Thực hiện phép cộng có nhớ.`,`Giải bài toán thực tế.`]},{type:`heading`,level:2,text:`Ví dụ`},{type:`paragraph`,text:`35 + 27 = ? Ta tính: 35 + 20 = 55, 55 + 7 = 62. Vậy 35 + 27 = 62.`},{type:`table`,rows:[[`Phép tính`,`Kết quả`],[`24 + 15`,`39`],[`46 + 38`,`84`]]}]},o={type:`presentation`,title:`Bài 1: Phép cộng trong phạm vi 100`,subject:`Toán`,grade:2,slides:[{type:`title`,title:`Phép cộng trong phạm vi 100`,subtitle:`Toán lớp 2`},{type:`content`,title:`Mục tiêu bài học`,content:[`Nhận biết các thành phần của phép cộng.`,`Thực hiện phép cộng có nhớ.`,`Giải bài toán thực tế.`]},{type:`content`,title:`Ví dụ`,content:[`35 + 27 = ?`,`35 + 20 = 55`,`55 + 7 = 62`]},{type:`table`,title:`Luyện tập nhanh`,rows:[[`Phép tính`,`Kết quả`],[`24 + 15`,`39`],[`46 + 38`,`84`]]},{type:`summary`,title:`Tổng kết`,content:[`Cộng lần lượt từ hàng đơn vị sang hàng chục.`,`Nhớ 1 khi tổng một hàng từ 10 trở lên.`]}]},s=JSON.stringify(a,null,2),c=JSON.stringify(o,null,2);function l(e,t){return t===`json`?e===`powerpoint`?c:s:e===`powerpoint`?i:r}export{n,l as t};