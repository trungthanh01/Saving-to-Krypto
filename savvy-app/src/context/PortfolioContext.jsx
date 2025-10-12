import { useMemo, useCallback, createContext, useState, useEffect, useRef } from "react";
import { fetchCoinData, fetchCoinList } from "../services/crypto-api.js";

export const PortfolioContext = createContext();

export function PortfolioProvider({ children, setGoalMessage }) {
    // --- STATE MANAGEMENT ---
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
    const message = {
      deleteTransaction: 'Bạn có chắc muốn xóa giao dịch này không?',
    };
    const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);
    const [coinList, setCoinList] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const apiCallGuard = useRef(false);
    useEffect(() => {
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

    useEffect(() => {
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

    // --- TRANSACTION HANDLERS (Đã được tối ưu với useCallback) ---
    const handleAddTransaction = useCallback((newTransaction) => {
        setTransactions(prev => [newTransaction, ...prev]);
        setGoalMessage(`Đã thêm ${newTransaction.coinId.toUpperCase()}!`);
    }, []); // <-- XÓA `setGoalMessage` KHỎI ĐÂY

    const handleEditTransaction = useCallback((updatedTransaction) => {
        setTransactions(prev => prev.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ));
        setGoalMessage(`Đã cập nhật giao dịch cho ${updatedTransaction.coinId.toUpperCase()}!`);
    }, []); // <-- XÓA `setGoalMessage` KHỎI ĐÂY

    const handleOpenConfirmationModal = useCallback((message, onConfirm) => {
        setConfirmationModal({
            isOpen: true,
            message: message,
            onConfirm,
        });
    }, []);
    const handleDeleteTransaction = useCallback((transactionIdToDelete) => {
      handleOpenConfirmationModal(message.deleteTransaction, () => {
        setTransactions(prev => prev.filter(t => t.id !== transactionIdToDelete));
      });
    }, [handleOpenConfirmationModal, message.deleteTransaction]);


    const handleCloseConfirmationModal = useCallback(() => {
        setConfirmationModal({
            isOpen: false,
            message: '',
            onConfirm: () => {},
        });
    }, []);

    // --- MODAL LOGIC ---
    const handleOpenAddHoldingModal = useCallback(() => setIsAddHoldingModalOpen(true), []);
    const handleCloseModal = useCallback(() => {
        setIsAddHoldingModalOpen(false);
        setEditingTransaction(null); // Reset cả state edit khi đóng
    }, []);
    const handleOpenEditModal = useCallback((transaction) => {
        setEditingTransaction(transaction);
        handleOpenAddHoldingModal();
    }, [handleOpenAddHoldingModal]);

    // --- DERIVED DATA & SIDE EFFECTS ---
    useEffect(() => {
        localStorage.setItem('portfolio-holdings', JSON.stringify(holdings));
    }, [holdings]);
    
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
    }), [
        holdings, transactions, portfolioData, isLoading, error, coinList,
        isAddHoldingModalOpen, editingTransaction, portfolioTotalValue, 
        totalCostBasis, totalProfitLoss, total24hChangeValue, 
        totalChangePercentage, confirmationModal, handleAddTransaction,
        handleEditTransaction, handleDeleteTransaction, handleOpenAddHoldingModal,
        handleOpenEditModal, handleCloseModal, handleOpenConfirmationModal,
        handleCloseConfirmationModal
    ]);
    console.log("context value", value);

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
}