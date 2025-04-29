import React, { useEffect } from "react";
import "./confirmationModal.scss";
import { openModalLock } from "../../helpers/openModalLock";

const ConfirmationModal = ({
  title = "Вы точно хотите удалить?",
  confirmText = "Удалить",
  cancelText = "Отмена",
  onConfirm,
  onCancel,
  isPending = false,
  danger = true,
}) => {
  useEffect(() => {
    openModalLock(true);
    return () => openModalLock(false);
  }, []);
  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal-title">{title}</div>
        <div className="modal-actions">
          <button
            className={`modal-btn${danger ? " modal-btn--danger" : ""}`}
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending ? "Удаление..." : confirmText}
          </button>
          <button className="modal-btn" onClick={onCancel} disabled={isPending}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
