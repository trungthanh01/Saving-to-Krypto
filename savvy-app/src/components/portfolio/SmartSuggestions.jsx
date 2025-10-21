import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './SmartSuggestions.css';

export function SmartSuggestions() {
    const { smartSuggestions, handleInitiateGoalCompletion } = useContext(PortfolioContext);

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);

    if (!smartSuggestions) {
        return null;
    }

    const s = smartSuggestions;
    const canCompleteGoals = s.totalProfitLoss >= s.totalAmountNeeded;

    return (
        <div className="smart-suggestions">
            <h2 className="suggestions-title">✨ Gợi ý Tổng hợp</h2>
            <div className="suggestion-card">
                <p>
                    Tổng lợi nhuận của bạn là <strong>{formatCurrency(s.totalProfitLoss)}</strong>.
                    {canCompleteGoals 
                        ? " Điều này đã đủ để hoàn thành các mục tiêu sau:"
                        : " Bạn có thể bắt đầu hoàn thành các mục tiêu sau:"
                    }
                </p>

                <ul className="goal-list">
                    {s.achievableGoals.map((goal) => (
                        <li key={goal.name}>
                            <strong>{goal.name}:</strong> còn thiếu {formatCurrency(goal.amountNeeded)}
                        </li>
                    ))}
                </ul>

                {canCompleteGoals && (
                    <div className="action-summary">
                        <p>
                            Nếu bạn chốt lời <strong>{formatCurrency(s.totalAmountNeeded)}</strong> 
                            ({s.percentageNeeded.toFixed(2)}% lợi nhuận), bạn sẽ hoàn thành {s.achievableGoals.length} mục tiêu và vẫn còn lại <strong>{formatCurrency(s.remainingProfit)}</strong> tiền lời.
                        </p>
                        <button 
                            className="suggestion-action"
                            onClick={() => handleInitiateGoalCompletion(s)}
                        >
                            Chốt lời để hoàn thành mục tiêu
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


