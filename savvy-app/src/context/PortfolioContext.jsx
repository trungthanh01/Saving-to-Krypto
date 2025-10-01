import { createContext, useState, useEffect } from "react";
import { fetchCoinData } from "../services/crypto-api.js"; // Sửa đường dẫn
export const PortfolioContext = createContext();

export function PortfolioProvider({ children, setGoalMessage }) { // 1. Nhận setGoalMessage
  // --- Bước 1: Di chuyển state và logic xử lý lên trên cùng ---
  const [holdings, setHoldings] = useState(() => {
    const savedHoldings = localStorage.getItem('portfolio-holdings');
    return savedHoldings ? JSON.parse(savedHoldings) : [];
  });

  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('portfolio-transactions'); // Sửa lại key cho đúng
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  })

  const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);

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
    const newTransaction = {
      id: 't_' + new Date().getTime(),
      coinId: newHolding.id,
      amount: newHolding.amount,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);

    // 3. Gọi hàm setGoalMessage từ props
    setGoalMessage(`Đã thêm ${newHolding.amount} ${newHolding.id.toUpperCase()}!`);
  }


  function handleDeleteTransaction(transactionIdToDelete) {
    const userConfirmed = window.confirm(
      "Bạn có chắc muốn xóa giao dịch này không? Hành động này sẽ hoàn trả lại số coin vào danh mục của bạn."
    );
    if (!userConfirmed) {
      return;
    }
    
    const transactionToDelete = transactions.find(
      (transaction) => transaction.id === transactionIdToDelete
    );
    
    if (!transactionToDelete) {
      console.error("Không tìm thấy giao dịch để xóa!");
      return;
    }

    setHoldings(prevHoldings => {
      const updatedHoldings = prevHoldings.map(holding => {
        if (holding.id === transactionToDelete.coinId) {
          return { ...holding, amount: holding.amount - transactionToDelete.amount };
        }
        return holding;
      });
      return updatedHoldings.filter(holding => holding.amount > 0.000001); // Thêm ngưỡng nhỏ để tránh lỗi float
    });

    const newTransactions = transactions.filter(
      (transaction) => transaction.id !== transactionIdToDelete
    );
    setTransactions(newTransactions);
  }

  function handleOpenAddHoldingModal() {
    setIsAddHoldingModalOpen(true);
  }
  function handleCloseAddHoldingModal() {
    setIsAddHoldingModalOpen(false);
  }


  useEffect( () => {
    localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
    console.log('Danh mục holdings đã được lưu vào local storage!')
  },[holdings])

  // Thêm useEffect để lưu transactions
  useEffect(() => {
    localStorage.setItem('portfolio-transactions', JSON.stringify(transactions));
    console.log('Lịch sử giao dịch đã được lưu vào local storage!');
  }, [transactions]);


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
  }, [holdings]); 


  // --- Bước 4: Cập nhật lại `value` để chia sẻ tất cả dữ liệu ---
  const value = {
    holdings, // Dữ liệu gốc
    addHolding: handleAddHolding, // Hàm để thêm coin
    deleteTransaction: handleDeleteTransaction, // Thêm hàm xóa
    isAddHoldingModalOpen, // Thêm state modal
    openAddHoldingModal: handleOpenAddHoldingModal, // Thêm hàm mở
    closeAddHoldingModal: handleCloseAddHoldingModal, // Thêm hàm đóng
    portfolioData, // Dữ liệu đã kết hợp để hiển thị
    isLoading, // Trạng thái loading
    error, // Trạng thái lỗi
    transactions, // Chia sẻ transactions
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}