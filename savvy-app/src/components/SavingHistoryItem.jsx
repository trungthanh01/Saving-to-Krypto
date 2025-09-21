import styles from './SavingHistoryItem.module.css';

export function SavingHistoryItem({id, description, amount, date, onDelete }) {
  return (
    <div className={styles.item}>
      <div className={styles.details}>
        <p className={styles.description}>{description}</p>
        <div className={styles.meta}>
          <span>{date}</span>
        </div>
      </div>
      <div className={styles.actions}>
        <p className={styles.amount}>
          +${amount.toLocaleString('es-US')}
        </p>
        <button 
          onClick={() => onDelete(id)} 
          className={styles.deleteButton}>
            &times;
        </button>
      </div>
      
    </div>
  );
}