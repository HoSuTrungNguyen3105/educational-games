import { useState, useRef, useEffect } from 'react'
import { gameService } from '../services/api.js'
import { Modal, PrimaryButton } from './ui'
import { Ticket, KeyRound, ArrowRight } from 'lucide-react'

export function EnterCodeModal({ open, onClose, onFound }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const inputRef = useRef(null);

    // Tự động focus vào ô nhập vé khi mở modal
    useEffect(() => {
        if (open) {
            const timer = setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [open]);

    const submitCode = async (e) => {
        e.preventDefault();
        const trimmedCode = code.trim();
        if (!trimmedCode) return;
        setLoading(true);
        setError(null);
        try {
            const game = await gameService.getByCode(trimmedCode);
            setLoading(false);
            if (!game) {
                setError("Không tìm thấy trò chơi với mã này. Kiểm tra lại hoặc chọn trò chơi trong danh sách nhé!");
                return;
            }
            setCode("");
            setError(null);
            onClose();
            onFound(game);
        } catch (err) {
            setLoading(false);
            setError("Đã xảy ra lỗi khi kiểm tra mã. Vui lòng thử lại!");
        }
    };

    const handleClose = () => {
        setCode("");
        setError(null);
        onClose();
    };

    if (!open) return null;

    return (
        <Modal 
            onClose={handleClose}
            contentClassName="!max-w-[540px] !p-6 sm:!p-8"
        >
            <div className="text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100/80 text-ticket float-slow shadow-sm">
                    <Ticket className="w-9 h-9" />
                </div>
                
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-ink mb-2">Nhập mã vé trò chơi</h2>
                <p className="text-sm sm:text-base text-ink/70 mb-6">
                    Nhập mã vé do giáo viên cung cấp để tham gia trò chơi ngay
                </p>

                <form onSubmit={submitCode}>
                    {/* Ô nhập dạng vé duy nhất ở trên - nhập trực tiếp tại đây */}
                    <div 
                        onClick={() => inputRef.current?.focus()}
                        className="ticket-stub shadow-sm cursor-text transition-all duration-200 border-2 border-dashed border-ink/30 hover:border-ticket focus-within:border-ticket focus-within:ring-4 focus-within:ring-ticket/20 bg-[#FFFBF2]"
                    >
                        <div className="ticket-stub-tab w-16 sm:w-20 bg-amber-500/10">
                            <KeyRound className="w-6 h-6 text-ink/70" />
                        </div>
                        <div className="ticket-stub-body flex items-center justify-center p-3 sm:p-4">
                            <input
                                ref={inputRef}
                                type="text"
                                value={code}
                                onChange={e => { 
                                    setCode(e.target.value.toUpperCase()); 
                                    setError(null); 
                                }}
                                placeholder="VD: TOAN101"
                                maxLength={10}
                                autoFocus
                                className="w-full bg-transparent text-center font-mono text-2xl sm:text-3xl tracking-[0.2em] sm:tracking-[0.25em] text-ink font-bold uppercase placeholder:text-ink/30 placeholder:tracking-normal placeholder:font-sans placeholder:text-base sm:placeholder:text-lg outline-none border-none focus:outline-none focus:ring-0"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-3 mt-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Nút bấm cách xa nhau, kích thước lớn, dễ bấm */}
                    <div className="flex items-center gap-4 sm:gap-6 mt-8 sm:mt-10">
                        <PrimaryButton
                            type="button"
                            onClick={handleClose}
                            className="flex-1 !py-3.5 !text-base sm:!text-lg !bg-paper2 !text-ink border-2 border-ink/15 hover:!bg-ink/10 hover:border-ink/30 transition-all font-semibold"
                        >
                            Huỷ
                        </PrimaryButton>
                        <PrimaryButton
                            type="submit"
                            className="flex-1 !py-3.5 !text-base sm:!text-lg !bg-ticket hover:!bg-ticket/90 text-white shadow-md hover:shadow-lg transition-all font-bold flex items-center justify-center gap-2"
                            disabled={loading || !code.trim()}
                        >
                            {loading ? (
                                "Đang kiểm tra..."
                            ) : (
                                <>
                                    <span>Tham gia</span>
                                    <ArrowRight className="w-5 h-5 inline-block" />
                                </>
                            )}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}