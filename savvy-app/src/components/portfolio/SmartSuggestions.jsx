import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { useNavigate } from 'react-router-dom';
import './SmartSuggestions.css';

export function SmartSuggestions() {
  // ─────────────────────────────────────────
  // CONTEXT & HOOKS
  // ─────────────────────────────────────────
  const { 
    smartSuggestions, 
    handleInitiateGoalCompletion, 
    totalProfitLoss 
  } = useContext(PortfolioContext);

  const navigate = useNavigate();

  // ─────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ─────────────────────────────────────────
  const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value || 0);

  // ─────────────────────────────────────────
  // EARLY RETURN
  // ─────────────────────────────────────────
  if (!smartSuggestions || 
      (smartSuggestions.completable.length === 0 && 
       smartSuggestions.incompletable.length === 0)) {
    return null;
  }

  // ─────────────────────────────────────────
  // TASK 15.4: HANDLER - Complete Goal Click
  // ─────────────────────────────────────────
  // ✅ SIMPLIFIED: Chỉ gọi handleInitiateGoalCompletion từ PortfolioContext
  // ✅ Không cần import AppContext nữa
  const handleCompleteGoalClick = (goal) => {
    // Step 1: Gọi PortfolioContext để:
    //   - Mở modal AddTransaction
    //   - Set goalCompletionData
    //   - Pass transaction template
    handleInitiateGoalCompletion(goal);

    // Step 2: Navigate về dashboard
    navigate('/');
  };

  // ─────────────────────────────────────────
  // DESTRUCTURE & CALCULATE
  // ─────────────────────────────────────────
  const { completable, incompletable } = smartSuggestions;

  let totalAmountNeeded = 0;
  let percentageOfProfit = 0;
  let remainingProfit = 0;

  if (completable.length > 0) {
    // Tính tổng tiền cần để hoàn thành tất cả mục tiêu
    totalAmountNeeded = completable.reduce((sum, goal) => {
      return sum + (goal.targetAmount - goal.currentAmount);
    }, 0);

    // Tính phần trăm lợi nhuận cần chốt
    percentageOfProfit = totalProfitLoss > 0 
      ? (totalAmountNeeded / totalProfitLoss) * 100 
      : 0;

    // Tính lợi nhuận còn lại sau khi hoàn thành
    remainingProfit = totalProfitLoss - totalAmountNeeded;
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    // ✅ XÓA onClick handler từ container
    <div className="smart-suggestions-container">
      <h2>✨ Gợi ý Thông minh</h2>

      {/* ─── Khu vực mục tiêu có thể hoàn thành ─── */}
      {completable.length > 0 && (
        <div className="suggestions-section completable-section">
          <p>
            Tuyệt vời! Tổng lợi nhuận <strong>{formatCurrency(totalProfitLoss)}</strong> của bạn đã đủ để hoàn thành các mục tiêu sau:
          </p>
          <ul>
            {completable.map((goal) => {
              const amountNeeded = goal.targetAmount - goal.currentAmount;
              return (
                <li key={goal.id}>
                  <span>
                    <strong>{goal.title}</strong>: chỉ còn thiếu {formatCurrency(amountNeeded)}
                  </span>
                  {/* ✅ onClick handler chỉ ở button, không phải container */}
                  <button onClick={() => handleCompleteGoalClick(goal)}>
                    Hoàn thành ngay
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="completable-summary">
            <p>
              Để hoàn thành các mục tiêu trên, bạn cần chốt lời <strong>{formatCurrency(totalAmountNeeded)}</strong>, tương đương <strong>{percentageOfProfit.toFixed(1)}%</strong> tổng lợi nhuận.
              <br />
              Số lợi nhuận còn lại của bạn sẽ là: <strong>{formatCurrency(remainingProfit)}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ─── Khu vực mục tiêu chưa hoàn thành ─── */}
      {incompletable.length > 0 && (
        <div className="suggestions-section incomplete-section">
          <h4>Các mục tiêu cần cố gắng thêm:</h4>
          <ul>
            {incompletable.map((goal) => {
              const amountNeeded = goal.targetAmount - goal.currentAmount;
              return (
                <li key={goal.id}>
                  <strong>{goal.title}</strong>: còn thiếu {formatCurrency(amountNeeded)}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}