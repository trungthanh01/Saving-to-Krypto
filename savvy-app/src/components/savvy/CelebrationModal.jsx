import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import styles from './CelebrationModal.module.css';

export function CelebrationModal() {
  const { modals, closeCelebrationModal } = useContext(AppContext);

  const { isOpen, message } = modals.celebration;

  if (!isOpen) return null;

  return (
    <div className={styles.celebrationOverlay} onClick={closeCelebrationModal}>
      <div className={styles.celebrationModal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.celebrationContent}>
          <h2>🎉 Chúc Mừng! 🎉</h2>
          <p>{message}</p>
          <button className={styles.celebrationCloseBtn} onClick={closeCelebrationModal}>
            Tuyệt vời!
          </button>
        </div>
      </div>
    </div>
  );
}

