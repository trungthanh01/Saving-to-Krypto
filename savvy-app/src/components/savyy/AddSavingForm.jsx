import { useRef } from 'react'; // Bước 1: Import useRef
import styles from './AddSavingForm.module.css';
import { AddButton } from './AddButton';

export function AddSavingForm({ isOpen, onClose, onAddSaving }) {
  const formRef = useRef(null); // Bước 2: Tạo ref cho form

  if (!isOpen) {
    return null;
  }

  // Chuyển sang dùng onSubmit
  async function handleSubmit(event) {
    event.preventDefault();

    // Lấy dữ liệu từ form thông qua FormData
    const formData = new FormData(event.currentTarget);
    const amount = formData.get('amount');
    const description = formData.get('description');

    // Validation
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert('Vui lòng nhập một số tiền hợp lệ.');
      return;
    }
    if (!description) {
      alert('Vui lòng nhập mô tả.');
      return;
    }

    const newSaving = {
      amount: Number(amount),
      description: description,
    };

    onAddSaving(newSaving); // Gửi dữ liệu lên component cha

    formRef.current.reset(); // Xóa trắng form
    onClose(); // Đóng modal
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Thêm Tiền Tiết Kiệm</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </header>
        {/* Đổi action thành onSubmit */}
        <form onSubmit={handleSubmit} ref={formRef}>
          <div className={styles.formGroup}>
            <label htmlFor="amount">Số tiền</label>
            {/* Bước 3: Gỡ bỏ value/onChange, thêm `name` */}
            <input
              type="number"
              id="amount"
              name="amount"
              placeholder="0"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">Mô tả</label>
            <input
              type="text"
              id="description"
              name="description"
              placeholder="VD: Đầu tư tháng 9"
              required
            />
          </div>
          
          <div className={styles.formActions}>
            <AddButton>Lưu</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
}