import { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import styles from './MainHeader.module.css';

export function MainHeader({ title }) {
    const { openAddHoldingModal } = useContext(PortfolioContext);

    return (
        <header className={styles.mainHeader}>
            <h1>{title}</h1>
        </header>
    );
}
