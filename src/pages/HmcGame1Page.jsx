import { useState, useCallback } from "react";
import { navigate } from "../lib/router.js";
import { useUserAuthStore } from "../stores/userAuth.store.js";
import HtmlGameLoader from "../games/HtmlGameLoader.jsx";
import gameHtml from "../games/game1.html?raw";

const GAME = {
  id: "hmc-game1",
  code: "hmc-game1",
  name: "Học Mà Chơi",
  title: "Học Mà Chơi - 5 Trò Chơi",
  subject: "Nhiều môn",
};

export default function HmcGame1Page() {
  const { user, token } = useUserAuthStore();
  const userAuth = user ? { user, token } : null;
  const [mountKey, setMountKey] = useState(0);

  const handleQuit = useCallback(() => navigate("/"), []);

  return (
    <div className="fixed inset-0 bg-paper">
      <HtmlGameLoader
        key={`hmc-game1-${mountKey}`}
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
