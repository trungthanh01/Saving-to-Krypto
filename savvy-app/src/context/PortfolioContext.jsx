import { useMemo, useCallback, createContext, useState, useEffect, useRef, useContext } from "react";
import { fetchCoinData, fetchCoinList } from "../services/crypto-api.js";
import { SavvyContext } from "./SavvyContext.jsx";
export const PortfolioContext = createContext();

const message = {
  deleteTransaction: 'Bạn có chắc muốn xóa giao dịch này không?',
};

export function PortfolioProvider({ children, goals }) {
    console.log("PortfolioProvider received goals:", goals);
    const [holdings, setHoldings] = useState(() => {
        const saved = localStorage.getItem('portfolio-holdings');
        return saved ? JSON.parse(saved) : [];
    });

    const [transactions, setTransactions] = useState(() => {
        const saved = localStorage.getItem('portfolio-transactions');
        return saved ? JSON.parse(saved) : [];
    });

    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {},
    });
    const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);
    const [coinList, setCoinList] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const apiCallGuard = useRef(false);
    const [apiData, setApiData] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [smartSuggestions, setSmartSuggestions] = useState(null);
    const [goalCompletionData, setGoalCompletionData] = useState(null);
    const { markGoalAsComplete } = useContext(SavvyContext);
    // --- 2. HANDLER FUNCTIONS (useCallback) ---
    const handleAddTransaction = useCallback((newTransaction) => {
        setTransactions(prev => [newTransaction, ...prev]);
        if(goalCompletionData){
            console.log('Comleting goals after adding transaction:', goalCompletionData.goalToComplete);
            goalCompletionData.goalToComplete.forEach(goal => {
                markGoalAsComplete(goal.id);
            });
        }
        setGoalCompletionData(null);
    }, [goalCompletionData, markGoalAsComplete]);

    const handleEditTransaction = useCallback((updatedTransaction) => {
        console.log("Attempting to edit. Updated data:", updatedTransaction);

        setTransactions(prev => {
            console.log("Old transactions array:", prev);
            const newTransactions = prev.map(t => {
                if (t.id === updatedTransaction.id) {
                    console.log("MATCH FOUND! Replacing old transaction:", t, "with new:", updatedTransaction);
                    return updatedTransaction;
                }
                return t;
            });
            console.log("New transactions array:", newTransactions);
            return newTransactions;
        });
        if(goalCompletionData){
            console.log('Comleting goals after editing transaction:', goalCompletionData.goalToComplete);
            goalCompletionData.goalToComplete.forEach(goal => {
                markGoalAsComplete(goal.id);
            });
        }
        setGoalCompletionData(null);
    }, [goalCompletionData, markGoalAsComplete]);

    const handleOpenConfirmationModal = useCallback(() => {
        setConfirmationModal({
            isOpen: true,
            message: message.deleteTransaction,
            onConfirm: () => {},
        });
    }, []);

    const handleDeleteTransaction = useCallback(async (id) => {
        setTransactions(prev => prev.filter(t => t.id !== id));
    }, []);

    const handleCloseConfirmationModal = useCallback(() => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const handleOpenAddHoldingModal = useCallback(() => {
        setIsAddHoldingModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsAddHoldingModalOpen(false);
        setEditingTransaction(null); // Reset cả state edit khi đóng
    }, []);

    const handleOpenEditModal = useCallback((transaction) => {
        console.log("0. openEditModal called with:", transaction);
        setEditingTransaction(transaction);
        handleOpenAddHoldingModal();
    }, [handleOpenAddHoldingModal]);


    const handleInitiateGoalCompletion = useCallback((suggestion) => {
        if(!suggestion) return;
        setGoalCompletionData({
            goalToComplete: suggestion.achievableGoals,
            totalAmountNeeded: suggestion.totalAmountNeeded,
        })
        handleOpenEditModal({
            id: null,
            type: 'sell',
            coinId: '',
            amount: '',
            pricePerCoin: '',
            date: new Date().toISOString().split('T')[0],
        })
    }, [handleOpenAddHoldingModal, handleOpenEditModal]);

    // --- 4. DERIVED DATA (useMemo for calculations) ---

    const portfolioData = useMemo(() => {
        if (holdings.length === 0 || Object.keys(apiData).length === 0) {
          return [];
        }
        return holdings.map(holding => {
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
        }).filter(Boolean);
    }, [holdings, apiData]);

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

    const total24hChangeValue = useMemo(
        () => portfolioData.reduce((total, coin) => {
          const priceChange = coin.price_change_24h || 0;
          return total + (priceChange * coin.amount);
        }, 0),
        [portfolioData]
    );
      
      const portfolioValueYesterday = portfolioTotalValue - total24hChangeValue;

      const totalChangePercentage = useMemo(() => {
        return portfolioValueYesterday !== 0 ? (total24hChangeValue / portfolioValueYesterday) * 100 : 0;
      }, [portfolioValueYesterday, total24hChangeValue])


    // --- 3. SIDE EFFECTS & LOGIC (useEffect) ---
    useEffect(() => { // Load Coin List
        if (apiCallGuard.current) return;
        
        const loadCoinList = async () => {
            try {
                const fullCoinList = await fetchCoinList();
                setCoinList(fullCoinList);
            } catch (err) {
                console.error("Không thể tải danh sách coin:", err);
            }
        };
        loadCoinList();
        apiCallGuard.current = true;
    }, []);

    useEffect(() => { // Update Holdings from Transactions
        // Bước 1.1: Nhóm tất cả giao dịch theo coinId
        const transactionsByCoin = transactions.reduce((acc, transaction) => {
            const { coinId } = transaction;
            if (!acc[coinId]) {
                acc[coinId] = [];
            }
            acc[coinId].push(transaction); // Sửa điểm 1 & 2: Chỉ push giao dịch hiện tại (t)
            return acc;
        }, {});
        console.log(transactionsByCoin,'transactionsBycoin')

        // Bước 1.2 & 1.3: Lặp qua từng nhóm, tính toán và tạo mảng holding mới
        const calculatedHoldings = Object.keys(transactionsByCoin).map(coinId => {
            const coinTransactions = transactionsByCoin[coinId];
            
            const buys = coinTransactions.filter(t => t.type === 'buy');
            const sells = coinTransactions.filter(t => t.type === 'sell');

            const totalAmountBought = buys.reduce((sum, t) => sum + t.amount, 0);
            const totalCostOfBuys = buys.reduce((sum, t) => sum + (t.amount * (t.pricePerCoin || 0)), 0);
            
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

        // Bước 1.4: Lọc và cập nhật state chính xác
        const newHoldingsArray = calculatedHoldings.filter(holding => holding.amount > 0.000001);

        setHoldings(newHoldingsArray); // Sửa điểm 3: Cập nhật vào holdings, không phải transactions

    }, [transactions]);
    
    useEffect(() => { // Load Portfolio Data
        const getApiData = async () => {
            if (holdings.length === 0) {
                setApiData({});
                setIsLoading(false);
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                const ids = holdings.map(coin => coin.id);
                const marketData = await fetchCoinData(ids);
                
                const apiDataAsObject = marketData.reduce((acc, coin) => {
                    acc[coin.id] = coin;
                    return acc;
                }, {});
                setApiData(apiDataAsObject);

            } catch (err) {
                setError("Có lỗi xảy ra, không thể tải dữ liệu danh mục.");
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };
        getApiData();
        const interval = setInterval(getApiData, 60000); // Tải lại sau mỗi 60s
        return () => clearInterval(interval); // Dọn dẹp interval
    }, [holdings]);
    
    // --- SMART SUGGESTIONS LOGIC ---
    useEffect(() => {
        if(totalProfitLoss <= 0 || !goals || goals.length === 0) {
            setSmartSuggestions(null);
            return;
        }
        const achievableGoals = goals.filter(goal => {
            const amountNeeded = goal.targetAmount - goal.currentAmount;
            return amountNeeded > 0;
        }).map(g => ({
            name: g.title,
            amountNeeded: g.targetAmount - g.currentAmount,
            id: g.id,
        }));

        if(achievableGoals.length === 0) {
            setSmartSuggestions(null);
            return;
        }
        const totalAmountNeeded = achievableGoals.reduce((total, g) =>
            total + g.amountNeeded, 0)
        ;
        const suggestion = {
            id: 'summary_suggestion',
            totalProfitLoss: totalProfitLoss,
            achievableGoals: achievableGoals,
            totalAmountNeeded: totalAmountNeeded,
            percentageNeeded: (totalAmountNeeded / totalProfitLoss) * 100,
            remainingProfit: totalProfitLoss - totalAmountNeeded,
        };
        setSmartSuggestions(suggestion);
        console.log('Generate Summary suggestions:', suggestion);

    }, [goals, totalProfitLoss]);
    
    // --- 4. DERIVED DATA (useMemo for calculations) ---
    
    // Tối ưu object value bằng useMemo
    const value = useMemo(() => ({
        holdings, 
        transactions, 
        portfolioData, 
        isLoading, 
        error, 
        coinList,
        isAddHoldingModalOpen, 
        editingTransaction, 
        smartSuggestions, // <-- **QUAN TRỌNG: THÊM DÒNG NÀY** 
        addTransaction: handleAddTransaction,
        editTransaction: handleEditTransaction, 
        deleteTransaction: handleDeleteTransaction,
        openAddHoldingModal: handleOpenAddHoldingModal, 
        openEditModal: handleOpenEditModal,
        closeModal: handleCloseModal, 
        portfolioTotalValue, 
        totalCostBasis,
        totalProfitLoss, 
        total24hChangeValue, 
        totalChangePercentage,
        confirmationModal,
        handleOpenConfirmationModal,
        handleCloseConfirmationModal,
        smartSuggestions,
        handleInitiateGoalCompletion,
    }), [
        holdings, transactions, portfolioData, isLoading, error, coinList,
        isAddHoldingModalOpen, editingTransaction, smartSuggestions, // <-- **VÀ THÊM VÀO ĐÂY**
        portfolioTotalValue, 
        totalCostBasis, totalProfitLoss, total24hChangeValue, 
        totalChangePercentage, confirmationModal, handleAddTransaction,
        handleEditTransaction, handleDeleteTransaction, handleOpenAddHoldingModal,
        handleOpenEditModal, handleCloseModal, handleOpenConfirmationModal,
        handleCloseConfirmationModal, smartSuggestions,
        handleInitiateGoalCompletion,
    ]);
    console.log("context value", value);

 return (
    <PortfolioContext.Provider value={value}>
            {children}
    </PortfolioContext.Provider>
    );
}