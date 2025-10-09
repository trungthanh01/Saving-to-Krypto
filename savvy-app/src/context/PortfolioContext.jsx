import { createContext, useState, useEffect, useRef } from "react";
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

    const [isAddHoldingModalOpen, setIsAddHoldingModalOpen] = useState(false);
    const [coinList, setCoinList] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // --- API DATA FETCHING ---
    const apiCallGuard = useRef(false); // Dùng chung cho các lần gọi API
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

    // --- CORE LOGIC: holdings LUÔN ĐƯỢC TÍNH TOÁN TỪ transactions ---
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

    // --- TRANSACTION HANDLERS (Đã được đơn giản hóa) ---
    function handleAddTransaction(newTransaction) {
        setTransactions(prev => [newTransaction, ...prev]);
        setGoalMessage(`Đã thêm ${newTransaction.coinId.toUpperCase()}!`);
    }

    function handleEditTransaction(updatedTransaction) {
        setTransactions(prev => prev.map(t =>
            t.id === updatedTransaction.id ? updatedTransaction : t
        ));
        setGoalMessage(`Đã cập nhật giao dịch cho ${updatedTransaction.coinId.toUpperCase()}!`);
    }

    function handleDeleteTransaction(transactionIdToDelete) {
        const userConfirmed = window.confirm("Bạn có chắc muốn xóa giao dịch này không?");
        if (userConfirmed) {
            setTransactions(prev => prev.filter(t => t.id !== transactionIdToDelete));
        }
    }

    // --- MODAL LOGIC ---
    const handleOpenAddHoldingModal = () => setIsAddHoldingModalOpen(true);
    const handleCloseModal = () => {
        setIsAddHoldingModalOpen(false);
        setEditingTransaction(null); // Reset cả state edit khi đóng
    };
    const handleOpenEditModal = (transaction) => {
        setEditingTransaction(transaction);
        handleOpenAddHoldingModal();
    };

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
    
    const portfolioTotalValue = portfolioData.reduce((total, coin) => total + (coin.amount * coin.current_price), 0);
    const totalCostBasis = transactions.reduce((total, t) => {
        const value = t.amount * t.pricePerCoin;
        return t.type === 'buy' ? total + value : total - value;
    }, 0);
    const totalProfitLoss = totalCostBasis > 0 ? portfolioTotalValue - totalCostBasis : 0;
    const total24hChangeValue = portfolioData.reduce((total, coin) => total + (coin.amount * coin.price_change_24h), 0);
    const portfolioValueYesterday = portfolioTotalValue - total24hChangeValue;
    const totalChangePercentage = portfolioValueYesterday !== 0 ? (total24hChangeValue / portfolioValueYesterday) * 100 : 0;

    const value = {
        holdings, transactions, portfolioData, isLoading, error, coinList,
        isAddHoldingModalOpen, editingTransaction, addTransaction: handleAddTransaction,
        editTransaction: handleEditTransaction, deleteTransaction: handleDeleteTransaction,
        openAddHoldingModal: handleOpenAddHoldingModal, openEditModal: handleOpenEditModal,
        closeModal: handleCloseModal, portfolioTotalValue, totalCostBasis,
        totalProfitLoss, total24hChangeValue, totalChangePercentage,
    };

    return (
        <PortfolioContext.Provider value={value}>
            {children}
        </PortfolioContext.Provider>
    );
}