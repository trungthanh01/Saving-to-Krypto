import styles from './GoalCard.module.css';
import { AddButton } from './AddButton';

// Props: goal, savings, onAddSaving, onDelete
export function GoalCard({ goal, savings, onAddSaving, onDelete }) {
  // Bước 2.3: Tự tính tổng
  const currentAmount = savings
    .filter(saving => saving.goalId === goal.id)
    .reduce((sum, current) => sum + current.amount, 0);

  const progressPercentage = (currentAmount / (goal.targetAmount || 1)) * 100;
  const cappedPercentage = Math.min(progressPercentage, 100);

  const formattedCurrentAmount = (currentAmount || 0).toLocaleString('en-US');
  const formattedTargetAmount = (goal.targetAmount || 0).toLocaleString('en-US');

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.title}>{goal.title}</h3>
        <div className="buttonGoal">
          <AddButton onClick={onAddSaving}>
            Add Saving
          </AddButton>
          <button 
            className={styles.deleteButton}
            onClick={() => onDelete(goal.id)}>
              &times;
          </button>
        </div>
      </div>
      <div className={styles.cardBody}>
        <p className={styles.amount}>
          {formattedCurrentAmount} / {formattedTargetAmount}
        </p>
        <div className={styles.progressBar}>
          <div
            className={styles.progress}
            style={{ width: `${cappedPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}