import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './RangePagination.css';

/**
 * Phân trang dạng khoảng "1-10 / 100". Bấm vào khoảng → hai ô nhập hiện đúng
 * giá trị đang hiển thị (1 và 10); nhập số nào rồi Enter thì gửi đúng số đó lên
 * onRangeChange(from, to) để trang gọi API.
 *
 * Enter áp dụng được ở cả 3 đường:
 *   · máy tính: Enter (có preventDefault + chặn lúc bộ gõ tiếng Việt đang ghép dấu)
 *   · điện thoại: inputMode="numeric" + enterKeyHint="go", hoặc gập bàn phím
 *     (blur) cũng tự áp dụng — bản cũ dùng setTimeout 150ms nên có lúc bị hủy
 *   · nút "Xem" trong ô, cần cho iOS vì bàn phím số không có phím Enter
 */
const RangePagination = ({
    fromRecord,
    toRecord,
    totalItems,
    onRangeChange,
    onPrevPage,
    onNextPage,
    className,
    disabled,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempFrom, setTempFrom] = useState('');
    const [tempTo, setTempTo] = useState('');
    const containerRef = useRef(null);
    // Bộ gõ Telex/VNI: khi đang ghép dấu, Enter chỉ xác nhận chuỗi dự thảo.
    const isComposing = useRef(false);

    const total = Math.max(0, Number(totalItems) || 0);

    const close = () => setIsEditing(false);

    const handleOpenEdit = () => {
        if (disabled || total === 0) return;
        setTempFrom(String(fromRecord));
        setTempTo(String(Math.min(toRecord, total)));
        setIsEditing(true);
    };

    const apply = () => {
        const max = Math.max(1, total);
        let from = parseInt(tempFrom, 10);
        let to = parseInt(tempTo, 10);
        // Ô trống thì giữ giá trị cũ, không âm thầm nhảy về trang 1 như bản cũ.
        if (!Number.isFinite(from)) from = fromRecord;
        if (!Number.isFinite(to)) to = toRecord;
        from = Math.min(Math.max(1, from), max);
        to = Math.min(Math.max(1, to), max);
        // Nhập from lớn hơn to (ví dụ chỉ sửa ô đầu: 21 trong khi ô sau còn 10)
        // → giữ số vừa gõ, đẩy to theo kích thước trang. Bản cũ kéo from về 1
        // nên trông như "nhập không nhận".
        if (from > to) {
            const size = Math.max(1, toRecord - fromRecord + 1);
            to = Math.min(max, from + size - 1);
        }
        close();
        onRangeChange(from, to, false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            close();
            return;
        }
        if (e.key !== 'Enter') return;
        e.preventDefault();  // không để phần tử cha nuốt phím / submit form
        if (isComposing.current || e.nativeEvent?.isComposing) return;
        apply();
    };

    // Di chuyển focus giữa hai ô thì bỏ qua; ra ngoài ô (hoặc gập bàn phím) → áp dụng.
    const handleBlur = (e) => {
        if (containerRef.current?.contains(e.relatedTarget)) return;
        apply();
    };

    const digits = (setter) => (e) => setter(e.target.value.replace(/\D/g, ''));

    return (
        <div className={`range-pagination ${className || ''}`}>
            {!isEditing ? (
                <span
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    className="range-display"
                    title="Bấm để nhập khoảng bản ghi"
                    onClick={handleOpenEdit}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleOpenEdit();
                        }
                    }}
                >
                    {fromRecord}-{Math.min(toRecord, total)} / {total}
                </span>
            ) : (
                <div ref={containerRef} className="range-edit">
                    <input
                        type="text"
                        value={tempFrom}
                        autoFocus
                        className="range-input"
                        inputMode="numeric"
                        enterKeyHint="go"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="Bản ghi đầu"
                        onBlur={handleBlur}
                        onCompositionStart={() => { isComposing.current = true; }}
                        onCompositionEnd={() => { isComposing.current = false; }}
                        onKeyDown={handleKeyDown}
                        onChange={digits(setTempFrom)}
                    />
                    <span className="range-separator">-</span>
                    <input
                        type="text"
                        value={tempTo}
                        className="range-input"
                        inputMode="numeric"
                        enterKeyHint="go"
                        autoComplete="off"
                        autoCorrect="off"
                        spellCheck={false}
                        aria-label="Bản ghi cuối"
                        onBlur={handleBlur}
                        onCompositionStart={() => { isComposing.current = true; }}
                        onCompositionEnd={() => { isComposing.current = false; }}
                        onKeyDown={handleKeyDown}
                        onChange={digits(setTempTo)}
                    />
                    <span className="range-separator">/</span>
                    <span className="range-total">{total}</span>
                    <button
                        type="button"
                        className="range-go"
                        // giữ focus ở ô nhập để Enter/blur không chạy trước click
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={apply}
                    >
                        Xem
                    </button>
                </div>
            )}

            <div className="range-actions">
                <button
                    type="button"
                    className="range-btn"
                    onClick={onPrevPage}
                    disabled={disabled}
                >
                    ‹
                </button>
                <button
                    type="button"
                    className="range-btn"
                    onClick={onNextPage}
                    disabled={disabled}
                >
                    ›
                </button>
            </div>
        </div>
    );
};

RangePagination.propTypes = {
    fromRecord: PropTypes.number.isRequired,
    toRecord: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    onRangeChange: PropTypes.func.isRequired,
    onPrevPage: PropTypes.func.isRequired,
    onNextPage: PropTypes.func.isRequired,
    className: PropTypes.string,
    disabled: PropTypes.bool,
};

RangePagination.defaultProps = {
    className: '',
    disabled: false,
};

export default RangePagination;
