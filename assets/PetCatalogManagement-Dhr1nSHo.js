import{o as e}from"./rolldown-runtime-C0FnF6B9.js";import{n as t,t as n}from"./jsx-runtime-CKeovgl0.js";import{r}from"./api-gdU94oSS.js";import{t as i}from"./info-iRNzpaxE.js";import{n as a,r as o}from"./sprout-T5EG2m50.js";import{t as s}from"./rotate-ccw-FH5M-rG9.js";import{t as c}from"./save-BhPneH_G.js";import{t as l}from"./shirt-Di1uHFV_.js";import{$ as u,Dn as d,En as ee,J as te,Rt as ne,U as re,V as ie,Z as ae,at as f,bt as p,it as oe,sn as se,tt as ce}from"./index-C7VA6NND.js";import{t as le}from"./useConfirm-CZFhby4t.js";var m=e(t(),1),h=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Chó kem · lớp THÂN + ĐẦU
    Đây là lớp nền của pet. Các trang phục áo/áo choàng/ba lô vẽ đè lên.
    Xem ears.svg để biết quy ước hệ toạ độ.
  -->
  <g id="pet-body">
    <!-- thân -->
    <path d="M256 292c52 0 94 36 100 86 3 26 4 50 4 64 0 16-13 28-29 28H181c-16 0-29-12-29-28 0-14 1-38 4-64 6-50 48-86 100-86z"
          fill="{{body}}"/>
    <!-- bụng sáng -->
    <ellipse cx="256" cy="404" rx="60" ry="58" fill="{{accent}}" opacity=".55"/>
    <!-- chân trước -->
    <ellipse cx="212" cy="452" rx="34" ry="26" fill="{{dark}}"/>
    <ellipse cx="300" cy="452" rx="34" ry="26" fill="{{dark}}"/>
    <ellipse cx="212" cy="448" rx="24" ry="16" fill="{{accent}}" opacity=".5"/>
    <ellipse cx="300" cy="448" rx="24" ry="16" fill="{{accent}}" opacity=".5"/>
    <!-- cổ: dải nối thân với đầu -->
    <path d="M196 278c0-16 27-26 60-26s60 10 60 26c0 18-27 30-60 30s-60-12-60-30z"
          fill="{{dark}}"/>
    <!-- đầu -->
    <ellipse cx="256" cy="198" rx="104" ry="94" fill="{{body}}"/>
    <!-- sáng nhẹ trên trán cho khối -->
    <ellipse cx="232" cy="158" rx="54" ry="36" fill="{{accent}}" opacity=".35"/>
  </g>
</svg>`,g=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Chó kem · lớp TAI
    Tai chó RỦ: bám ở đỉnh bên đầu rồi xõa dọc xuống, dưới đáy đầu một đoạn
    để nhìn ra tai chứ không phải mào. Vẽ sau (z thấp hơn) lớp thân-đầu.

    Hệ toạ độ dùng chung:
      đầu  : ellipse (256, 198) r 104×94  → x 152..360, y 104..292
      thân : y 296 → 470
      mắt  : (224, 190) và (288, 190)
      mũi  : (256, 232)
  -->
  <g id="pet-ears">
    <!-- tai trái: mép trên bám ở (175,125), xõa ra trái rồi rủ xuống tới y=322 -->
    <path d="M175 125C145 131 122 175 120 240c-2 48 18 82 46 82 20 0 34-22 36-54 3-58 2-118-2-138-4-12-14-7-25-5z"
          fill="{{dark}}"/>
    <path d="M176 139c-22 8-38 46-38 102-1 40 15 66 32 66 12 0 21-16 23-42 2-48 1-102-1-118-2-10-8-9-16-8z"
          fill="{{body}}" opacity=".5"/>
    <!-- tai phải: lật ngang -->
    <path d="M337 125c30 6 53 50 55 115 2 48-18 82-46 82-20 0-34-22-36-54-3-58-2-118 2-138 4-12 14-7 25-5z"
          fill="{{dark}}"/>
    <path d="M336 139c22 8 38 46 38 102 1 40-15 66-32 66-12 0-21-16-23-42-2-48-1-102 1-118 2-10 8-9 16-8z"
          fill="{{body}}" opacity=".5"/>
  </g>
</svg>`,_=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Chó kem · lớp MẮT
    Vẽ giữa body và face. Mỗi mắt gồm tròng trắng + đồng tử + lông mi.
    PetRenderer đổi biến pet-eye để mắt mở to/nhe theo tâm tính.
  -->
  <g id="pet-eyes">
    <!-- lông mày -->
    <path d="M206 160c8-6 20-6 28-2" stroke="{{dark}}" stroke-width="6" stroke-linecap="round" fill="none"/>
    <path d="M278 158c8-4 20-4 28 2" stroke="{{dark}}" stroke-width="6" stroke-linecap="round" fill="none"/>

    <!-- mắt trái -->
    <ellipse cx="222" cy="192" rx="17" ry="18" fill="#fff"/>
    <circle cx="224" cy="194" r="9" fill="{{eye}}"/>
    <circle cx="220" cy="190" r="3.2" fill="#fff" opacity=".9"/>
    <!-- mắt phải -->
    <ellipse cx="290" cy="192" rx="17" ry="18" fill="#fff"/>
    <circle cx="288" cy="194" r="9" fill="{{eye}}"/>
    <circle cx="284" cy="190" r="3.2" fill="#fff" opacity=".9"/>

    <!-- group mắt nhe (mood buồn) — PetRenderer bật thay cho group trên -->
    <g id="pet-eyes-closed" display="none">
      <path d="M206 192c6 8 14 8 20 0" stroke="{{eye}}" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M286 192c6 8 14 8 20 0" stroke="{{eye}}" stroke-width="6" stroke-linecap="round" fill="none"/>
    </g>
  </g>
</svg>`,ue=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Chó kem · lớp MẶT (mũi + miệng + má + lưỡi)
    Vẽ SAU lớp eyes để mũi/miệng nằm trên, còn lưỡi nằm dưới miệng.
    pet-mouth: dùng cho trạng thái tâm tính khác nhau (hạnh phúc / buồn).
  -->
  <g id="pet-face">
    <!-- má -->
    <ellipse cx="188" cy="238" rx="22" ry="13" fill="{{blush}}" opacity=".45"/>
    <ellipse cx="324" cy="238" rx="22" ry="13" fill="{{blush}}" opacity=".45"/>

    <!-- vùng mõm sáng -->
    <ellipse cx="256" cy="252" rx="56" ry="40" fill="{{accent}}"/>

    <!-- mũi -->
    <ellipse cx="256" cy="232" rx="16" ry="12" fill="{{nose}}"/>
    <ellipse cx="251" cy="228" rx="5" ry="3.5" fill="#fff" opacity=".45"/>

    <!-- miệng: mặc định cười, các thay thế đặt trong group ẩn -->
    <g id="pet-mouth-happy">
      <path d="M256 244v10" stroke="{{nose}}" stroke-width="5" stroke-linecap="round"/>
      <path d="M256 254c0 10-9 16-17 14" stroke="{{nose}}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M256 254c0 10 9 16 17 14" stroke="{{nose}}" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>
    <g id="pet-mouth-sad" display="none">
      <path d="M256 246v8" stroke="{{nose}}" stroke-width="5" stroke-linecap="round"/>
      <path d="M239 268c5-8 12-10 17-8" stroke="{{nose}}" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M273 268c-5-8-12-10-17-8" stroke="{{nose}}" stroke-width="5" stroke-linecap="round" fill="none"/>
    </g>

    <!-- lưỡi: ẩn mặc định, hiện khi mood hạnh phúc/hào hứng/đói -->
    <g id="pet-tongue" display="none">
      <path d="M240 262c0 0 2 26 16 26s16-26 16-26-5-7-16-7-16 7-16 7z" fill="{{tongue}}"/>
    </g>
  </g>
</svg>`,v=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Mèo cam · lớp THÂN + ĐẦU
    Khác chó ở: thân gọn hơn, có ĐUÔI quấn sang phải, chân trước nhỏ hơn.
  -->
  <g id="pet-body">
    <!-- đuôi: vẽ trước thân để nằm sau -->
    <path d="M336 430c34 4 58-8 66-30 6-16-2-30-14-32-12-2-20 6-22 16-2 10-12 14-26 12 6 8 0 20-4 34z"
          fill="{{dark}}"/>
    <path d="M344 438c26 0 44-12 50-30 3-9 0-18-8-19-9-1-14 6-15 13-2 9-11 12-27 10 6 6 0 14 0 26z"
          fill="{{body}}" opacity=".5"/>

    <!-- thân -->
    <path d="M256 296c50 0 90 34 96 82 3 24 4 46 4 60 0 15-12 26-27 26H183c-15 0-27-11-27-26 0-14 1-36 4-60 6-48 46-82 96-82z"
          fill="{{body}}"/>
    <!-- bụng sáng -->
    <ellipse cx="256" cy="404" rx="56" ry="56" fill="{{accent}}" opacity=".5"/>
    <!-- chân trước: dùng sắc tối hơn một chút để tách khỏi bụng sáng -->
    <ellipse cx="214" cy="454" rx="31" ry="24" fill="{{dark}}"/>
    <ellipse cx="298" cy="454" rx="31" ry="24" fill="{{dark}}"/>
    <ellipse cx="214" cy="449" rx="21" ry="13" fill="{{accent}}" opacity=".55"/>
    <ellipse cx="298" cy="449" rx="21" ry="13" fill="{{accent}}" opacity=".55"/>
    <!-- cổ -->
    <path d="M200 282c0-15 25-24 56-24s56 9 56 24c0 17-25 28-56 28s-56-11-56-28z"
          fill="{{dark}}"/>
    <!-- đầu -->
    <ellipse cx="256" cy="206" rx="100" ry="90" fill="{{body}}"/>
    <ellipse cx="234" cy="168" rx="50" ry="34" fill="{{accent}}" opacity=".3"/>
  </g>
</svg>`,y=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Mèo cam · lớp TAI
    Tai nhọn hình tam giác, bo tròn ở đỉnh, vẽ SAU lớp thân-đầu.
    Hệ toạ độ dùng chung:
      đầu : ellipse (256, 206) r 100×90
      thân : y 296 → 470
      mắt  : (220, 198) và (292, 198)
      mũi  : (256, 246)
  -->
  <g id="pet-ears">
    <path d="M186 146c-8-14-14-40-12-58 1-8 7-12 14-8 22 12 44 30 58 46-22 10-42 16-60 20z"
          fill="{{dark}}"/>
    <path d="M326 146c8-14 14-40 12-58-1-8-7-12-14-8-22 12-44 30-58 46 22 10 42 16 60 20z"
          fill="{{dark}}"/>
    <!-- tai trong (màu hồng) -->
    <path d="M194 140c-4-10-8-26-7-36 0-4 4-6 8-4 14 8 28 18 38 28-14 6-26 10-39 12z"
          fill="{{blush}}" opacity=".7"/>
    <path d="M318 140c4-10 8-26 7-36 0-4-4-6-8-4-14 8-28 18-38 28 14 6 26 10 39 12z"
          fill="{{blush}}" opacity=".7"/>
  </g>
</svg>`,b=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Mèo cam · lớp MẮT
    Mắt hình lá (almond) đặc trưng mèo. PetRenderer bật group "nhe" khi mood buồn.
  -->
  <g id="pet-eyes">
    <!-- mốc mắt hình lá -->
    <ellipse cx="220" cy="200" rx="22" ry="19" fill="#fff"/>
    <ellipse cx="292" cy="200" rx="22" ry="19" fill="#fff"/>
    <!-- đồng tử dọc kiểu mèo -->
    <ellipse cx="222" cy="200" rx="6" ry="15" fill="{{eye}}"/>
    <ellipse cx="290" cy="200" rx="6" ry="15" fill="{{eye}}"/>
    <circle cx="218" cy="194" r="3.4" fill="#fff" opacity=".9"/>
    <circle cx="286" cy="194" r="3.4" fill="#fff" opacity=".9"/>

    <!-- mắt nhe (mood buồn / buồn ngủ) -->
    <g id="pet-eyes-closed" display="none">
      <path d="M202 204c6 8 30 8 36 0" stroke="{{eye}}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
      <path d="M274 204c6 8 30 8 36 0" stroke="{{eye}}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
    </g>
  </g>
</svg>`,x=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Chó kem · lớp MẶT (mũi + miệng + má + lưỡi)
    Vẽ SAU lớp eyes để mũi/miệng nằm trên, còn lưỡi nằm dưới miệng.
    pet-mouth: dùng cho trạng thái tâm tính khác nhau (hạnh phúc / buồn).
  -->
  <g id="pet-face">
    <!-- sọc sương mèo: trang phục KHÔNG được che vùng này -->
    <g stroke="{{dark}}" stroke-width="4" stroke-linecap="round" opacity=".55">
      <path d="M150 226h34"/><path d="M148 246h36"/><path d="M154 266h30"/>
      <path d="M362 226h-34"/><path d="M364 246h-36"/><path d="M358 266h-30"/>
    </g>

    <!-- má -->
    <ellipse cx="192" cy="246" rx="20" ry="12" fill="{{blush}}" opacity=".4"/>
    <ellipse cx="320" cy="246" rx="20" ry="12" fill="{{blush}}" opacity=".4"/>

    <!-- vùng mõm sáng -->
    <ellipse cx="256" cy="258" rx="48" ry="34" fill="{{accent}}"/>

    <!-- mũi hình tam giác (đặc trưng mèo) -->
    <path d="M246 244h20l-10 13z" fill="{{nose}}"/>
    <path d="M256 257v9" stroke="{{nose}}" stroke-width="4" stroke-linecap="round"/>

    <!-- miệng cười (nhị ba nhánh, kiểu mèo) -->
    <path d="M256 266c0 9-8 14-16 12" stroke="{{nose}}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    <path d="M256 266c0 9 8 14 16 12" stroke="{{nose}}" stroke-width="4.5" stroke-linecap="round" fill="none"/>

    <!-- miệng buồn (PetRenderer bật khi mood buồn) -->
    <g id="pet-mouth-sad" display="none">
      <path d="M240 280c6-8 11-10 16-8" stroke="{{nose}}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M272 280c-6-8-11-10-16-8" stroke="{{nose}}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
    </g>
    <g id="pet-mouth-happy">
      <path d="M256 257v9" stroke="{{nose}}" stroke-width="4" stroke-linecap="round"/>
    </g>

    <!-- lưỡi: ẩn mặc định -->
    <g id="pet-tongue" display="none">
      <path d="M244 272c0 0 2 22 12 22s12-22 12-22-4-6-12-6-12 6-12 6z" fill="{{tongue}}"/>
    </g>
  </g>
</svg>`,S=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    hat_crown_01 · Vương miện
    Ngồi trên đỉnh đầu (đầu pet: ellipse (256, ~200) r ~100×92).
    Màu do item-color; item-dark là sắc đậm hơn.
  -->
  <g id="hat_crown_01">
    <!-- vành đế -->
    <path d="M170 152h172l-8 26H178z" fill="{{dark}}"/>
    <rect x="166" y="146" width="180" height="18" rx="9" fill="{{main}}"/>
    <!-- 3 nhọn + 2 nhọn nhỏ -->
    <path d="M176 148l22-46 30 40 28-58 28 58 30-40 22 46z" fill="{{main}}"/>
    <path d="M186 148l14-30 18 24 15-30 15 30 18-24 14 30z" fill="{{light}}" opacity=".55"/>
    <!-- đá trên đỉnh -->
    <circle cx="256" cy="96" r="9" fill="{{accent}}"/>
    <circle cx="206" cy="112" r="6" fill="{{accent}}"/>
    <circle cx="306" cy="112" r="6" fill="{{accent}}"/>
  </g>
</svg>`,C=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    hat_wizard_01 · Mũ phù thủy
    Mũ có vành rộng và chóp cong — hợp với cả chó và mèo.
  -->
  <g id="hat_wizard_01">
    <!-- vành mũ: hình bầu dục rộng, ngồi cân đối trên đỉnh đầu -->
    <ellipse cx="256" cy="130" rx="106" ry="26" fill="{{dark}}"/>
    <ellipse cx="256" cy="124" rx="106" ry="26" fill="{{main}}"/>
    <!-- chóp mũ cong sang phải -->
    <path d="M186 116c-4-46 12-82 44-92 34-10 68 2 84 26 10 15 12 34 6 52-10-22-32-38-58-40-34-3-62 16-76 54z"
          fill="{{main}}"/>
    <path d="M212 104c0-30 10-52 30-60 22-9 46 0 60 18-18-8-40-6-56 6-12 9-24 20-34 36z"
          fill="{{light}}" opacity=".5"/>
    <!-- vành sao + ngôi sao đầu chóp -->
    <path d="M150 126c0 14 47 26 106 26s106-12 106-26" stroke="{{accent}}" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M320 52l9 22 22 9-22 9-9 22-9-22-22-9 22-9z" fill="{{accent}}"/>
  </g>
</svg>`,w=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Mũ lưỡi trai — phục vụ id catalog cũ "hat-cap".
    Giữ để người chơi đang mặc món này không bị mất hình khi tái cấu trúc.
  -->
  <g id="hat-cap">
    <!-- vành mũ trước -->
    <path d="M150 138c0-16 48-28 106-28s106 12 106 28c0 8-6 14-14 14H164c-8 0-14-6-14-14z" fill="{{dark}}"/>
    <path d="M256 110c-58 0-106 12-106 28 0 8 6 14 14 14h184c8 0 14-6 14-14 0-16-48-28-106-28z" fill="{{main}}"/>
    <!-- chóp mũ -->
    <path d="M166 112c0-36 40-62 90-62s90 26 90 62c0 8-6 12-14 12H180c-8 0-14-4-14-12z" fill="{{main}}"/>
    <path d="M186 96c6-22 32-40 66-42-22 10-38 28-44 50z" fill="{{light}}" opacity=".55"/>
    <!-- nút chóp -->
    <circle cx="256" cy="50" r="8" fill="{{dark}}"/>
    <!-- cột logo -->
    <rect x="246" y="86" width="20" height="34" rx="6" fill="{{light}}" opacity=".9"/>
  </g>
</svg>`,T=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    Mũ sinh nhật — phục vụ id catalog cũ "hat-party".
    Giữ để người chơi đang mặc món này không bị mất hình khi tái cấu trúc.
  -->
  <g id="hat-party">
    <!-- chóp -->
    <path d="M256 40l58 118H198z" fill="{{main}}"/>
    <path d="M256 40l26 118h-26z" fill="{{light}}" opacity=".6"/>
    <!-- sọc trên chóp -->
    <path d="M232 96l-10 22M280 96l10 22M222 130l-12 26M290 130l12 26" stroke="{{dark}}" stroke-width="9" stroke-linecap="round" opacity=".7"/>
    <!-- vành -->
    <ellipse cx="256" cy="158" rx="66" ry="18" fill="{{dark}}"/>
    <ellipse cx="256" cy="154" rx="66" ry="18" fill="{{main}}"/>
    <!-- búp bê đầu chóp -->
    <circle cx="256" cy="36" r="17" fill="{{accent}}"/>
    <path d="M256 24l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="{{main}}"/>
  </g>
</svg>`,E=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    glasses_round_01 · Kính tròn
    Đúng vị trí mắt: chó (222/290, 192), mèo (220/292, 200).
    Vẽ TRÊN mắt (zIndex cao hơn lớp eyes) nhưng DƯỚI mũ.
  -->
  <g id="glasses_round_01">
    <!-- gọng kính -->
    <circle cx="220" cy="194" r="38" fill="#fff" fill-opacity=".22" stroke="{{main}}" stroke-width="11"/>
    <circle cx="292" cy="194" r="38" fill="#fff" fill-opacity=".22" stroke="{{main}}" stroke-width="11"/>
    <!-- cầu nối -->
    <path d="M258 194h-0M254 190h4" stroke="{{main}}" stroke-width="11" stroke-linecap="round"/>
    <path d="M254 192h4" stroke="{{main}}" stroke-width="11" stroke-linecap="round"/>
    <!-- càng kính -->
    <path d="M182 186c-14-6-26-4-36 4" stroke="{{main}}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <path d="M330 186c14-6 26-4 36 4" stroke="{{main}}" stroke-width="9" stroke-linecap="round" fill="none"/>
    <!-- lóe sáng trên mặt kính -->
    <path d="M196 178c6-10 18-14 28-10" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
    <path d="M268 178c6-10 18-14 28-10" stroke="#fff" stroke-width="7" stroke-linecap="round" fill="none" opacity=".55"/>
  </g>
</svg>`,D=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    shirt_student_01 · Áo học sinh
    Khoác lên thân (y 300 → 440), cổ áo ở y ≈ 300. Không che mặt.
  -->
  <g id="shirt_student_01">
    <!-- tay áo + thân áo: bo tròn bám theo thân pet -->
    <path d="M256 300c50 0 90 30 96 74 3 20 4 38 4 50 0 13-10 22-24 22H180c-14 0-24-9-24-22 0-12 1-30 4-50 6-44 46-74 96-74z"
          fill="{{main}}"/>
    <!-- cổ áo trắng -->
    <path d="M228 300c0 12 12 20 28 20s28-8 28-20l-10-6c-2 8-8 12-18 12s-16-4-18-12z" fill="{{light}}"/>
    <path d="M228 298l28 18 28-18-8-4-20 13-20-13z" fill="{{dark}}"/>
    <!-- nút áo + cà vút trường -->
    <circle cx="256" cy="352" r="6" fill="{{light}}" opacity=".9"/>
    <circle cx="256" cy="386" r="6" fill="{{light}}" opacity=".9"/>
    <path d="M212 322l-14-14 14-10 10 14-10 10z" fill="{{accent}}"/>
    <!-- tay áo dưới cùng -->
    <path d="M186 428c-12 2-24 0-34-4l4-20c10 6 22 8 34 6z" fill="{{main}}"/>
    <path d="M326 428c12 2 24 0 34-4l-4-20c-10 6-22 8-34 6z" fill="{{main}}"/>
  </g>
</svg>`,O=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    scarf_red_01 · Khăn quàng đỏ
    Quấn quanh cổ (y ≈ 300), đuôi khăn rơi xuống vai phải.
    Vẽ SAU lớp đầu nên không che mặt.
  -->
  <g id="scarf_red_01">
    <!-- vòng quanh cổ -->
    <path d="M198 296c0-18 26-28 58-28s58 10 58 28-26 26-58 26-58-8-58-26z" fill="{{main}}"/>
    <path d="M198 300c0 14 26 24 58 24s58-10 58-24" fill="{{dark}}" opacity=".55"/>
    <!-- tua rua -->
    <path d="M226 314h10v14h-10zM242 314h10v14h-10zM258 314h10v14h-10zM274 314h10v14h-10zM290 314h10v14h-10z"
          fill="{{dark}}" opacity=".6"/>
    <!-- đuôi khăn rơi bên phải -->
    <path d="M312 312c16 10 22 34 18 58-2 14-8 26-16 34l-26-12c10-8 16-20 18-34 2-18 0-32-8-40z"
          fill="{{main}}"/>
    <path d="M308 326c10 10 13 26 10 42-2 12-7 21-13 28l-12-6c7-7 12-16 13-28 2-14 0-24-5-31z"
          fill="{{light}}" opacity=".4"/>
    <!-- tua đuôi -->
    <path d="M288 388h9v16h-9zM299 386h9v16h-9zM310 382h9v16h-9z" fill="{{dark}}" opacity=".7"/>
  </g>
</svg>`,k=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    bow_pink_01 · Nơ hồng
    Gắn lệch sang góc trên phải của đầu, KHÔNG che mắt/mũi.
    Đầu pet: ellipse (256, ~200) r ~100×92 → điểm gắn (348, 118).
  -->
  <g id="bow_pink_01">
    <!-- vòng giữa -->
    <ellipse cx="348" cy="120" rx="13" ry="13" fill="{{dark}}"/>
    <!-- cánh trái -->
    <path d="M336 118c-22-18-50-24-62-12-12 12-6 34 10 42 16 8 38 4 52-8z" fill="{{main}}"/>
    <path d="M330 116c-16-12-36-16-44-9-6 6-4 16 2 22 10-8 26-11 42-13z" fill="{{light}}" opacity=".55"/>
    <!-- cánh phải -->
    <path d="M360 118c22-18 50-24 62-12 12 12 6 34-10 42-16 8-38 4-52-8z" fill="{{main}}"/>
    <path d="M366 116c16-12 36-16 44-9 6 6 4 16-2 22-10-8-26-11-42-13z" fill="{{light}}" opacity=".55"/>
    <!-- tua chúc xuống -->
    <path d="M344 130c-2 14-8 26-16 34l12 8c8-10 14-22 16-36z" fill="{{main}}"/>
    <path d="M356 130c2 14 8 26 16 34l-12 8c-8-10-14-22-16-36z" fill="{{main}}"/>
  </g>
</svg>`,A=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    cape_hero_01 · Áo choàng anh hùng
    Nằm PHÍA SAU thân (zIndex thấp hơn pet-body). Mép áo chỉ lệch ra ngoài thân
    vài chừng — để lộ phần thân/áo bên dưới, tránh bị áo choàng nuốt hết thân.
  -->
  <g id="cape_hero_01">
    <!-- tạp dề sau lưng -->
    <path d="M256 292c50 0 92 30 106 74 9 28 12 56 12 76 0 8-6 14-14 14H152c-8 0-14-6-14-14 0-20 3-48 12-76 14-44 56-74 106-74z"
          fill="{{dark}}"/>
    <!-- hai mép trước vắt lên vai -->
    <path d="M256 302c-40 0-76 22-92 58-10 22-14 44-16 62l34 6c2-20 6-40 16-56 12-20 32-34 56-38z" fill="{{main}}"/>
    <path d="M256 302c40 0 76 22 92 58 10 22 14 44 16 62l-34 6c-2-20-6-40-16-56-12-20-32-34-56-38z" fill="{{main}}"/>
    <!-- viền sáng -->
    <path d="M256 298c-42 0-80 24-97 64-10 23-15 47-17 64" stroke="{{light}}" stroke-width="7" fill="none" opacity=".6"/>
    <path d="M256 298c42 0 80 24 97 64 10 23 15 47 17 64" stroke="{{light}}" stroke-width="7" fill="none" opacity=".6"/>
    <!-- cài vai -->
    <circle cx="200" cy="304" r="10" fill="{{accent}}"/>
    <circle cx="312" cy="304" r="10" fill="{{accent}}"/>
  </g>
</svg>`,j=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="none">
  <!--
    backpack_adventure_01 · Ba lô phiêu lưu
    Nằm PHÍA SAU thân (zIndex thấp hơn pet-body) — dây vắt qua vai trước.
    Thân pet: ellipse trục (256, ~390) r ~92×98, vai ở y ≈ 300.
  -->
  <g id="backpack_adventure_01">
    <!-- quai ba lô vắt sau vai -->
    <path d="M200 296c-22 12-34 40-34 74" stroke="{{dark}}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <path d="M312 296c22 12 34 40 34 74" stroke="{{dark}}" stroke-width="13" fill="none" stroke-linecap="round"/>
    <!-- thân ba lô -->
    <path d="M360 332c30 0 54 22 54 50v78c0 18-14 32-32 32h-44c-18 0-32-14-32-32v-78c0-28 24-50 54-50z"
          fill="{{main}}"/>
    <!-- nắp ba lô -->
    <path d="M354 344c32 0 58 24 58 52v10c-18-10-38-15-58-15s-40 5-58 15v-10c0-28 26-52 58-52z"
          fill="{{light}}"/>
    <!-- túi phụ + khóa -->
    <rect x="356" y="416" width="72" height="48" rx="14" fill="{{dark}}"/>
    <rect x="378" y="436" width="28" height="12" rx="6" fill="{{accent}}"/>
    <!-- dây kéo bên -->
    <path d="M306 392c-12 6-20 20-20 36" stroke="{{dark}}" stroke-width="8" fill="none" stroke-linecap="round"/>
    <!-- huy hiệu phiêu lưu -->
    <circle cx="384" cy="382" r="15" fill="{{accent}}"/>
    <path d="M384 372l4 8 9 1-7 6 2 9-8-5-8 5 2-9-7-6 9-1z" fill="{{dark}}"/>
  </g>
</svg>`,M={BACKPACK:10,CAPE:20,EARS:25,BODY:30,SHIRT:40,SCARF:45,HEAD:55,FACE:60,EYES:62,BOW:70,GLASSES:75,HAT:85},N={cream:{body:`#F6B45C`,accent:`#FFF1D7`,dark:`#C8752E`,stroke:`#B96828`,nose:`#3A2A22`},brown:{body:`#A9714B`,accent:`#F6E3D3`,dark:`#7E5335`,stroke:`#6B452B`,nose:`#3A2418`},black:{body:`#5A5A66`,accent:`#E4E4EA`,dark:`#3A3A44`,stroke:`#2A2A33`,nose:`#1A1A20`},white:{body:`#F7F7FA`,accent:`#FFFFFF`,dark:`#C9C9D2`,stroke:`#B0B0BC`,nose:`#4A4A55`},orange:{body:`#F08A3C`,accent:`#FFE6CF`,dark:`#C2661F`,stroke:`#A8541A`,nose:`#B5483F`},gray:{body:`#9AA3B2`,accent:`#EDEFF3`,dark:`#6E7684`,stroke:`#5A6270`,nose:`#3A3F4A`},pink:{body:`#F49BC1`,accent:`#FFE4EF`,dark:`#CE6E96`,stroke:`#B25A7E`,nose:`#8A3F58`},yellow:{body:`#F7C948`,accent:`#FFF3C9`,dark:`#C9A32F`,stroke:`#A8871F`,nose:`#6B5312`},mint:{body:`#6FCF97`,accent:`#E0F5EA`,dark:`#4A9E6E`,stroke:`#3A7F58`,nose:`#24563C`},sky:{body:`#5AA9E6`,accent:`#DFF0FC`,dark:`#3E82BB`,stroke:`#2F6A99`,nose:`#1E4A70`}},P=N.cream,F={dog:{id:`dog`,name:`Chó`,emoji:`🐶`,art:`svg`,defaultColor:`cream`,layers:{ears:{asset:g,zIndex:M.EARS},body:{asset:h,zIndex:M.BODY},face:{asset:ue,zIndex:M.FACE},eyes:{asset:_,zIndex:M.EYES}}},cat:{id:`cat`,name:`Mèo`,emoji:`🐱`,art:`svg`,defaultColor:`orange`,layers:{ears:{asset:y,zIndex:M.EARS},body:{asset:v,zIndex:M.BODY},face:{asset:x,zIndex:M.FACE},eyes:{asset:b,zIndex:M.EYES}}}},I={dog:`🐶`,cat:`🐱`,bird:`🐦`,fish:`🐟`,monkey:`🐵`},L=[`dog`,`cat`],R={hat_crown_01:{id:`hat_crown_01`,category:`hat`,name:`Vương miện`,asset:S,compatibleSpecies:L,zIndex:M.HAT,defaultColor:`#FACC15`},hat_wizard_01:{id:`hat_wizard_01`,category:`hat`,name:`Mũ phù thủy`,asset:C,compatibleSpecies:L,zIndex:M.HAT,defaultColor:`#4A2FB8`},glasses_round_01:{id:`glasses_round_01`,category:`glasses`,name:`Kính tròn`,asset:E,compatibleSpecies:L,zIndex:M.GLASSES,defaultColor:`#242B35`},shirt_student_01:{id:`shirt_student_01`,category:`shirt`,name:`Áo học sinh`,asset:D,compatibleSpecies:L,zIndex:M.SHIRT,defaultColor:`#2F5FD0`},scarf_red_01:{id:`scarf_red_01`,category:`scarf`,name:`Khăn quàng đỏ`,asset:O,compatibleSpecies:L,zIndex:M.SCARF,defaultColor:`#E0342F`},bow_pink_01:{id:`bow_pink_01`,category:`bow`,name:`Nơ hồng`,asset:k,compatibleSpecies:L,zIndex:M.BOW,defaultColor:`#F06292`},cape_hero_01:{id:`cape_hero_01`,category:`cape`,name:`Áo choàng anh hùng`,asset:A,compatibleSpecies:L,zIndex:M.CAPE,defaultColor:`#7C3AED`},backpack_adventure_01:{id:`backpack_adventure_01`,category:`backpack`,name:`Ba lô phiêu lưu`,asset:j,compatibleSpecies:L,zIndex:M.BACKPACK,defaultColor:`#8B5CF6`}},de={"hat-cap":{asset:w,category:`hat`,name:`Mũ lưỡi trai`,defaultColor:`#3978DC`,zIndex:M.HAT},"hat-party":{asset:T,category:`hat`,name:`Mũ sinh nhật`,defaultColor:`#EC4899`,zIndex:M.HAT},"hat-crown":{asset:S,category:`hat`,name:`Vương miện`,defaultColor:`#FACC15`,zIndex:M.HAT},scarf:{asset:O,category:`scarf`,name:`Khăn quàng`,defaultColor:`#EF4444`,zIndex:M.SCARF},glasses:{asset:E,category:`glasses`,name:`Kính mát`,defaultColor:`#111827`,zIndex:M.GLASSES},shirt:{asset:D,category:`shirt`,name:`Áo phao`,defaultColor:`#3B82F6`,zIndex:M.SHIRT},bow:{asset:k,category:`bow`,name:`Cà vút`,defaultColor:`#EC4899`,zIndex:M.BOW},cape:{asset:A,category:`cape`,name:`Áo choàng`,defaultColor:`#7C3AED`,zIndex:M.CAPE},backpack:{asset:j,category:`backpack`,name:`Ba lô`,defaultColor:`#8B5CF6`,zIndex:M.BACKPACK}};function z(e){if(!e)return null;let t=R[e];if(t)return t;let n=de[e];return n?{id:e,compatibleSpecies:L,...n}:null}function fe(e){return F[e]||null}function B(e){return N[e]?N[e]:P}function V(e,t){if(!e)return!1;let n=e.compatibleSpecies;return!Array.isArray(n)||n.includes(t)}var H=n();function U({asset:e,zIndex:t=0,label:n}){let r=(0,m.useMemo)(()=>({position:`absolute`,inset:0,zIndex:t}),[t]);if(!e)return null;let i=e.replace(/\swidth="[^"]*"/,``).replace(/\sheight="[^"]*"/,``).replace(/<svg /,`<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" `);return(0,H.jsx)(`span`,{className:`pointer-events-none absolute inset-0 block`,style:r,role:n?`img`:`presentation`,"aria-label":n||void 0,"aria-hidden":!n||void 0,dangerouslySetInnerHTML:{__html:i}})}var W={happy:{eyesClosed:!1,tongue:!0,sad:!1},excited:{eyesClosed:!1,tongue:!0,sad:!1},hungry:{eyesClosed:!1,tongue:!0,sad:!1},sleepy:{eyesClosed:!0,tongue:!1,sad:!1},sad:{eyesClosed:!0,tongue:!1,sad:!0}};function G(e,t){if(typeof e!=`string`||!/^#[0-9a-fA-F]{3,8}$/.test(e))return e;let n=e.length===4?`#`+e.slice(1).split(``).map(e=>e+e).join(``):e.slice(0,7),r=parseInt(n.slice(1),16);return`#`+[r>>16&255,r>>8&255,r&255].map(e=>{let n=t>0?e+(255-e)*t:e*(1+t);return Math.max(0,Math.min(255,Math.round(n)))}).map(e=>e.toString(16).padStart(2,`0`)).join(``)}function K(e,t,n){if(!e)return e;let r=RegExp(`(<g id="${t}")([^>]*)>`);return r.test(e)?e.replace(r,(e,t,r)=>`${t}${r.replace(/\s*display="[^"]*"/g,``)}${n?` display="inline"`:``}>`):e}function q(e,t){return e&&e.replace(/\{\{(\w+)\}\}/g,(e,n)=>t[n]??e)}function pe(e){return{body:e.body,accent:e.accent,dark:e.dark,stroke:e.stroke,nose:e.nose,eye:`#2E2A26`,blush:`#F58CA0`,tongue:`#F26D7D`}}function J(e){return{main:e,dark:G(e,-.22),light:G(e,.42),accent:`#FACC15`}}function Y({species:e,color:t,outfits:n={},mood:r=`happy`,size:i=64,className:a=``,showEmojiFallback:o=!0,ariaLabel:s}){let c=fe(e),l=W[r]||W.happy;if(!c){if(!o)return null;let t=I[e]||`🐾`;return(0,H.jsx)(`span`,{role:`img`,"aria-label":s||e||`Thú cưng`,className:`inline-grid place-items-center leading-none ${a}`,style:{width:i,height:i,fontSize:Math.round(i*.82)},children:t})}let u=B(t||c.defaultColor),d=[];for(let[e,t]of Object.entries(c.layers)){let n=t.asset;e===`eyes`&&(n=K(n,`pet-eyes-closed`,l.eyesClosed)),e===`face`&&(n=K(n,`pet-tongue`,l.tongue),n=K(n,`pet-mouth-sad`,l.sad)),d.push({key:`base:${e}`,asset:q(n,pe(u)),zIndex:t.zIndex})}for(let[t,r]of Object.entries(n||{})){let n=typeof r==`string`?r:r?.id;if(!n)continue;let i=z(n);if(!i||!V(i,e))continue;let a=typeof r==`object`&&r?.color||i.defaultColor;d.push({key:`outfit:${t}:${n}`,asset:q(i.asset,J(a)),zIndex:i.zIndex})}return d.sort((e,t)=>e.zIndex-t.zIndex),(0,H.jsx)(`span`,{className:`relative block shrink-0 overflow-hidden leading-none ${a}`,style:{width:i,height:i,isolation:`isolate`},role:`img`,"aria-label":s||`Thú cưng`,children:d.map(e=>(0,H.jsx)(U,{asset:e.asset,zIndex:e.zIndex},e.key))})}function me({id:e,color:t,size:n=44,className:r=``}){let i=z(e);return i?.asset?(0,H.jsx)(`span`,{className:`relative block shrink-0 overflow-hidden leading-none ${r}`,style:{width:n,height:n,isolation:`isolate`},role:`img`,"aria-label":i.name||e,children:(0,H.jsx)(U,{asset:q(i.asset,J(t||i.defaultColor)),zIndex:0})}):null}var X=[{kind:`species`,key:`species`,label:`Loài`,icon:(0,H.jsx)(a,{className:`w-4 h-4`})},{kind:`color`,key:`colors`,label:`Màu thân`,icon:(0,H.jsx)(o,{className:`w-4 h-4`})},{kind:`outfit`,key:`outfits`,label:`Trang phục`,icon:(0,H.jsx)(l,{className:`w-4 h-4`})}],he={species:`species`,color:`colors`,outfit:`outfits`},ge={id:``,name:``,emoji:`🐾`,shape:``,art:``,desc:``,trait:``,likes:``,minLevel:1,defaultColor:``},_e={id:``,name:``,body:`#F4AF66`,accent:`#FFF7EE`,minLevel:1},ve={id:``,name:``,slot:`hat`,colors:`#FACC15`,minLevel:1},Z=e=>e===`species`?{...ge}:e===`color`?{..._e}:{...ve},Q=`w-full note-card px-3 py-2 mt-0.5 border-ink/10 focus:border-ticket text-sm`;function $(e){return Array.isArray(e.colors)&&e.colors.length?e.colors[0]:typeof e.colors==`string`?e.colors.split(/[,\s]+/)[0]||`#FACC15`:e.body||`#F4AF66`}function ye({kind:e,id:t}){return e!==`outfit`||!t||z(t)?null:(0,H.jsxs)(`p`,{className:`text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 flex items-start gap-1.5`,children:[(0,H.jsx)(p,{className:`w-3.5 h-3.5 shrink-0 mt-0.5`}),(0,H.jsxs)(`span`,{children:[`Chưa có hình vẽ cho id `,(0,H.jsx)(`code`,{className:`font-mono`,children:t}),`. Thêm mục vào`,(0,H.jsx)(`code`,{className:`font-mono`,children:` src/data/petAssets.js `}),`rồi vẽ SVG trong`,(0,H.jsx)(`code`,{className:`font-mono`,children:` src/assets/pets/outfits/`}),`, nếu không người chơi sẽ không thấy món này.`]})]})}function be({showToast:e}){let[t,n]=(0,m.useState)(null),[p,h]=(0,m.useState)(null),[g,_]=(0,m.useState)(`species`),[ue,v]=(0,m.useState)(!1),[y,b]=(0,m.useState)(null),[x,S]=(0,m.useState)(Z(`species`)),[C,w]=(0,m.useState)(!1),[T,E]=(0,m.useState)(null),{askConfirm:D,confirmProps:O}=le(),k=(0,m.useCallback)(async()=>{n(null),h(null);try{let e=await r(`/pet/admin/catalog`);n(e)}catch(e){h(e.message)}},[]);(0,m.useEffect)(()=>{k()},[k]);let A=(0,m.useMemo)(()=>t&&t[he[g]]||[],[t,g]),j=e=>t?.usage?.[`${g}:${e.id}`]??0,M=(e,t)=>{S(n=>({...n,[e]:t})),E(null)},N=()=>{b(null),S(Z(g)),E(null),v(!0)},P=e=>{b(e.id),S({...Z(g),...e,colors:Array.isArray(e.colors)?e.colors.join(`, `):e.colors||``,likes:Array.isArray(e.likes)?e.likes.join(`, `):e.likes||``,defaultColor:e.defaultColor||``}),E(null),v(!0)},F=()=>{v(!1),E(null)},I=async()=>{if(!x.id?.trim()||!x.name?.trim()){E(`Thiếu id hoặc tên`);return}w(!0),E(null);let t={...x,minLevel:Number(x.minLevel)||1};g===`species`&&(t.likes=String(x.likes||``).split(`,`).map(e=>e.trim()).filter(Boolean),t.defaultColor=x.defaultColor||null),g===`outfit`&&(t.colors=String(x.colors||``).split(/[,\s]+/).map(e=>e.trim()).filter(Boolean));try{y?(delete t.id,await r(`/pet/admin/${g}/${y}`,{method:`PUT`,body:t}),e(`Đã cập nhật "${x.name}"`,`success`)):(await r(`/pet/admin/${g}`,{method:`POST`,body:t}),e(`Đã thêm "${x.name}"`,`success`)),F(),k()}catch(e){E(e.message||`Lỗi lưu`)}finally{w(!1)}},L=t=>{let n=j(t);D({title:`Xóa "${t.name}"?`,message:n>0?`Có ${n} thú cưng đang dùng mục này. Xóa sẽ tự đặt chúng về giá trị mặc định.`:`Mục này chưa có thú cưng nào dùng.`,confirmLabel:`Xóa`,onConfirm:async()=>{try{let n=await r(`/pet/admin/${g}/${t.id}`,{method:`DELETE`});e(n.affectedPets>0?`Đã xóa, cập nhật ${n.affectedPets} pet`:`Đã xóa`,`success`),k()}catch(t){e(t.message||`Lỗi xóa`,`error`)}}})},R=()=>{D({title:`Khôi phục danh mục mặc định?`,message:`Toàn bộ loài / màu / trang phục sẽ bị xóa và nạp lại từ danh mục mặc định trên server. Mọi chỉnh sửa sẽ mất.`,confirmLabel:`Khôi phục`,onConfirm:async()=>{try{await r(`/pet/admin/reset-catalog`,{method:`POST`,body:{}}),e(`Đã khôi phục danh mục pet`,`success`),k()}catch(t){e(t.message||`Lỗi khôi phục`,`error`)}}})},de=t?[{icon:(0,H.jsx)(a,{}),value:t.species.length,label:`Loài`},{icon:(0,H.jsx)(o,{}),value:t.colors.length,label:`Màu thân`},{icon:(0,H.jsx)(l,{}),value:t.outfits.length,label:`Trang phục`},{icon:(0,H.jsx)(ne,{}),value:A.filter(e=>(e.minLevel||1)===1).length,label:`Mở khoá cấp 1`}]:[],fe=[`Xem trước`,`Tên`,`ID`,...g===`outfit`?[`Ô`]:[],`Mở khoá`,`Đang dùng`,``],B=e=>{let n=j(e),r=g===`outfit`&&!z(e.id);return(0,H.jsxs)(`tr`,{className:`border-b border-ink/5 last:border-0 align-middle`,children:[(0,H.jsx)(`td`,{className:`px-4 py-2`,children:g===`outfit`?(0,H.jsx)(me,{id:e.id,color:$(e),size:44}):g===`color`?(0,H.jsx)(`span`,{className:`block w-9 h-9 rounded-lg border border-ink/10`,style:{background:e.body}}):(0,H.jsx)(`span`,{className:`text-2xl`,children:e.emoji||`🐾`})}),(0,H.jsxs)(`td`,{className:`px-4 py-2`,children:[(0,H.jsx)(`span`,{className:`font-semibold text-sm text-ink`,children:e.name}),r&&(0,H.jsx)(`span`,{className:`ml-2 text-[10px] font-bold text-amber-700`,children:`chưa có hình`}),g===`species`&&e.trait&&(0,H.jsx)(`div`,{className:`text-[11px] text-ink/45 mt-0.5`,children:e.trait})]}),(0,H.jsx)(`td`,{className:`px-4 py-2 font-mono text-[11px] text-ink/50`,children:e.id}),g===`outfit`&&(0,H.jsx)(`td`,{className:`px-4 py-2 text-xs text-ink/60`,children:t.slotLabels?.[e.slot]||e.slot}),(0,H.jsx)(`td`,{className:`px-4 py-2`,children:(0,H.jsxs)(`span`,{className:`px-2 py-0.5 rounded text-[10px] font-bold ${(e.minLevel||1)===1?`bg-teal/15 text-teal`:`bg-gold/20 text-[#8a6a10]`}`,children:[`Cấp `,e.minLevel||1]})}),(0,H.jsx)(`td`,{className:`px-4 py-2`,children:(0,H.jsx)(`span`,{className:`text-xs font-mono ${n>0?`text-ink/70`:`text-ink/25`}`,children:n})}),(0,H.jsx)(`td`,{className:`px-4 py-2`,children:(0,H.jsxs)(`div`,{className:`flex items-center justify-end gap-2`,children:[(0,H.jsx)(`button`,{onClick:()=>P(e),className:`text-xs font-semibold text-ticket hover:underline`,children:`Sửa`}),(0,H.jsx)(`button`,{onClick:()=>L(e),className:`text-xs font-semibold text-red-400 hover:underline`,children:`Xóa`})]})})]},e.id)},V=Object.entries(t?.slotLabels||{});return(0,H.jsxs)(`div`,{className:`space-y-4`,children:[(0,H.jsx)(ie,{subtitle:`Thú cưng`,title:`Danh mục Pet`}),(0,H.jsx)(te,{stats:de}),(0,H.jsxs)(`div`,{className:`note-card p-3 text-xs text-ink/60 flex items-start gap-2`,children:[(0,H.jsx)(`span`,{className:`text-base leading-none`,children:(0,H.jsx)(i,{className:`w-3.5 h-3.5 text-ink/40`})}),(0,H.jsxs)(`span`,{children:[`Danh mục lưu trong collection `,(0,H.jsx)(`code`,{className:`font-mono text-[11px]`,children:`petCatalog`}),` trên server. Thêm / sửa / xoá ở đây áp dụng cho `,(0,H.jsx)(`strong`,{children:`toàn bộ`}),` người chơi ngay lập tức. Hình vẽ SVG vẫn nằm ở frontend (`,(0,H.jsx)(`code`,{className:`font-mono text-[11px]`,children:`src/data/petAssets.js`}),`) — mục không có hình sẽ bị đánh dấu.`]})]}),p&&!t&&(0,H.jsx)(u,{subtitle:p,onRetry:k}),!p&&!t&&(0,H.jsx)(ce,{label:`Đang tải danh mục pet...`}),t&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsxs)(`div`,{className:`flex gap-2`,children:[X.map(e=>(0,H.jsxs)(`button`,{onClick:()=>_(e.kind),className:`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition
                  ${g===e.kind?`bg-pink text-white`:`bg-ink/5 text-ink/50 hover:bg-ink/10`}`,children:[e.icon,e.label,(0,H.jsxs)(`span`,{className:`text-[10px] font-mono opacity-70`,children:[`(`,t[e.key]?.length??0,`)`]})]},e.kind)),(0,H.jsxs)(`button`,{onClick:R,title:`Xóa toàn bộ và nạp lại danh mục mặc định`,className:`ml-auto flex items-center gap-1.5 text-xs font-semibold text-ink/40 hover:text-ticket`,children:[(0,H.jsx)(s,{className:`w-3.5 h-3.5`}),`Khôi phục mặc định`]})]}),(0,H.jsx)(re,{title:`Danh sách ${X.find(e=>e.kind===g).label.toLowerCase()}`,count:A.length,data:A,emptyLabel:`Chưa có mục nào.`,onCreate:N,createLabel:`+ Thêm ${X.find(e=>e.kind===g).label.toLowerCase()}`,headers:fe,renderRow:B,renderCard:e=>{let n=j(e),r=g===`outfit`&&!z(e.id);return(0,H.jsxs)(`div`,{className:`flex items-center gap-3`,children:[g===`outfit`?(0,H.jsx)(me,{id:e.id,color:$(e),size:40}):g===`color`?(0,H.jsx)(`span`,{className:`block w-9 h-9 rounded-lg border border-ink/10 shrink-0`,style:{background:e.body}}):(0,H.jsx)(`span`,{className:`text-2xl shrink-0`,children:e.emoji||`🐾`}),(0,H.jsxs)(`div`,{className:`min-w-0 flex-1`,children:[(0,H.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,H.jsx)(`span`,{className:`font-semibold text-sm text-ink truncate`,children:e.name}),r&&(0,H.jsx)(`span`,{className:`text-[10px] font-bold text-amber-700 shrink-0`,children:`chưa có hình`})]}),(0,H.jsxs)(`p`,{className:`font-mono text-[11px] text-ink/50 truncate`,children:[e.id,g===`outfit`?` · ${t.slotLabels?.[e.slot]||e.slot}`:``,g===`species`&&e.trait?` · ${e.trait}`:``]})]}),(0,H.jsxs)(`div`,{className:`text-right shrink-0`,children:[(0,H.jsxs)(`span`,{className:`px-1.5 py-0.5 rounded text-[10px] font-bold ${(e.minLevel||1)===1?`bg-teal/15 text-teal`:`bg-gold/20 text-[#8a6a10]`}`,children:[`Cấp `,e.minLevel||1]}),(0,H.jsxs)(`p`,{className:`text-[11px] font-mono mt-0.5 ${n>0?`text-ink/70`:`text-ink/25`}`,children:[n,` dùng`]})]}),(0,H.jsxs)(`div`,{className:`flex items-center gap-2 shrink-0`,children:[(0,H.jsx)(`button`,{onClick:()=>P(e),className:`text-xs font-semibold text-ticket hover:underline`,children:`Sửa`}),(0,H.jsx)(`button`,{onClick:()=>L(e),className:`text-xs font-semibold text-red-400 hover:underline`,children:`Xóa`})]})]})}})]}),ue&&(0,H.jsxs)(oe,{onClose:F,wide:!0,children:[(0,H.jsxs)(`div`,{className:`flex items-center justify-between mb-3`,children:[(0,H.jsxs)(`h3`,{className:`font-display text-lg text-ink`,children:[y?`Sửa`:`Thêm`,` `,X.find(e=>e.kind===g).label.toLowerCase()]}),(0,H.jsx)(`button`,{onClick:F,className:`p-1.5 rounded-lg hover:bg-ink/5`,children:(0,H.jsx)(se,{className:`w-5 h-5 text-ink/50`})})]}),(0,H.jsxs)(`div`,{className:`grid sm:grid-cols-2 gap-x-4 gap-y-2`,children:[(0,H.jsx)(f,{label:`ID *`,hint:y?`ID không thể đổi sau khi phát hành`:`chữ thường / số / gạch dưới`,children:(0,H.jsx)(`input`,{value:x.id,onChange:e=>M(`id`,e.target.value),disabled:!!y,className:`${Q} font-mono`,placeholder:`hat_wizard_01`})}),(0,H.jsx)(f,{label:`Tên hiển thị *`,children:(0,H.jsx)(`input`,{value:x.name,onChange:e=>M(`name`,e.target.value),className:Q,placeholder:`Mũ phù thủy`})}),g===`species`&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(f,{label:`Emoji`,children:(0,H.jsx)(`input`,{value:x.emoji,onChange:e=>M(`emoji`,e.target.value),className:`${Q} text-lg`,placeholder:`🐶`})}),(0,H.jsx)(f,{label:`Mã hình vẽ`,hint:`Khớp loại trong src/data/petAssets.js (dog, cat, …)`,children:(0,H.jsx)(`input`,{value:x.shape||``,onChange:e=>M(`shape`,e.target.value),className:`${Q} font-mono`,placeholder:`dog`})}),(0,H.jsx)(f,{label:`Có hình SVG?`,hint:`Bỏ trống = chỉ hiện emoji`,children:(0,H.jsxs)(`select`,{value:x.art||``,onChange:e=>M(`art`,e.target.value),className:`${Q} bg-paper2`,children:[(0,H.jsx)(`option`,{value:``,children:`Không (chỉ emoji)`}),(0,H.jsx)(`option`,{value:`svg`,children:`Có (vẽ bằng SVG)`})]})}),(0,H.jsx)(f,{label:`Màu mặc định`,hint:t?.colors?.map(e=>e.id).join(`, `),children:(0,H.jsxs)(`select`,{value:x.defaultColor||``,onChange:e=>M(`defaultColor`,e.target.value),className:`${Q} bg-paper2`,children:[(0,H.jsx)(`option`,{value:``,children:`— Mặc định —`}),(t?.colors||[]).map(e=>(0,H.jsx)(`option`,{value:e.id,children:e.name},e.id))]})}),(0,H.jsx)(f,{label:`Đặc điểm`,className:`sm:col-span-2`,children:(0,H.jsx)(`input`,{value:x.trait||``,onChange:e=>M(`trait`,e.target.value),className:Q,placeholder:`Nhanh nhẹn · Trung thành`})}),(0,H.jsx)(f,{label:`Mô tả`,className:`sm:col-span-2`,children:(0,H.jsx)(`textarea`,{value:x.desc||``,onChange:e=>M(`desc`,e.target.value),rows:2,className:`${Q} min-h-[60px]`})}),(0,H.jsx)(f,{label:`Sở thích`,hint:`ngăn cách bằng dấu phẩy`,className:`sm:col-span-2`,children:(0,H.jsx)(`input`,{value:x.likes||``,onChange:e=>M(`likes`,e.target.value),className:Q,placeholder:`bone, ball, walk`})})]}),g===`color`&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(f,{label:`Màu thân`,children:(0,H.jsxs)(`div`,{className:`flex gap-2 mt-0.5`,children:[(0,H.jsx)(`input`,{type:`color`,value:x.body,onChange:e=>M(`body`,e.target.value),className:`w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0`}),(0,H.jsx)(`input`,{value:x.body,onChange:e=>M(`body`,e.target.value),className:`${Q} font-mono`})]})}),(0,H.jsx)(f,{label:`Màu nhấn`,children:(0,H.jsxs)(`div`,{className:`flex gap-2 mt-0.5`,children:[(0,H.jsx)(`input`,{type:`color`,value:x.accent,onChange:e=>M(`accent`,e.target.value),className:`w-10 h-10 rounded-xl border border-ink/10 cursor-pointer shrink-0`}),(0,H.jsx)(`input`,{value:x.accent,onChange:e=>M(`accent`,e.target.value),className:`${Q} font-mono`})]})})]}),g===`outfit`&&(0,H.jsxs)(H.Fragment,{children:[(0,H.jsx)(f,{label:`Ô trang phục *`,hint:`Ô này phải khớp OUTFIT_SLOTS ở frontend, nếu không sẽ không hiện`,children:(0,H.jsx)(`select`,{value:x.slot,onChange:e=>M(`slot`,e.target.value),className:`${Q} bg-paper2`,children:V.map(([e,t])=>(0,H.jsx)(`option`,{value:e,children:t},e))})}),(0,H.jsx)(f,{label:`Cấp mở khoá`,children:(0,H.jsx)(`input`,{type:`number`,min:1,value:x.minLevel,onChange:e=>M(`minLevel`,e.target.value),className:Q})}),(0,H.jsx)(f,{label:`Bảng màu *`,hint:`ngăn cách bằng dấu phẩy — phải khớp token trong SVG`,className:`sm:col-span-2`,children:(0,H.jsx)(`input`,{value:x.colors,onChange:e=>M(`colors`,e.target.value),className:`${Q} font-mono`,placeholder:`#FACC15, #FFD75E`})})]}),g!==`outfit`&&(0,H.jsx)(f,{label:`Cấp mở khoá`,children:(0,H.jsx)(`input`,{type:`number`,min:1,value:x.minLevel,onChange:e=>M(`minLevel`,e.target.value),className:Q})})]}),g===`outfit`&&(0,H.jsx)(`div`,{className:`mt-3`,children:(0,H.jsx)(ye,{kind:g,id:x.id})}),(0,H.jsx)(`div`,{className:`mt-4 flex justify-center py-3 rounded-xl bg-ink/[0.03]`,children:g===`outfit`?(0,H.jsx)(Y,{species:`dog`,color:`cream`,size:96,outfits:{[x.slot]:{id:y||x.id,color:$({colors:x.colors})}},showEmojiFallback:!1}):g===`color`?(0,H.jsx)(Y,{species:`dog`,color:y||x.id,size:96}):(0,H.jsx)(`span`,{className:`text-6xl`,children:x.emoji||`🐾`})}),T&&(0,H.jsx)(`p`,{className:`text-ticket text-sm mt-2`,children:T}),(0,H.jsxs)(`div`,{className:`mt-4 flex items-center gap-2 justify-end`,children:[(0,H.jsx)(ee,{onClick:F,children:`Hủy`}),(0,H.jsx)(d,{onClick:I,disabled:C,children:(0,H.jsxs)(`span`,{className:`flex items-center gap-1.5`,children:[(0,H.jsx)(c,{className:`w-4 h-4`}),C?`Đang lưu...`:y?`Cập nhật`:`Thêm mới`]})})]})]}),(0,H.jsx)(ae,{...O})]})}export{be as default};