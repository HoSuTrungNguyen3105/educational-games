/**
 * ui/index.js — điểm vào duy nhất cho bộ component giao diện dùng chung.
 *
 * Mỗi component nằm ở thư mục theo nhóm:
 *   buttons/  nút bấm        forms/    ô nhập & biểu mẫu
 *   overlay/  hộp thoại      feedback/ trạng thái & thông báo
 *   data/     bảng & thẻ số liệu       layout/  khối trang trí
 *
 *   import { PrimaryButton, Modal } from "../components/ui";
 */

// ── buttons ──
export { default as OptionButton } from "./buttons/OptionButton.jsx";
export { PrimaryButton } from "./buttons/PrimaryButton.jsx";
export { GhostButton } from "./buttons/GhostButton.jsx";
export { IconButton } from "./buttons/IconButton.jsx";

// ── forms ──
export { Input } from "./forms/Input.jsx";
export { Checkbox } from "./forms/Checkbox.jsx";
export { Select } from "./forms/Select.jsx";
export { ToggleSwitch } from "./forms/ToggleSwitch.jsx";
export { default as DateTimePicker } from "./forms/DateTimePicker.jsx";
export { PasswordInput } from "./forms/PasswordInput.jsx";
export { Field } from "./forms/Field.jsx";
export { FormField } from "./forms/FormField.jsx";
export { FormModal } from "./forms/FormModal.jsx";
export { SearchInput } from "./forms/SearchInput.jsx";

// ── feedback ──
export { Loader } from "./feedback/Loader.jsx";
export { EmptyState } from "./feedback/EmptyState.jsx";
export { ErrorState } from "./feedback/ErrorState.jsx";
export { Toast } from "./feedback/Toast.jsx";

// ── overlay ──
export { Modal } from "./overlay/Modal.jsx";
export { ConfirmModal } from "./overlay/ConfirmModal.jsx";

// ── data ──
export { StatusBadge } from "./data/StatusBadge.jsx";
export { StatCard } from "./data/StatCard.jsx";
export { StatGrid } from "./data/StatGrid.jsx";
export { ManagementTable } from "./data/ManagementTable.jsx";
export { useViewMode, ViewToggle, cardGridClass, tableWrapClass } from "./data/ViewToggle.jsx";

// ── layout ──
export { StampToken } from "./layout/StampToken.jsx";
export { TicketStub } from "./layout/TicketStub.jsx";
export { ManagementHeader } from "./layout/ManagementHeader.jsx";
// Icon dự án (IconClose, IconUsers, …) — xem layout/Icon.jsx
export * from "./layout/Icon.jsx";

