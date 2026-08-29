export default function TaskReward({ rewardCoin, completed, claimed, onClaim, claiming }) {
  if (claimed) {
    return (
      <span className="text-[10px] font-bold text-teal bg-teal/10 px-3 py-1 rounded-full">
        ✓ Đã nhận
      </span>
    );
  }

  if (completed) {
    return (
      <button
        onClick={onClaim}
        disabled={claiming}
        className="text-[11px] font-bold text-white bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1.5 rounded-full hover:from-amber-500 hover:to-orange-500 transition active:scale-95 shadow-sm disabled:opacity-50"
      >
        Nhận thưởng
      </button>
    );
  }

  return (
    <span className="text-sm font-bold text-gold">
      +{rewardCoin} 💰
    </span>
  );
}
