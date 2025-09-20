import styles from './AddButton.module.css';
export function AddButton({children, onClick}){
    return(
    <button 
        className={styles.button} 
        onClick={onClick}>{children}
    </button>
    )
}