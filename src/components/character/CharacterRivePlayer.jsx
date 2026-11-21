/**
 * CharacterRivePlayer.jsx — trình phát Rive cho CharacterStage.
 *
 * File này là NƠI DUY NHẤT import `@rive-app/react-canvas` và chỉ được
 * CharacterStage nạp lười (React.lazy) SAU KHI đã dò thấy file `.riv`
 * của body tồn tại thật trong `public/animations/characters/`. Repo hiện
 * chưa có file `.riv` nào nên chunk này không bao giờ tải trong thực tế
 * hiện nay — khi nào có file .riv đúng đặc tả (artboard
 * `CharacterArtboard`, state machine `MainStateMachine`, inputs `mood`
 * dạng chuỗi, `turnX` dạng số -1..1, trigger `triggerCelebrate`) thì nó
 * tự chạy, không phải sửa code.
 *
 * Inputs lấy từ `rive.stateMachineInputs(...)` mỗi lần giá trị đổi và
 * gán `.value` / `.fire()` — đúng API của Rive runtime. Thiếu input nào
 * thì bỏ qua input đó; lỗi tải file thì báo `onError` để CharacterStage
 * rơi về fallback SVG.
 */
import { useEffect, useRef } from "react";
import { useRive } from "@rive-app/react-canvas";
import { characterPublicUrl } from "../../config/characterBodies.js";

function findInput(rive, stateMachine, name) {
  if (!rive) return null;
  try {
    const inputs = rive.stateMachineInputs(stateMachine) || [];
    return inputs.find((i) => i.name === name) || null;
  } catch {
    return null;
  }
}

export default function CharacterRivePlayer({
  body,
  mood = "idle",
  turnX = 0,
  celebrateKey = 0,
  onError,
}) {
  const { rive, RiveComponent } = useRive({
    src: characterPublicUrl(body.riveFile),
    artboard: body.artboard,
    stateMachines: body.stateMachine,
    autoplay: true,
    onLoadError: () => onError?.(),
  });

  useEffect(() => {
    const input = findInput(rive, body.stateMachine, "mood");
    if (input) input.value = mood;
  }, [rive, body.stateMachine, mood]);

  useEffect(() => {
    const input = findInput(rive, body.stateMachine, "turnX");
    if (input) input.value = turnX;
  }, [rive, body.stateMachine, turnX]);

  const firstKey = useRef(true);
  useEffect(() => {
    if (firstKey.current) {
      firstKey.current = false;
      return;
    }
    findInput(rive, body.stateMachine, "triggerCelebrate")?.fire();
  }, [celebrateKey, rive, body.stateMachine]);

  return <RiveComponent className="cs__rive" role="img" aria-label={body.name} />;
}
