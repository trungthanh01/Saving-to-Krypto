import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './TransactionHistory.css';

export function TransactionHistory() {
    const { 
        transactions, 
        deleteTransaction, 
        openEditModal, 
    } = useContext(PortfolioContext);

    if (transactions.length === 0) {
        return (
            <div className="transaction-history empty-state">
                <h4>Lịch Sử Giao Dịch</h4>
                <p>Bạn chưa có giao dịch nào.</p>
            </div>
        );
    }

    const formatCurrency = (number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(number);
    };

    const formatNumber = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6,
        }).format(number);
    };

    return (
        <div className="transaction-history">
            <h4>Lịch Sử Giao Dịch</h4>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Ngày</th>
                            <th>Coin</th>
                            <th>Loại</th>
                            <th className="align-right">Số lượng</th>
                            <th className="align-right">Giá</th>
                            <th className="align-center">Sửa</th>
                            <th className="align-center">Xóa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map(transaction => (
                            <tr key={transaction.id}>
                                <td>{transaction.date}</td>
                                <td className="coin-name">{transaction.coinId.toUpperCase()}</td>
                                <td className={`type ${transaction.type === 'buy' ? 'type-buy' : 'type-sell'}`}>
                                    {transaction.type}
                                </td>
                                <td className="align-right">{formatNumber(transaction.amount)}</td>
                                <td className="align-right">{formatCurrency(transaction.pricePerCoin)}</td>
                                <td className="align-center">
                                    <button className="edit-btn" onClick={() => openEditModal(transaction)}>
                                    ✏️
                                    </button>
                                </td>
                                <td className="align-center">
                                    <button className="delete-btn" onClick={() => deleteTransaction(transaction.id)}>
                                        &times;
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}