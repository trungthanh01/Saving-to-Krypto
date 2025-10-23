import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './SmartSuggestions.css';

export function SmartSuggestions() {
    const { smartSuggestions, handleInitiateGoalCompletion, totalProfitLoss } = useContext(PortfolioContext);

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);

    if (!smartSuggestions || smartSuggestions.completable.length === 0 && smartSuggestions.incompletable.length === 0) {
        return null;
    }

    const {completable, incompletable} = smartSuggestions;


    return (
        <div className="smart-suggestions-container" onClick={handleInitiateGoalCompletion} >
            <h2>✨ Gợi ý Thông minh</h2>
    
            {/* Khu vực mục tiêu có thể hoàn thành */}
            {completable.length > 0 && (
                <div className="suggestions-section completable-section" onClick={(e) => e.stopPropagation()}>
                    <p>
                        Tuyệt vời! Tổng lợi nhuận <strong>{formatCurrency(totalProfitLoss)}</strong> của bạn đã đủ để hoàn thành các mục tiêu sau:
                    </p>
                    <ul>
                        {completable.map(goal => {
                            const amountNeeded = goal.targetAmount - goal.currentAmount;
                            return (
                                <li key={goal.id}>
                                    <span>
                                        <strong>{goal.title}</strong>: chỉ còn thiếu {formatCurrency(amountNeeded)}
                                    </span>
                                    <button onClick={() => handleInitiateGoalCompletion(goal)}>
                                        Hoàn thành ngay
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
    
            {/* Khu vực mục tiêu chưa hoàn thành */}
            {incompletable.length > 0 && (
                <div className="suggestions-section incomplete-section">
                    <h4>Các mục tiêu cần cố gắng thêm:</h4>
                    <ul>
                        {incompletable.map(goal => {
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
    );}


