import { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import styles from './SmartSuggestions.module.css';

export function SmartSuggestions() {
  const { smartSuggestions, totalProfitLoss, handleInitiateGoalCompletion } =
    useContext(PortfolioContext);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  if (!smartSuggestions) {
    return null;
  }

  const { completable, incompletable } = smartSuggestions;

  return (
    <div className={styles.smartSuggestionsContainer}>
      <h2>Gợi Ý Thông Minh</h2>

      {completable && completable.length > 0 && (
        <div className={`${styles.suggestionsSection} ${styles.completableSection}`}>
          <h4>Có thể hoàn thành ngay!</h4>
          <p>
            Bạn đang có lợi nhuận <strong>{formatCurrency(totalProfitLoss)}</strong>. 
            Các mục tiêu sau có thể được hoàn thành:
          </p>
          <ul>
            {completable.map((goal) => {
              const amountNeeded = goal.targetAmount - goal.currentAmount;
              return (
                <li key={goal.id}>
                  <strong>{goal.title}</strong> - Cần thêm {formatCurrency(amountNeeded)}
                  <button onClick={() => handleInitiateGoalCompletion(goal)}>
                    Hoàn thành
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {incompletable && incompletable.length > 0 && (
        <div className={`${styles.suggestionsSection} ${styles.incompleteSection}`}>
          <h4>Cần thêm thời gian</h4>
          <ul>
            {incompletable.map((goal) => {
              const amountNeeded = goal.targetAmount - goal.currentAmount;
              const remaining = amountNeeded - totalProfitLoss;
              return (
                <li key={goal.id}>
                  <strong>{goal.title}</strong> - Còn thiếu {formatCurrency(remaining > 0 ? remaining : 0)}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {(!completable || completable.length === 0) && (!incompletable || incompletable.length === 0) && (
        <p>Không có gợi ý nào. Hãy tạo mục tiêu mới!</p>
      )}
    </div>
  );
}

