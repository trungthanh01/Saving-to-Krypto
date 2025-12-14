import styles from './AddButton.module.css';

export function AddButton({ children, label, onClick }) {
  return (
    <button className={styles.button} onClick={onClick}>
      <span className={styles.icon}>+</span>
      {children || label}
    </button>
    //test
  );
}