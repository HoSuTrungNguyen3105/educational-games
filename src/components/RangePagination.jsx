import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import './RangePagination.css';

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




    useEffect(() => {
        const handlePerPageChange = (e) => {
            const perPage = e.detail.perPage;
            const newTo = Math.min(fromRecord + perPage - 1, totalItems);

            onRangeChange(fromRecord, newTo, false);
        };

        window.addEventListener('perPageChange', handlePerPageChange);
        return () =>
            window.removeEventListener('perPageChange', handlePerPageChange);
    }, [fromRecord, totalItems, onRangeChange]);

    const handleOpenEdit = () => {
        const pageSize = toRecord - fromRecord + 1;

        const newFrom = fromRecord;
        const newTo = Math.min(fromRecord + pageSize - 1, totalItems);

        setTempFrom(newFrom.toString());
        setTempTo(newTo.toString());
        setIsEditing(true);
    };

    const handleApply = () => {
        let from = Math.max(1, parseInt(tempFrom, 10) || fromRecord);
        let to = Math.min(
            totalItems,
            parseInt(tempTo, 10) || toRecord
        );

        if (from > to) {
            from = Math.max(1, to - (toRecord - fromRecord));
        }

        onRangeChange(from, to, false);
        setIsEditing(false);
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            if (
                containerRef.current &&
                !containerRef.current.contains(document.activeElement)
            ) {
                tempFrom || tempTo ? handleApply() : setIsEditing(false);
            }
        }, 150);
    };

    return (
        <div className={`range-pagination ${className || ''}`}>
            {!isEditing ? (
                <span
                    role="button"
                    tabIndex={0}
                    className="range-display"
                    onClick={handleOpenEdit}
                >
                    {fromRecord}-{Math.min(toRecord, totalItems)} / {totalItems}
                </span>
            ) : (
                <div ref={containerRef} className="range-edit">
                    <input
                        type="text"
                        value={tempFrom}
                        autoFocus
                        className="range-input"
                        onBlur={handleInputBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                        onChange={(e) =>
                            setTempFrom(e.target.value.replace(/\D/g, ''))
                        }
                    />
                    <span className="range-separator">-</span>
                    <input
                        type="text"
                        value={tempTo}
                        className="range-input"
                        onBlur={handleInputBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                        onChange={(e) =>
                            setTempTo(e.target.value.replace(/\D/g, ''))
                        }
                    />
                    <span className="range-separator">/</span>
                    <span className="range-total">{totalItems}</span>
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