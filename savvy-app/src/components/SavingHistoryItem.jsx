import styles from './SavingHistoryItem.module.css';

export function SavingHistoryItem({ description, amount, date, category }) {
  return (
    <div className={styles.item}>
      <div className={styles.details}>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span>{date}</span>
          <span className={styles.category}>({category})</span>
        </div>
      </div>
      <p className={styles.amount}>+${amount}</p>
    </div>
  );
}