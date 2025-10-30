import './ConfirmationModal.css';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';  // ✅ Add .jsx

export function ConfirmationModal() {
  // ─────────────────────────────────────────────────
  // CONTEXT: AppContext
  // ─────────────────────────────────────────────────
  const { 
    modals, 
    closeConfirmationModal, 
    handleConfirm 
  } = useContext(AppContext);

  // ─────────────────────────────────────────────────
  // DESTRUCTURE: Confirmation modal state
  // ─────────────────────────────────────────────────
  const { 
    isOpen, 
    message,
    onConfirm,  // ✅ This exists in AppContext
  } = modals.confirmation;

  // ─────────────────────────────────────────────────
  // EARLY RETURN: Modal closed
  // ─────────────────────────────────────────────────
  if (!isOpen) {
    return null;
  }

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div className="overlay" onClick={closeConfirmationModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="header">
          <h2>Xác nhận</h2>
        </header>

        <div className="content">
          <span>{message}</span>
        </div>

        <footer className="actions">
          {/* ✅ Confirm button calls handleConfirm from AppContext */}
          <button className="confirm-btn" onClick={handleConfirm}>
            Xác nhận
          </button>

          {/* ✅ Cancel button just closes the modal */}
          <button className="cancel-btn" onClick={closeConfirmationModal}>
            Hủy
          </button>
        </footer>
      </div>
    </div>
  );
}