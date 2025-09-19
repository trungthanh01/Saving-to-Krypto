import styles from './GoalCard.module.css';

export function GoalCard({ title, targetAmount }) {
  const currentAmount = 0;

  return (
    <div className={styles.card}>
      <div className={styles.cardContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.amount}>
          {currentAmount} / {targetAmount}
        </p>
      </div>
    </div>
  );
}