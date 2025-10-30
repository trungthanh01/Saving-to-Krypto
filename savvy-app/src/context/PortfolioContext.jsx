import { 
    useMemo, 
    useCallback, 
    createContext, 
    useState, 
    useEffect, 
    useContext 
  } from "react";
  import { fetchCoinData } from "../services/crypto-api.js";
  import { AppContext } from "./AppContext.jsx";
  
  export const PortfolioContext = createContext();
  
  export function PortfolioProvider({ children, goals, markGoalAsComplete }) {
    // ─────────────────────────────────────────
    // CONTEXT IMPORTS
    // ─────────────────────────────────────────
    // ✅ Lấy functions từ AppContext
    const { 
      openAddTransactionModal, 
      openConfirmationModal, 
      closeAddTransactionModal 
    } = useContext(AppContext);
  
    // ✅ markGoalAsComplete từ props (từ SavvyContext), không import từ SavvyContext!
  
    // ─────────────────────────────────────────
    // STATE: HOLDINGS & TRANSACTIONS
    // ─────────────────────────────────────────
    const [holdings, setHoldings] = useState([]);
  
    const [transactions, setTransactions] = useState(() => {
      const saved = localStorage.getItem('portfolio-transactions');
      return saved ? JSON.parse(saved) : [];
    });
  
    // ─────────────────────────────────────────
    // STATE: API DATA & LOADING
    // ─────────────────────────────────────────
    const [apiData, setApiData] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // ─────────────────────────────────────────
    // STATE: SMART SUGGESTIONS
    // ─────────────────────────────────────────
    const [smartSuggestions, setSmartSuggestions] = useState(null);
  
    // ─────────────────────────────────────────
    // STATE: GOAL COMPLETION (Temporary)
    // ─────────────────────────────────────────
    const [goalCompletionData, setGoalCompletionData] = useState(null);
  
    // ─────────────────────────────────────────
    // PERSISTENCE: Save transactions to localStorage
    // ─────────────────────────────────────────
    useEffect(() => {
      localStorage.setItem('portfolio-transactions', JSON.stringify(transactions));
    }, [transactions]);
  
    // ─────────────────────────────────────────
    // HANDLER: Add Transaction
    // ─────────────────────────────────────────
    const handleAddTransaction = useCallback((newTransaction) => {
      // 1. Thêm transaction mới
      setTransactions((prev) => [newTransaction, ...prev]);
  
      // 2. Nếu đang hoàn thành mục tiêu, mark it as complete
      if (goalCompletionData) {
        console.log('Completing goal after adding transaction:', goalCompletionData);
        markGoalAsComplete(goalCompletionData.id);
        setGoalCompletionData(null);
      }
  
      // 3. Đóng modal
      closeAddTransactionModal();
    }, [goalCompletionData, markGoalAsComplete, closeAddTransactionModal]);
  
    // ─────────────────────────────────────────
    // HANDLER: Edit Transaction
    // ─────────────────────────────────────────
    const handleEditTransaction = useCallback((updatedTransaction) => {
      console.log("Attempting to edit. Updated data:", updatedTransaction);
  
      setTransactions((prev) => {
        console.log("Old transactions array:", prev);
        const newTransactions = prev.map((t) => {
          if (t.id === updatedTransaction.id) {
            console.log("MATCH FOUND! Replacing old transaction:", t, "with new:", updatedTransaction);
            return updatedTransaction;
          }
          return t;
        });
        console.log("New transactions array:", newTransactions);
        return newTransactions;
      });
  
      // Nếu đang hoàn thành mục tiêu
      if (goalCompletionData) {
        console.log('Completing goal after editing transaction:', goalCompletionData);
        markGoalAsComplete(goalCompletionData.id);
        setGoalCompletionData(null);
      }
  
      // Đóng modal
      closeAddTransactionModal();
    }, [goalCompletionData, markGoalAsComplete, closeAddTransactionModal]);
  
    // ─────────────────────────────────────────
    // HANDLER: Delete Transaction
    // ─────────────────────────────────────────
    const handleDeleteTransaction = useCallback((id) => {
      // ✅ Dùng AppContext.openConfirmationModal
      const onConfirmDelete = () => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      };
  
      openConfirmationModal(
        'Bạn có chắc muốn xóa giao dịch này không?',
        onConfirmDelete
      );
    }, [openConfirmationModal]);

    const handleOpenEditModal = useCallback( (transaction) => {
      openAddTransactionModal('edit', transaction);
    }, [openAddTransactionModal]);
  
    // ─────────────────────────────────────────
    // TASK 15.3: HANDLER: Initiate Goal Completion
    // ─────────────────────────────────────────
    const handleInitiateGoalCompletion = useCallback((goal) => {
      if (!goal) return;
  
      // 1. Ghi nhớ mục tiêu cần hoàn thành
      setGoalCompletionData(goal);
  
      // 2. Tạo transaction template cho bán hàng
      const template = {
        id: null,
        type: 'sell',
        coinId: '', // User sẽ chọn
        amount: '', // User sẽ nhập
        pricePerCoin: '', // User sẽ nhập
        date: new Date().toISOString().split('T')[0],
      };
  
      // 3. ✅ Gọi AppContext để mở modal với template
      openAddTransactionModal('add', template);
  
      console.log('Initiated goal completion for:', goal.title);
    }, [openAddTransactionModal]);
  
    // ─────────────────────────────────────────
    // DERIVED: Calculate holdings từ transactions
    // ─────────────────────────────────────────
    useEffect(() => {
      // Group transactions by coin
      const transactionsByCoin = transactions.reduce((acc, transaction) => {
        const { coinId } = transaction;
        if (!acc[coinId]) {
          acc[coinId] = [];
        }
        acc[coinId].push(transaction);
        return acc;
      }, {});
  
      console.log(transactionsByCoin, 'transactionsByCoin');
  
      // Calculate holdings for each coin
      const calculatedHoldings = Object.keys(transactionsByCoin).map((coinId) => {
        const coinTransactions = transactionsByCoin[coinId];
  
        const buys = coinTransactions.filter((t) => t.type === 'buy');
        const sells = coinTransactions.filter((t) => t.type === 'sell');
  
        const totalAmountBought = buys.reduce((sum, t) => sum + t.amount, 0);
        const totalCostOfBuys = buys.reduce((sum, t) => sum + t.amount * (t.pricePerCoin || 0), 0);
        const totalAmountSold = sells.reduce((sum, t) => sum + t.amount, 0);
  
        const remainingAmount = totalAmountBought - totalAmountSold;
        const averageBuyPrice = totalAmountBought > 0 ? totalCostOfBuys / totalAmountBought : 0;
        const costBasis = remainingAmount * averageBuyPrice;
  
        return {
          id: coinId,
          amount: remainingAmount,
          costBasis: costBasis,
          averageBuyPrice: averageBuyPrice,
        };
      });
  
      // Lọc out những holding có amount quá nhỏ
      const newHoldingsArray = calculatedHoldings.filter(
        (holding) => holding.amount > 0.000001
      );
  
      setHoldings(newHoldingsArray);
    }, [transactions]);
  
    // ─────────────────────────────────────────
    // SIDE EFFECT: Fetch API data for holdings
    // ─────────────────────────────────────────
    useEffect(() => {
      const getApiData = async () => {
        if (holdings.length === 0) {
          setApiData({});
          setIsLoading(false);
          return;
        }
  
        try {
          setIsLoading(true);
          setError(null);
  
          const ids = holdings.map((coin) => coin.id);
          const marketData = await fetchCoinData(ids);
  
          // Chuyển array thành object để dễ lookup
          const apiDataAsObject = marketData.reduce((acc, coin) => {
            acc[coin.id] = coin;
            return acc;
          }, {});
  
          setApiData(apiDataAsObject);
        } catch (err) {
          setError('Có lỗi xảy ra, không thể tải dữ liệu danh mục.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
  
      getApiData();
  
      // Refresh every 20 minutes (1200000 ms)
      const interval = setInterval(getApiData, 1200000);
      return () => clearInterval(interval);
    }, [holdings]);
  
    // ─────────────────────────────────────────
    // DERIVED: Enrich holdings with market data
    // ─────────────────────────────────────────
    const portfolioData = useMemo(() => {
      if (holdings.length === 0 || Object.keys(apiData).length === 0) {
        return [];
      }
  
      return holdings
        .map((holding) => {
          const coinData = apiData[holding.id];
          if (!coinData) return null;
  
          const currentValue = holding.amount * coinData.current_price;
          const profitLoss = currentValue - holding.costBasis;
  
          return {
            ...holding,
            ...coinData,
            currentValue: currentValue,
            profitLoss: profitLoss,
          };
        })
        .filter(Boolean);
    }, [holdings, apiData]);
  
    // ─────────────────────────────────────────
    // DERIVED: Calculate portfolio statistics
    // ─────────────────────────────────────────
    const totalCostBasis = useMemo(
      () => portfolioData.reduce((total, coin) => total + (coin.costBasis || 0), 0),
      [portfolioData]
    );
  
    const portfolioTotalValue = useMemo(
      () => portfolioData.reduce((total, coin) => total + coin.currentValue, 0),
      [portfolioData]
    );
  
    const totalProfitLoss = useMemo(
      () => portfolioTotalValue - totalCostBasis,
      [portfolioTotalValue, totalCostBasis]
    );
  
    console.log('totalProfitLoss', totalProfitLoss);
  
    const total24hChangeValue = useMemo(
      () =>
        portfolioData.reduce((total, coin) => {
          const priceChange = coin.price_change_24h || 0;
          return total + priceChange * coin.amount;
        }, 0),
      [portfolioData]
    );
  
    const portfolioValueYesterday = portfolioTotalValue - total24hChangeValue;
  
    const totalChangePercentage = useMemo(
      () =>
        portfolioValueYesterday !== 0
          ? (total24hChangeValue / portfolioValueYesterday) * 100
          : 0,
      [portfolioValueYesterday, total24hChangeValue]
    );
  
    // ─────────────────────────────────────────
    // SIDE EFFECT: Create smart suggestions
    // ─────────────────────────────────────────
    useEffect(() => {
      if (!goals || goals.length === 0) {
        setSmartSuggestions(null);
        return;
      }
  
      // Lọc mục tiêu có thể hoàn thành
      const completableGoals = goals.filter((goal) => {
        const amountNeeded = goal.targetAmount - goal.currentAmount;
        return totalProfitLoss >= amountNeeded;
      });
  
      // Lọc mục tiêu chưa thể hoàn thành
      const incompletableGoals = goals.filter((goal) => {
        const amountNeeded = goal.targetAmount - goal.currentAmount;
        return totalProfitLoss < amountNeeded;
      });
  
      console.log(completableGoals, 'completable');
      console.log(incompletableGoals, 'incompletable');
  
      setSmartSuggestions({
        completable: completableGoals,
        incompletable: incompletableGoals,
      });
  
      console.log('Generated smart suggestions:', completableGoals, incompletableGoals);
    }, [goals, totalProfitLoss]);
  
    // ─────────────────────────────────────────
    // CONTEXT VALUE
    // ─────────────────────────────────────────
    const value = useMemo(
      () => ({
        // Holdings & Transactions
        holdings,
        transactions,
        portfolioData,
  
        // Loading & Error
        isLoading,
        error,
  
        // Smart Suggestions
        smartSuggestions,
  
        // Transaction Functions
        addTransaction: handleAddTransaction,
        editTransaction: handleEditTransaction,
        deleteTransaction: handleDeleteTransaction,
        handleOpenEditModal,
  
        // Goal Completion
        handleInitiateGoalCompletion,
        markGoalAsComplete, // ✅ từ props
  
        // Portfolio Statistics
        portfolioTotalValue,
        totalCostBasis,
        totalProfitLoss,
        total24hChangeValue,
        totalChangePercentage,
      }),
      [
        holdings,
        transactions,
        portfolioData,
        isLoading,
        error,
        smartSuggestions,
        handleAddTransaction,
        handleEditTransaction,
        handleDeleteTransaction,
        handleOpenEditModal,
        handleInitiateGoalCompletion,
        markGoalAsComplete,
        portfolioTotalValue,
        totalCostBasis,
        totalProfitLoss,
        total24hChangeValue,
        totalChangePercentage,
      ]
    );
  
    console.log('PortfolioContext value:', value);
  
    return (
      <PortfolioContext.Provider value={value}>
        {children}
      </PortfolioContext.Provider>
    );
  }