import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import {useNavigate} from 'react-router-dom';
import './SmartSuggestions.css';
import { AppContext } from "../../context/AppContext.jsx";

export function SmartSuggestions() {
    const { smartSuggestions, handleInitiateGoalCompletion, totalProfitLoss } = useContext(PortfolioContext);
    const {openAddTransactionModal}= useContext(AppContext)
    const navigate = useNavigate();
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);

    if (!smartSuggestions || smartSuggestions.completable.length === 0 && smartSuggestions.incompletable.length === 0) {
        return null;
    }
    const handleCompleteGoalClick = (goal) => {
        const transactionTemplate = {
            id: null, // Đây là giao dịch mới, chưa có id
            type: 'sell', // Luôn là 'bán'
            coinId: '', // Lấy coinId từ mục tiêu
            amount: '', // Lấy số lượng cần bán
            pricePerCoin: '', // Để trống cho người dùng nhập
            date: new Date().toISOString().split('T')[0],
        };
        openAddTransactionModal(transactionTemplate) 
        navigate('/');
    }

    const {completable, incompletable} = smartSuggestions;
    let totalAmountNeeded = 0;
    let percentageOfProfit = 0;
    let remainingProfit = 0;
    
    if (completable.length > 0) {
        //total amount of goal
        totalAmountNeeded = completable.reduce( (sum, goal) => {
            return sum + (goal.targetAmount - goal.currentAmount);
        }, 0)
        //calculate percentage
        percentageOfProfit = totalProfitLoss > 0 
            ? (totalAmountNeeded / totalProfitLoss) * 100 : 0
        ;
    
        remainingProfit = totalProfitLoss - totalAmountNeeded;
    }


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


