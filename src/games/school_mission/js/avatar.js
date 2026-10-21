// ===== AVATAR: vẽ avatar thật của người chơi (lấy từ hồ sơ trong app) =====
// Avatar được trang cha gửi qua window.__SCHOOL_INIT__.avatarSvg (markup bên
// trong thẻ <svg>). Ở đây chỉ bọc lại bằng viewBox chuẩn rồi nạp thành Image để
// canvas vẽ được. Nếu chưa có (mở file trực tiếp / chưa đăng nhập) thì dùng bản
// đã lưu trên máy; cuối cùng mới rơi về nhân vật vẽ tay cũ.

var PLAYER_AVATAR_KEY = "tvv_avatar_v1";
var PLAYER_AVATAR_VIEWBOX = "0 0 512 700";
var playerAvatarImg = null;
var playerAvatarName = "Bạn";
var playerAvatarFailed = false;

function buildAvatarSvg(inner, viewBox) {
    if (!inner || typeof inner !== "string") return "";
    var vb = viewBox && typeof viewBox === "string" ? viewBox : PLAYER_AVATAR_VIEWBOX;
    var box = vb.split(/\s+/);
    var vw = Number(box[2]) || 512;
    var vh = Number(box[3]) || 700;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + vw + '" height="' + vh +
        '" viewBox="' + vb + '">' + inner + "</svg>";
}

function setPlayerAvatar(inner, viewBox) {
    var svg = buildAvatarSvg(inner, viewBox);
    if (!svg) return;

    PLAYER_AVATAR_VIEWBOX = viewBox || PLAYER_AVATAR_VIEWBOX;
    playerAvatarFailed = false;

    var img = new Image();
    img.onload = function () {
        playerAvatarImg = img;
    };
    img.onerror = function () {
        playerAvatarImg = null;
        playerAvatarFailed = true;
    };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);

    try {
        localStorage.setItem(PLAYER_AVATAR_KEY, JSON.stringify({
            inner: inner,
            viewBox: PLAYER_AVATAR_VIEWBOX
        }));
    } catch (e) { /* localStorage bị chặn — vẫn dùng ảnh trong phiên này */ }
}

function loadCachedPlayerAvatar() {
    try {
        var raw = localStorage.getItem(PLAYER_AVATAR_KEY);
        if (!raw) return;
        var saved = JSON.parse(raw);
        if (saved && saved.inner) setPlayerAvatar(saved.inner, saved.viewBox);
    } catch (e) { /* bỏ qua avatar hỏng */ }
}

function setPlayerName(name) {
    playerAvatarName = name || "Bạn";
}

function drawPlayer() {
    if (playerAvatarImg && !playerAvatarFailed) {
        var h = 62;
        var ratio = playerAvatarImg.width && playerAvatarImg.height
            ? playerAvatarImg.width / playerAvatarImg.height
            : 512 / 700;
        var w = h * ratio;
        var bob = Math.abs(Math.sin(me.t * 0.8)) * 2.2 * me.mv;

        g.fillStyle = "rgba(0,0,0,.25)";
        g.beginPath();
        g.ellipse(me.x, me.y, w * 0.38, 6, 0, 0, 7);
        g.fill();

        g.drawImage(playerAvatarImg, me.x - w / 2, me.y - h + 3 - bob, w, h);
        tx(playerAvatarName, me.x, me.y - h - 4 - bob, 12, "#fff", "rgba(0,0,0,.6)");
        return;
    }

    chr(me.x, me.y, S.col, S.hat, playerAvatarName, me.t, null, me.mv);
}
