import styles from './GoalCard.module.css';

export function GoalCard({ title, targetAmount, currentAmount }) {
  // Để tránh lỗi chia cho 0 nếu targetAmount không có giá trị, ta mặc định nó là 1
  const progressPercentage = (currentAmount / (targetAmount || 1)) * 100;
  // Giới hạn giá trị của thanh tiến trình ở mức tối đa là 100%
  const cappedPercentage = Math.min(progressPercentage, 100);

  // Mặc định giá trị là 0 nếu chưa có để tránh lỗi
  const formattedCurrentAmount = (currentAmount || 0).toLocaleString('en-US');
  const formattedTargetAmount = (targetAmount || 0).toLocaleString('en-US');

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.amount}>
          {/* Sử dụng các biến đã được format */}
          {formattedCurrentAmount} / {formattedTargetAmount}
        </p>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${cappedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}