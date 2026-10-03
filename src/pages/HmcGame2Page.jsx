import { useState, useCallback } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";
import gameHtml from "../games/game2.html?raw";

const GAME = {
  id: "hmc-game2",
  code: "hmc-game2",
  name: "Học Mà Chơi LAB",
  title: "Học Mà Chơi LAB",
  subject: "Nhiều môn",
};

export default function HmcGame2Page() {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;
  const [mountKey, setMountKey] = useState(0);

  const handleQuit = useCallback(() => navigate("/"), []);

  return (
    <div className="fixed inset-0 bg-[#0c2a30]">
      <HtmlGameLoader
        key={`hmc-game2-${mountKey}`}
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
