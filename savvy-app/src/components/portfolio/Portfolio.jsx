import { useEffect, useState, useContext } from "react";
import { fetchCoinData } from "../../services/crypto-api.js";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './Portfolio.css';

export function Portfolio() {
    const {holdings} = useContext(PortfolioContext)
    const [marketData, setMarketData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Reset state trước mỗi lần chạy để đảm bảo sự nhất quán
                setIsLoading(true);
                setError(null);
                
                const ids = holdings.map(coin => coin.id);

                // Sửa logic kiểm tra mảng rỗng: if(!ids === 0) -> if(ids.length === 0)
                if (ids.length === 0) {
                    setMarketData([]); // Nếu không có holdings, đặt marketData là mảng rỗng
                    setIsLoading(false); // Và dừng loading
                    return;
                }
                
                const data = await fetchCoinData(ids);
                setMarketData(data);

            } catch (err) { // Luôn đặt tên cho biến lỗi, ví dụ 'err' hoặc 'error'
                // Sửa logic xử lý lỗi: Xóa dòng setError(false) thừa
                setError("Có lỗi xảy ra, không thể tải dữ liệu.");
            } finally {
                // Bổ sung finally: Rất quan trọng!
                // Luôn set isLoading thành false sau khi try/catch hoàn tất.
                setIsLoading(false);
            }
        };

        loadData();

    }, [holdings]); // Giữ nguyên dependency, rất chính xác!

    if (isLoading) {
        return <p>Đang tải dữ liệu portfolio...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }
    
    // Thêm logic hiển thị cho trường hợp không có coin nào
    if (holdings.length === 0) {
        return (
            <section className="portfolio-section">
                <h2>Danh mục Đầu tư Crypto</h2>
                <p>Danh mục đầu tư của bạn trống.</p>
            </section>
        )
    }

    // Đây là logic hiển thị hoàn chỉnh (Bước 6)
    return (
        <section className="portfolio-section">
            <h2>Danh mục Đầu tư Crypto</h2>
            <div className="portfolio-list">
                {marketData.map((coinData) => {
                    // Tìm holding tương ứng để lấy số lượng
                    const holding = holdings.find(h => h.id === coinData.id);
                    // Nếu không tìm thấy (trường hợp hiếm), không hiển thị gì cả
                    if (!holding) return null;

                    const amount = holding.amount;
                    const totalValue = amount * coinData.current_price;

                    return (
                        <div key={coinData.id} className="portfolio-item">
                            <img src={coinData.image} alt={coinData.name} className="coin-image" />
                            <div className="coin-info">
                                <span className="coin-name">{coinData.name} ({coinData.symbol.toUpperCase()})</span>
                                <span className="coin-price">
                                    ${coinData.current_price.toLocaleString()}
                                </span>
                            </div>
                            <div className="coin-holdings">
                                <span className="coin-value">${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                                <span className="coin-amount">{amount} {coinData.symbol.toUpperCase()}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}