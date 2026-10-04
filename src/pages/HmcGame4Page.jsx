import { useCallback } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";
import gameHtml from "../games/game4.html?raw";

const GAME = {
  id: "hmc-game4",
  code: "hmc-game4",
  name: "Học Mà Chơi OFFLINE",
  title: "Học Mà Chơi OFFLINE",
  subject: "Nhiều môn",
};

export default function HmcGame4Page() {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;

  const handleQuit = useCallback(() => navigate("/"), []);

  return (
    <div className="fixed inset-0 bg-[#0c2a30]">
      <HtmlGameLoader
        key="hmc-game4"
        htmlContent={gameHtml}
        game={GAME}
        questions={[]}
        playerName={user?.fullName || user?.username || "An Nhiên"}
        playMode="solo"
        userAuth={userAuth}
        onFinish={() => {}}
        onQuit={handleQuit}
        onStateUpdate={() => {}}
      />
    </div>
  );
}
