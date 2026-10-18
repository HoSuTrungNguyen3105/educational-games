import PrimaryButton from "../buttons/PrimaryButton.jsx";

export function ErrorState({ title = "Đã có lỗi xảy ra", subtitle, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 gap-3">
      <div className="text-5xl">🎪</div>
      <h3 className="font-display text-lg text-ticket">{title}</h3>
      {subtitle && <p className="text-sm text-[#8A7C63] max-w-sm">{subtitle}</p>}
      {onRetry && <PrimaryButton onClick={onRetry}>Thử lại</PrimaryButton>}
    </div>
  );
}
