import { useMemo, useCallback, createContext, useState, useEffect, useRef } from "react";
import { fetchCoinData, fetchCoinList } from "../services/crypto-api.js";

export const PortfolioContext = createContext();

const message = {
  deleteTransaction: 'Bạn có chắc muốn xóa giao dịch này không?',
};

export function PortfolioProvider({ children, setGoalMessage, goals }) {
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
    const [smartSuggestions, setSmartSuggestions] = useState([]);
    const [portfolioData, setPortfolioData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- 2. HANDLER FUNCTIONS (useCallback) ---
    const handleAddTransaction = useCallback((newTransaction) => {
        setTransactions(prev => [newTransaction, ...prev]);
        // Tạm thời comment dòng này lại để tránh ảnh hưởng đến các hàm khác
        // setGoalMessage(`Đã thêm ${newTransaction.coinId.toUpperCase()}!`);
    }, []);

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
    }, []);

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
        const holdingsSummary = transactions.reduce((acc, t) => {
            const { coinId, amount, type } = t;
            if (!acc[coinId]) {
                acc[coinId] = 0;
            }
            if (type === 'buy') {
                acc[coinId] += amount;
            } else if (type === 'sell') {
                acc[coinId] -= amount;
            }
            return acc;
        }, {});

        const newHoldingsArray = Object.keys(holdingsSummary)
            .map(id => ({ id, amount: holdingsSummary[id] }))
            .filter(h => h.amount > 0.000001); // Lọc coin đã bán hết

        setHoldings(newHoldingsArray);
        localStorage.setItem('portfolio-transactions', JSON.stringify(transactions));
    }, [transactions]);
    
    useEffect(() => { // Persist Holdings
        localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
    }, [holdings]);
    
    useEffect(() => { // Load Portfolio Data
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
                    return { ...marketCoin, amount: holding ? holding.amount : 0 };
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
    
    // --- SMART SUGGESTIONS LOGIC ---
    useEffect(() => {
        console.log("--- Running Smart Suggestions ---");
        console.log("Goals:", goals);
        console.log("Portfolio Data:", portfolioData);

        if (!portfolioData.length || !goals || !goals.length) {
            console.log("Not enough data, skipping.");
            setSmartSuggestions([]);
            return;
        }

        const newSuggestions = [];

        portfolioData.forEach(coin => {
            const coinTransactions = transactions.filter(t => t.coinId === coin.id);
            const costBasis = coinTransactions.reduce((total, t) => {
                const value = t.amount * t.pricePerCoin;
                return t.type === 'buy' ? total + value : total - value;
            }, 0);

            const totalValue = coin.amount * coin.current_price;
            const profitLoss = costBasis > 0 ? totalValue - costBasis : 0;
            
            console.log(`Checking ${coin.name}: PnL = ${profitLoss}`);

            if (profitLoss <= 0) {
                return;
            }

            goals.forEach(goal => {
                const amountNeeded = goal.targetAmount - goal.currentAmount; //lấy mục tiêu trừ số lượng đang có => số lượng cần để hoàn thành mục tiêu

                if(goal && typeof goal.targetAmount === 'number' && typeof goal.currentAmount === 'number') {
                    const amountNeeded = goal.targetAmount - goal.currentAmount;
                    console.log(`   Comparing with goal '${goal.name}': Needs ${amountNeeded}`);
                }

                if (amountNeeded > 0 && profitLoss >= amountNeeded) { //nếu số lượng cần lớn hơn 0 và lợi nhuận lớn hơn số lượng cần
                    console.log(`   --> MATCH FOUND!`);
                    newSuggestions.push({ 
                        id: `${coin.id} - ${goal.id}`, 
                        coinName: coin.name, 
                        coinId: coin.id, 
                        coinImage: coin.image,
                        goalName: goal.title, 
                        profitAvailable: profitLoss, 
                        amountNeeded: amountNeeded 
                    });
                }
            })
        })
        setSmartSuggestions(newSuggestions);
        console.log("--- Finished. Suggestions found:", newSuggestions);

    }, [portfolioData, goals, transactions]);
    
    // --- 4. DERIVED DATA (useMemo for calculations) ---
    const portfolioTotalValue = useMemo(() => {
      return portfolioData.reduce((total, coin) => total + (coin.amount * coin.current_price), 0);
    }, [portfolioData])
    
    const totalCostBasis = useMemo(() => {
      return transactions.reduce((total, t) => {
        const price = t.pricePerCoin || 0;
        const value = t.amount * price;
        if(t.type === 'sell') {
            return total - value;
        }
        return total + value;
      }, 0);
    }, [transactions])

    const totalProfitLoss = useMemo(() => {
      return totalCostBasis > 0 ? portfolioTotalValue - totalCostBasis : 0;
    }, [portfolioTotalValue, totalCostBasis])

    const total24hChangeValue = useMemo(() => {
      return portfolioData.reduce((total, coin) => total + (coin.amount * coin.price_change_24h), 0);
    }, [portfolioData])
    
    const portfolioValueYesterday = portfolioTotalValue - total24hChangeValue;
    const totalChangePercentage = useMemo(() => {
      return portfolioValueYesterday !== 0 ? (total24hChangeValue / portfolioValueYesterday) * 100 : 0;
    }, [portfolioValueYesterday, total24hChangeValue])
    
    
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
    }), [
        holdings, transactions, portfolioData, isLoading, error, coinList,
        isAddHoldingModalOpen, editingTransaction, smartSuggestions, // <-- **VÀ THÊM VÀO ĐÂY**
        portfolioTotalValue, 
        totalCostBasis, totalProfitLoss, total24hChangeValue, 
        totalChangePercentage, confirmationModal, handleAddTransaction,
        handleEditTransaction, handleDeleteTransaction, handleOpenAddHoldingModal,
        handleOpenEditModal, handleCloseModal, handleOpenConfirmationModal,
        handleCloseConfirmationModal, smartSuggestions,
    ]);
    console.log("context value", value);

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
}