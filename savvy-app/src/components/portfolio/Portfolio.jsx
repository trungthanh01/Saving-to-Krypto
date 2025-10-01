import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './Portfolio.css';
import { AddHoldingForm } from "./AddHoldingForm.jsx";
import { AddButton } from "../savvy/AddButton.jsx"; // Import nút bấm


export function Portfolio() {
    // Bước 1: Dùng useContext để "đọc" dữ liệu đã được xử lý từ "tấm bảng" Context
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
    
    if (!portfolioData || portfolioData.length === 0) {
        return (
            <section className="portfolio-section">
                <h2>Danh mục Đầu tư Crypto</h2>
                <p>Danh mục đầu tư của bạn trống.</p>
            </section>
        )
    }

    // Bước 4: Cập nhật JSX để sử dụng `portfolioData`
    // Dữ liệu trong `portfolioData` đã bao gồm cả `amount` nên ta có thể dùng trực tiếp
    return (
        <section className="portfolio-section">
            <h2>Danh mục Đầu tư Crypto</h2>
            <AddButton onClick={openAddHoldingModal}>Thêm Giao Dịch</AddButton>
            <AddHoldingForm 
                isOpen={isAddHoldingModalOpen}
                onClose={closeAddHoldingModal}
            />
            <div className="portfolio-list">
                {portfolioData.map((coin) => {
                    const totalValue = coin.amount * coin.current_price;
                    
                    return (
                        <div key={coin.id} className="portfolio-item">
                            <img src={coin.image} alt={coin.name} className="coin-image" />
                            <div className="coin-info">
                                <span className="coin-name">{coin.name} ({coin.symbol.toUpperCase()})</span>
                                <span className="coin-price">
                                    ${coin.current_price.toLocaleString()}
                                </span>
                            </div>
                            <div className="coin-holdings">
                                <span className="coin-value">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className="coin-amount">{coin.amount} {coin.symbol.toUpperCase()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}