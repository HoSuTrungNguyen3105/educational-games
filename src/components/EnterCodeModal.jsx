import { useState } from 'react'
import { gameService } from '../services/api.js'
import { Modal, PrimaryButton, TicketStub } from './ui.jsx'

/**
 * Modal nhập mã vé để tham gia trò chơi
 * @param {boolean} open - Trạng thái mở/đóng modal
 * @param {function} onClose - Callback khi đóng modal
 * @param {function} onFound - Callback khi tìm thấy game (nhận game object)
 */
export function EnterCodeModal({ open, onClose, onFound }) {
    const [code, setCode] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitCode = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;
        setLoading(true);
        setError(null);
        const game = await gameService.getByCode(code);
        setLoading(false);
        if (!game) {
            setError("Không tìm thấy trò chơi với mã này. Kiểm tra lại hoặc chọn trò chơi trong danh sách nhé!");
            return;
        }
        // Reset và đóng modal
        setCode("");
        setError(null);
        onClose();
        onFound(game);
    };

    const handleClose = () => {
        setCode("");
        setError(null);
        onClose();
    };

    if (!open) return null;

    return (
        <Modal onClose={handleClose}>
            <div className="text-center">
                <div className="text-6xl mb-4 float-slow">🎟️</div>
                <h2 className="font-display text-xl text-ink mb-2">Nhập mã vé</h2>
                <p className="text-sm text-[#8A7C63] mb-4">Nhập mã vé giáo viên đã cung cấp</p>
                <form onSubmit={submitCode}>
                    <TicketStub icon="🔑" code={code || "______"} />
                    <input
                        value={code}
                        onChange={e => { setCode(e.target.value.toUpperCase()); setError(null); }}
                        placeholder="VD: TOAN101"
                        maxLength={10}
                        autoFocus
                        className="w-full text-center font-mono text-lg tracking-[0.2em] note-card px-4 py-3 mt-4 border-ink/10 focus:border-ticket uppercase"
                    />
                    {error && <p className="text-ticket text-sm mt-3">{error}</p>}
                    <div className="flex gap-3 mt-5">
                        <PrimaryButton
                            type="button"
                            onClick={handleClose}
                            className="flex-1 bg-paper2 text-ink border border-ink/10 hover:bg-ink hover:text-paper"
                        >
                            Huỷ
                        </PrimaryButton>
                        <PrimaryButton
                            type="submit"
                            className="flex-1"
                            disabled={loading || !code.trim()}
                        >
                            {loading ? "Đang kiểm tra..." : "Tham gia →"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </Modal>
    );
}
