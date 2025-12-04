import { useContext } from 'react';
import { SavvyContext } from '../../context/SavvyContext';
import styles from './GoalHistory.module.css';

export function GoalHistory() {
  const { completedGoals, handleDeleteCompletedGoal } = useContext(SavvyContext);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  if (!completedGoals || completedGoals.length === 0) {
    return null;
  }

  return (
    <div className={styles.goalHistory}>
      <h3 className={styles.title}>Lịch Sử Hoàn Thành</h3>
      <ul className={styles.historyList}>
        {completedGoals.map((goal) => (
          <li key={goal.id} className={styles.historyItem}>
            <span className={styles.historyItemTitle}>{goal.title}</span>
            <span className={styles.historyItemAmount}>
              {formatCurrency(goal.targetAmount)}
            </span>
            <button
              className={styles.deleteButton}
              onClick={() => handleDeleteCompletedGoal(goal.id)}
              title="Xóa khỏi lịch sử"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

