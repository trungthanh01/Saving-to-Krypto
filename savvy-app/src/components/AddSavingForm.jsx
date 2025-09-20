import { useRef } from 'react'; // Bước 1: Import useRef
import styles from './AddSavingForm.module.css';
import { AddButton } from './AddButton';

export function AddSavingForm({ isOpen, onClose, onAddSaving }) {
  const formRef = useRef(null); // Bước 2: Tạo ref cho form

  if (!isOpen) {
    return null;
  }

  // Bước 4: Viết lại hàm xử lý dưới dạng một "action"
  async function handleAddSavingAction(formData) {
    const amount = formData.get('amount');
    const description = formData.get('description');
    const category = formData.get('category');

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
      category: category,
    };

    onAddSaving(newSaving); // Gửi dữ liệu lên component cha

    formRef.current.reset(); // Xóa trắng form
    onClose(); // Đóng modal
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <h2>Thêm giao dịch mới</h2>
          <button className={styles.closeButton} onClick={onClose}>
            &times;
          </button>
        </header>
        {/* Bước 5: Kết nối ref và action vào form */}
        <form action={handleAddSavingAction} ref={formRef}>
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
              placeholder="VD: Tiền lương tháng 9"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category">Danh mục</label>
            <select id="category" name="category" defaultValue="Thu nhập">
              <option value="Thu nhập">Thu nhập</option>
              <option value="Bán đồ">Bán đồ</option>
              <option value="Quà tặng">Quà tặng</option>
              <option value="Khác">Khác</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <AddButton>Lưu</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
}