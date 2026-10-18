
export function Loader({ label = "Đang tải..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-ink/70">
      <div className="relative w-14 h-14">
        <div className="absolute inset-0 rounded-full border-4 border-ink/10"></div>
        <div className="absolute inset-0 rounded-full border-4 border-ticket border-t-transparent animate-spin"></div>
      </div>
      <p className="font-body text-sm">{label}</p>
    </div>
  );
}
