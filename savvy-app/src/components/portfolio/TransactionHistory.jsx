import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx"; // Thêm .jsx cho rõ ràng
import './TransactionHistory.css'; // Import file css

export function TransactionHistory() {
    const { transactions } = useContext(PortfolioContext);
    console.log('Dữ liệu transactions', transactions);

    // Xử lý trường hợp không có giao dịch
    if (!transactions || transactions.length === 0) {
        return (
            <div className="transaction-history">
                <h3>Lịch Sử Giao Dịch</h3>
                <p>Chưa có giao dịch nào.</p>
            </div>
        );
    }

    return (
        <div className="transaction-history">
            <h3>Lịch Sử Giao Dịch</h3>
            <ul>
            {transactions.map(transaction => (
                <li key={transaction.id}>
                    <span className="date">{transaction.date}</span>
                    <span className="details">
                        {transaction.amount} {transaction.coinId.toUpperCase()}
                    </span>
                </li>
            ))}
            </ul>
        </div>
    );
}