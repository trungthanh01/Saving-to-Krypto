import { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { AppContext } from '../../context/AppContext';
import styles from './TransactionHistory.module.css';

export function TransactionHistory() {
  const { transactions, deleteTransaction, handleOpenEditModal } = useContext(PortfolioContext);
  const { coinList } = useContext(AppContext);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getCoinName = (coinId) => {
    const coin = coinList.find((c) => c.id === coinId);
    return coin ? coin.name : coinId;
  };

  if (!transactions || transactions.length === 0) {
    return (
      <div className={styles.transactionHistory}>
        <h4>Lịch Sử Giao Dịch</h4>
        <p className={styles.emptyState}>Chưa có giao dịch nào.</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionHistory}>
      <h4>Lịch Sử Giao Dịch</h4>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={`${styles.headerCell} ${styles.headerCellSticky} ${styles.firstColSticky}`}>
                Coin
              </th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky}`}>Loại</th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky} ${styles.alignRight}`}>
                Số lượng
              </th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky} ${styles.alignRight}`}>
                Giá/Coin
              </th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky} ${styles.alignRight}`}>
                Tổng
              </th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky}`}>Ngày</th>
              <th className={`${styles.headerCell} ${styles.headerCellSticky} ${styles.alignCenter}`}>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => {
              const total = tx.amount * (tx.pricePerCoin || 0);
              return (
                <tr key={tx.id}>
                  <td className={`${styles.cell} ${styles.firstColSticky} ${styles.coinName}`}>
                    {getCoinName(tx.coinId)}
                  </td>
                  <td className={styles.cell}>
                    <span className={`${styles.type} ${tx.type === 'buy' ? styles.typeBuy : styles.typeSell}`}>
                      {tx.type === 'buy' ? 'Mua' : 'Bán'}
                    </span>
                  </td>
                  <td className={`${styles.cell} ${styles.alignRight}`}>
                    {tx.amount.toLocaleString('en-US', { maximumFractionDigits: 8 })}
                  </td>
                  <td className={`${styles.cell} ${styles.alignRight}`}>
                    {formatCurrency(tx.pricePerCoin)}
                  </td>
                  <td className={`${styles.cell} ${styles.alignRight}`}>{formatCurrency(total)}</td>
                  <td className={styles.cell}>{formatDate(tx.date)}</td>
                  <td className={`${styles.cell} ${styles.alignCenter}`}>
                    <button className={styles.editBtn} onClick={() => handleOpenEditModal(tx)} title="Sửa">
                      ✏️
                    </button>
                    <button className={styles.deleteBtn} onClick={() => deleteTransaction(tx.id)} title="Xóa">
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

