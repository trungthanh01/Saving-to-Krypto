import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './Portfolio.css';
import { AddHoldingForm } from "./AddHoldingForm.jsx";
import { AddButton } from "../savvy/AddButton.jsx";
import { HoldingItem } from "./HoldingItem.jsx";
import './portfolio-table.css';

export function Portfolio() {
    const { 
        portfolioData, 
        isLoading, 
        error, 
        openAddHoldingModal,
        isAddHoldingModalOpen,
        closeAddHoldingModal
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

            <AddHoldingForm 
                isOpen={isAddHoldingModalOpen}
                onClose={closeAddHoldingModal}
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