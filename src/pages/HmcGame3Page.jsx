import { useState, useCallback } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";
import gameHtml from "../games/game3.html?raw";

const GAME = {
  id: "hmc-game3",
  code: "hmc-game3",
  name: "Học Mà Chơi LAB 2",
  title: "Học Mà Chơi LAB 2",
  subject: "Nhiều môn",
};

export default function HmcGame3Page() {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;
  const [mountKey, setMountKey] = useState(0);

  const handleQuit = useCallback(() => navigate("/"), []);

  return (
    <div className="fixed inset-0 bg-[#0c2a30]">
      <HtmlGameLoader
        key={`hmc-game3-${mountKey}`}
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
