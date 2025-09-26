import { useContext } from "react";
// Xóa bỏ import fetchCoinData, component này không gọi API nữa
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './Portfolio.css';

export function Portfolio() {
    // Bước 1: Dùng useContext để "đọc" dữ liệu đã được xử lý từ "tấm bảng" Context
    const { portfolioData, isLoading, error } = useContext(PortfolioContext);

    // Bước 2: Giữ nguyên logic render cho các trạng thái loading, error
    if (isLoading) {
        return <p>Đang tải dữ liệu portfolio...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    // Bước 3: Giữ nguyên logic render cho trường hợp danh mục trống
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