import { createContext, useState, useEffect } from "react";
import { fetchCoinData } from "../services/crypto-api.js"; // Sửa đường dẫn
export const PortfolioContext = createContext();

export function PortfolioProvider({ children, setGoalMessage }) { // 1. Nhận setGoalMessage
  // --- Bước 1: Di chuyển state và logic xử lý lên trên cùng ---
  const [holdings, setHoldings] = useState([
    { id: 'bitcoin', amount: 0.5 },
    { id: 'ethereum', amount: 10 },
    { id: 'chainlink', amount: 150 },
  ]);

  function handleAddHolding(newHolding) {
    console.log('Context đã nhận được holding mới:', newHolding);
    setHoldings(prevHoldings => {
      const existingHolding = prevHoldings.find(h => h.id === newHolding.id);
      if (existingHolding) {
        console.log('Coin đã tồn tại. Cập nhật số lượng trong Context.');
        return prevHoldings.map(h =>
          h.id === newHolding.id
            ? { ...h, amount: h.amount + newHolding.amount }
            : h
        );
      } else {
        console.log('Coin mới. Thêm vào danh mục trong Context.');
        return [newHolding, ...prevHoldings];
      }
    });
    // 2. Gọi hàm setGoalMessage từ props
    setGoalMessage(`Đã thêm ${newHolding.amount} ${newHolding.id.toUpperCase()}!`);
  }

  // --- Bước 2: State cho dữ liệu được gọi từ API ---
  const [portfolioData, setPortfolioData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPortfolioData = async () => {
      if (holdings.length === 0) {
        setPortfolioData([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const ids = holdings.map(coin => coin.id);
        const marketData = await fetchCoinData(ids);

        const combinedData = marketData.map(marketCoin => {
          const holding = holdings.find(h => h.id === marketCoin.id);
          return {
            ...marketCoin, // Dữ liệu từ API (giá, ảnh, tên...)
            amount: holding ? holding.amount : 0, // Số lượng từ state
          };
        });

        setPortfolioData(combinedData);
        
      } catch (err) {
        setError("Có lỗi xảy ra, không thể tải dữ liệu danh mục.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPortfolioData();
  }, [holdings]); // Effect này sẽ chạy lại mỗi khi `holdings` thay đổi


  // --- Bước 4: Cập nhật lại `value` để chia sẻ tất cả dữ liệu ---
  const value = {
    holdings, // Dữ liệu gốc
    addHolding: handleAddHolding, // Hàm để thêm coin
    portfolioData, // Dữ liệu đã kết hợp để hiển thị
    isLoading, // Trạng thái loading
    error, // Trạng thái lỗi
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}