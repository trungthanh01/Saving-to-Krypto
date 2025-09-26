import { useRef } from 'react';
import styles from './AddGoalForm.module.css'; // Sẽ tạo style sau
import { AddButton } from './AddButton';

export function AddGoalForm({ isOpen, onClose, onAddGoal }) {
  const formRef = useRef(null);

  if (!isOpen) {
    return null;
  }

  async function handleAddGoalAction(formData) {
    const title = formData.get('title');
    const targetAmount = formData.get('targetAmount');

    // Validation
    if (!title) {
      alert('Vui lòng nhập tên mục tiêu.');
      return;
    }
    if (!targetAmount || isNaN(targetAmount) || Number(targetAmount) <= 0) {
      alert('Vui lòng nhập số tiền hợp lệ cho mục tiêu.');
      return;
    }

    const newGoal = {
      title: title,
      targetAmount: Number(targetAmount),
    };

    onAddGoal(newGoal); // Gửi dữ liệu lên App.jsx

    formRef.current.reset(); // Xóa trắng form
    onClose(); // Đóng modal
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Thêm mục tiêu mới</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </header>
        <form action={handleAddGoalAction} ref={formRef}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tên mục tiêu</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="VD: Mua Macbook mới"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="targetAmount">Số tiền cần đạt</label>
            <input
              type="number"
              id="targetAmount"
              name="targetAmount"
              placeholder="0"
              required
            />
          </div>
          <div className={styles.formActions}>
            <AddButton>Lưu mục tiêu</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
}