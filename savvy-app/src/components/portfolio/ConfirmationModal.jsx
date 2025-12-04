import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import styles from './ConfirmationModal.module.css';

export function ConfirmationModal() {
  const { modals, closeConfirmationModal, handleConfirm } = useContext(AppContext);

  const { isOpen, message } = modals.confirmation;

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeConfirmationModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Xác Nhận</h2>
        </div>

        <div className={styles.content}>
          <span>{message}</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={closeConfirmationModal}>
            Hủy
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm}>
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}

