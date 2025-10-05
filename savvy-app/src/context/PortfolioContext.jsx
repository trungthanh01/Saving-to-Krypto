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

  async function handleAddTransaction(transactionData) {

    try {
      const marketData = await fetchCoinData([transactionData.coinId]);

      if(!marketData || marketData.length === 0) {
        throw new Error(`Không thể tìm thấy dữ liệu cho coin: ${transactionData.coinId}`)
      }
      const current_price = marketData[0].current_price;
      console.log('Context đã nhận được holding mới:', transactionData);
      const existingHolding = holdings.find(h => h.id === transactionData.coinId);
      if(transactionData.type === 'sell' && existingHolding && transactionData.amount > existingHolding.amount) {
        throw new Error(`Số lượng bán vượt quá số lượng hiện có: ${existingHolding.amount}`);
        return;
      }
      if(transactionData.type === 'sell' && !existingHolding) {
        throw new Error(`Coin không tồn tại trong danh mục: ${transactionData.coinId}`);
        return;
      }
      
      setHoldings(prevHoldings => {
        if (existingHolding) {
          console.log('Coin đã tồn tại. Cập nhật số lượng trong Context.');
          return prevHoldings.map(h => {
            if(h.id === transactionData.coinId) {
              const newAmount = transactionData.type === 'buy' 
                ? h.amount + transactionData.amount 
                : h.amount - transactionData.amount;
              return { ...h, amount: newAmount };
            } else {
              return h;
            }
          });
        } 
        else {
          console.log('Coin mới. Thêm vào danh mục trong Context.');
          return [{
            id: transactionData.coinId, 
            amount: transactionData.amount}, 
            ...prevHoldings
          ];
        }
      });
      
     
      const newTransaction = {
        id: 't_' + new Date().getTime(),
        coinId:transactionData.coinId,
        amount: transactionData.amount,
        type: 'buy',
        pricePerCoin: current_price,
        date: new Date().toISOString().split('T')[0],
      };
      setTransactions(prevTransactions => [newTransaction, ...prevTransactions]);
      setGoalMessage(`Đã thêm ${transactionData.amount} ${transactionData.coinId.toUpperCase()}!`);      
    } catch (error) {
      console.error("Lỗi khi thêm giao dịch:", error)
      alert(error.message)
    }
  }
//------------------------

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

  const portfolioTotalValue = portfolioData.reduce((total, coin) => {
    const coinValue = coin.amount * coin.current_price;
    return total + coinValue;
  }, 0);

  const totalCostBasis = transactions.reduce((total, transaction) => {
    if(transaction.purchasePrice) {
      const transactionValue = transaction.amount * transaction.purchasePrice
      return total + transactionValue
    }
    return total;
  }, 0)

  const totalProfitLoss = totalCostBasis > 0 
    ? portfolioTotalValue - totalCostBasis 
    : 0
  ;
  
  const total24hChangeValue = portfolioData.reduce((total, coin) => {
    if(coin.price_change_24h){
      const coin24hChange = coin.amount * coin.price_change_24h;
      return total + coin24hChange;
    }
    return total;
  }, 0)

  const portfolioValueYesterday = portfolioTotalValue - total24hChangeValue;

  const totalChangePercentage = portfolioValueYesterday !== 0 
    ? (total24hChangeValue / portfolioValueYesterday)*100 
    : 0
  ;
  
  const value = {
    holdings, 
    addTransaction: handleAddTransaction, 
    deleteTransaction: handleDeleteTransaction, 
    isAddHoldingModalOpen, 
    openAddHoldingModal: handleOpenAddHoldingModal, 
    closeAddHoldingModal: handleCloseAddHoldingModal, 
    portfolioData, 
    isLoading, 
    error, 
    transactions,
    portfolioTotalValue,
    totalCostBasis,
    totalProfitLoss,
    total24hChangeValue,
    totalChangePercentage,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  )
}