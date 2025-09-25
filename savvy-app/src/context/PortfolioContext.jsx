import { createContext, useState } from "react";
// Bỏ import useEffect và fetchCoinData vì chúng sẽ được chuyển đi
// import { fetchCoinData } from "../services/crypto-api";

// "Chế tạo" cái bảng
export const PortfolioContext = createContext();

// "Component Bảng thông báo"
// Sửa lỗi 1: Đổi tên thành PortfolioProvider và sửa 'childen' -> 'children'
export function PortfolioProvider({ children }) {

  // Sửa lỗi 2: Chỉ giữ lại state và logic liên quan đến Portfolio
  const [holdings, setHoldings] = useState([
    { id: 'bitcoin', amount: 0.5 },
    { id: 'ethereum', amount: 10 },
    { id: 'chainlink', amount: 150 },
  ]);

  // --- DI CHUYỂN HÀM LOGIC TỪ APP.JSX VÀO ĐÂY ---
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
  }
  
  // "Viết" những thứ cần chia sẻ lên bảng.
  // Bất kỳ component con nào cũng có thể truy cập 2 thứ này.
  const value = {
    holdings,
    addHolding: handleAddHolding, // Chia sẻ hàm để các component khác có thể gọi
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}