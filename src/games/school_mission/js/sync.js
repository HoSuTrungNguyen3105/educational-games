// ===== SYNC: nhận avatar + tiến độ từ app, gửi tiến độ lên API =====
// Dữ liệu vẫn được lưu localStorage như cũ (chơi được khi mất mạng), nhưng mỗi
// lần state thay đổi sẽ gửi thêm một bản cho trang cha để đẩy lên API.
//
// Trang cha (src/pages/SchoolMissionPage.jsx) chịu trách nhiệm:
//   · giữ hàng đợi khi mất mạng,
//   · gửi lại khi có wifi,
//   · trả state mới nhất về qua window.__SCHOOL_INIT__.savedState.

var schoolSyncReady = false;
var schoolSyncTimer = null;
var schoolLastSent = "";

function scheduleSchoolSync(delay) {
    if (!schoolSyncReady) return;
    if (schoolSyncTimer) clearTimeout(schoolSyncTimer);
    schoolSyncTimer = setTimeout(sendSchoolSync, delay == null ? 700 : delay);
}

function schoolSyncPayload() {
    var need = S.lv * 50 || 50;
    return {
        level: S.lv,
        experience: S.xp,
        progress: Math.max(0, Math.min(1, S.xp / need)),
        gameName: "Trường Vui Vẻ",
        gameState: S
    };
}

// Năng lượng tự hồi và _updated đổi liên tục; bỏ qua khi so sánh để không gọi
// API mỗi 5 giây chỉ vì hai giá trị này.
function schoolSyncSignature(state) {
    var copy = {};
    Object.keys(state || {}).forEach(function (key) {
        if (key !== "_updated" && key !== "en") copy[key] = state[key];
    });
    return JSON.stringify(copy);
}

function sendSchoolSync(force) {
    schoolSyncTimer = null;
    if (!schoolSyncReady) return;
    if (window.parent === window) return;

    var payload = schoolSyncPayload();
    var signature = schoolSyncSignature(S);
    if (!force && signature === schoolLastSent) return;

    schoolLastSent = signature;
    try {
        window.parent.postMessage({ type: "school-save", data: payload }, "*");
    } catch (e) {
        schoolLastSent = "";
    }
}

function applySavedSchoolState(remote) {
    if (!remote || typeof remote !== "object") return false;

    var localAt = Number(S._updated) || 0;
    var remoteAt = Number(remote._updated) || 0;
    if (remoteAt <= localAt) return false;

    S = Object.assign({
        coins: 100, gems: 0, xp: 0, lv: 1, en: 100,
        hat: "", col: "#ff9f43", own: ["", "#ff9f43"], q: {}, exam: {}
    }, remote);
    S.exam = S.exam || {};
    try { localStorage.setItem("tvv", JSON.stringify(S)); } catch (e) { /* ignore */ }
    return true;
}

function initSchoolSync() {
    var init = window.__SCHOOL_INIT__ || {};

    setPlayerName(init.playerName);
    if (init.avatarSvg) setPlayerAvatar(init.avatarSvg, init.avatarViewBox);
    else loadCachedPlayerAvatar();

    var remote = init.savedState;
    var mergedRemote = applySavedSchoolState(remote);

    window.addEventListener("message", function (event) {
        var msg = event && event.data;
        if (!msg || typeof msg !== "object") return;

        if (msg.type === "school-avatar" && msg.data) {
            setPlayerName(msg.data.playerName);
            if (msg.data.avatarSvg) setPlayerAvatar(msg.data.avatarSvg, msg.data.avatarViewBox);
        }
    });

    // Đóng tab / chuyển trang: gửi ngay bản mới nhất, không đợi debounce.
    window.addEventListener("pagehide", function () { sendSchoolSync(true); });

    schoolSyncReady = true;

    var localAt = Number(S._updated) || 0;
    var remoteAt = remote && Number(remote._updated) || 0;
    if (!mergedRemote && (!remote || localAt > remoteAt)) {
        scheduleSchoolSync(1200);
    }

    if (window.parent !== window) {
        try {
            window.parent.postMessage({ type: "school-ready", data: { gameId: "school-mission" } }, "*");
        } catch (e) { /* ignore */ }
    }
}
