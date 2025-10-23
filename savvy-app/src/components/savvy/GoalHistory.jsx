import { useContext } from "react";
import { SavvyContext } from "../../context/SavvyContext.jsx";
import './GoalHistory.css';

export function GoalHistory() {
    const { completedGoals, handleDeleteCompletedGoal } = useContext(SavvyContext);

    return (
        <section className="goal-history">
            <h3>🏆 Lịch sử hoàn thành</h3>
            {completedGoals.length === 0 ? (
                <p className="empty-history">Chưa có mục tiêu nào được hoàn thành. Hãy tiếp tục cố gắng nhé!</p>
            ) : (
                <ul className="history-list">
                    {completedGoals.map(goal => (
                        <li key={goal.id} className="history-item">
                            <span className="history-item-title">{goal.title}</span>
                            <span className="history-item-amount">{
                                new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(goal.targetAmount)
                            }</span>
                            <button 
                                className="deleteButton"
                                onClick={() => handleDeleteCompletedGoal(goal.id) } >
                                    &times;</button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}