// Dòng 1: Import file CSS module.
// React sẽ xử lý file này và tạo ra các tên class độc nhất.
import styles from './GoalCard.module.css';

// Chúng ta dùng destructuring ({ title, targetAmount }) để lấy trực tiếp
// các giá trị từ object props, thay vì phải viết props.title.
export function GoalCard({ title, targetAmount }) {
  // Tạm thời, chúng ta sẽ hiển thị số tiền đã có là 0.
  // Ở giai đoạn sau, con số này sẽ được tính toán động.
  const currentAmount = 0;

  return (
    // Dòng 15: Chúng ta sử dụng tên class từ object `styles` đã import.
    // Thay vì `className="card"`, ta dùng `className={styles.card}`.
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.amount}>
          {currentAmount} / {targetAmount}
        </p>
      </div>
      {/* Thanh tiến trình sẽ được thêm vào ở đây sau */}
    </div>
  );
}