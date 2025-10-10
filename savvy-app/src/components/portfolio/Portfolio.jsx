import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AddTransactionForm } from "./AddTransactionForm.jsx";
import { AddButton } from "../savvy/AddButton.jsx";
import { HoldingItem } from "./HoldingItem.jsx";
import './portfolio-table.css';
import './Portfolio.css';

export function Portfolio() {
    const { 
        portfolioData, 
        isLoading, 
        error, 
        openAddHoldingModal,
        isAddHoldingModalOpen,
        closeModal,
        editingTransaction, // LẤY STATE VỚI TÊN MỚI
    } = useContext(PortfolioContext);


    if (isLoading) {
        return <p>Đang tải dữ liệu portfolio...</p>;
    }
    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    return (
        <section className="portfolio-section">
            <div className="portfolio-header">
                <h2>Danh mục Đầu tư Crypto</h2>
                <AddButton onClick={openAddHoldingModal}>Thêm Giao Dịch</AddButton>
            </div>

            <AddTransactionForm 
                isOpen={isAddHoldingModalOpen}
                onClose={closeModal}
                transactionToEdit={editingTransaction} // TRUYỀN PROP VỚI TÊN MỚI
            />
            
            {(!portfolioData || portfolioData.length === 0) ? (
                <p>Danh mục đầu tư của bạn trống.</p>
            ) : (
                <div className="table-container">
                    <table className="portfolio-table">
                        <thead>
                            <tr>
                                <th>Tên Coin</th>
                                <th>Giá</th>
                                <th>24h %</th>
                                <th>Số lượng</th>
                                <th>Giá trị</th>
                                <th>Vốn</th>
                                <th>Giá TB</th>
                                <th>Lời/Lỗ</th>
                            </tr>
                        </thead>
                        <tbody>
                            {portfolioData.map(coin => (
                                <HoldingItem key={coin.id} coin={coin}/>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}