import { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { formatCurrency, formatPercentage } from '../../utils/formatters.js';
import styles from './HoldingItem.module.css';

export function HoldingItem({ coin }) {
    const { deleteTransaction, handleOpenEditModal } = useContext(PortfolioContext);

    const handleDelete = () => {
        console.warn("Chức năng xóa cần được định nghĩa lại trong Context");
    }

    const handleEdit = () => {
     
        console.warn("Chức năng sửa cần được định nghĩa lại trong Context");
    }

    const profitLossClass = coin.profitLoss >= 0 ? styles.profit : styles.loss;
    const change24hClass = coin.price_change_percentage_24h >= 0 ? styles.profit : styles.loss;

    return (
        <tr className={styles.holdingItem}>
            <td>
                <div className={styles.coinInfo}>
                    <img src={coin.image} alt={coin.name} className={styles.coinLogo} />
                    <div>
                        <div className={styles.coinName}>{coin.name}</div>
                        <div className={styles.coinSymbol}>{coin.symbol}</div>
                    </div>
                </div>
            </td>
            <td className={styles.textRight}>{formatCurrency(coin.current_price)}</td>
            <td className={`${change24hClass} ${styles.textRight}`}>{formatPercentage(coin.price_change_percentage_24h)}</td>
            <td className={styles.textRight}>{coin.amount.toLocaleString()}</td>
            <td className={styles.textRight}>{formatCurrency(coin.currentValue)}</td>
            <td className={styles.textRight}>{formatCurrency(coin.costBasis)}</td>
            <td className={styles.textRight}>{formatCurrency(coin.averageBuyPrice)}</td>
            <td className={`${profitLossClass} ${styles.textRight}`}>{formatCurrency(coin.profitLoss)}</td>
            
        </tr>
    );
}