import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './SmartSuggestions.css';

export function SmartSuggestions() {
    // THÊM `openEditModal` VÀO ĐÂY
    const { smartSuggestions, openEditModal } = useContext(PortfolioContext);

    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);

    if (!smartSuggestions || !smartSuggestions.length) return null;

    return (
        <div className="smart-suggestions">
            <h2 className="suggestions-title">✨ Các mục tiêu đã đạt được</h2>
            {smartSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="suggestion-card">
                    <p>
                        🎉 Lợi nhuận từ 
                        <strong>{suggestion.coinName}</strong> ({formatCurrency(suggestion.profitAvailable)}) của bạn đã đủ để hoàn thành mục tiêu <strong>'{suggestion.goalName}'</strong> (còn thiếu {formatCurrency(suggestion.amountNeeded)}).
                    </p>
                    <button 
                        className="suggestion-action" 
                        onClick={() => openEditModal({ 
                            coinId: suggestion.coinId, 
                            type: 'sell',
                            amount: '',
                            pricePerCoin: ''
                        })}
                    >
                        Chốt lời ngay
                    </button>
                </div>
            ))}
        </div>
    );
}


