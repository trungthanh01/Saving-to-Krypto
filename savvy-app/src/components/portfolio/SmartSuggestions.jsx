import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './SmartSuggestions.css';

export function SmartSuggestions() {
    // Lấy `smartSuggestions` (giờ là object) và `openEditModal`
    const { smartSuggestions, handleInitiateGoalCompletion } = useContext(PortfolioContext);

    // Hàm format tiền tệ tiện ích
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);

    // B1: Điều kiện kiểm tra mới. Nếu `smartSuggestions` là null (hoặc falsy), không render gì cả.
    if (!smartSuggestions) {
        return null;
    }

    // B2: Truy cập trực tiếp vào các thuộc tính của object.
    // Đổi tên `suggestion` thành `s` để tránh nhầm lẫn.
    const s = smartSuggestions;
    
    // Chỉ hiển thị gợi ý nếu tổng số tiền cần bán nhỏ hơn hoặc bằng lợi nhuận
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

                {/* B3: Lặp qua mảng `achievableGoals` bên trong object */}
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


