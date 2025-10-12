import { useContext, useMemo, memo } from "react";
import { PortfolioContext } from "../../context/PortfolioContext";

export const HoldingItem = memo(({ coin }) => {
    const { transactions } = useContext(PortfolioContext);

    // --- Core Values ---
    const totalValue = coin.amount * coin.current_price;

    // --- Derived Data Calculation (Optimized with useMemo) ---

    // 1. Lọc ra các giao dịch chỉ cho coin này.
    const coinTransactions = useMemo(() => 
        transactions.filter(t => t.coinId === coin.id), 
        [transactions, coin.id]
    );

    // 2. Tính tổng vốn (Cost Basis) từ các giao dịch đã lọc.
    const costBasis = useMemo(() => 
        coinTransactions.reduce((total, t) => {
            const value = t.amount * t.pricePerCoin;
            return t.type === 'buy' ? total + value : total - value;
        }, 0), 
        [coinTransactions]
    );

    // 3. Tính giá mua trung bình.
    const averageBuyPrice = useMemo(() => 
        (costBasis > 0 && coin.amount > 0) ? costBasis / coin.amount : 0, 
        [costBasis, coin.amount]
    );

    // 4. Tính Lời/Lỗ.
    const profitLoss = useMemo(() => 
        costBasis > 0 ? totalValue - costBasis : 0, 
        [totalValue, costBasis]
    );

    // --- Formatting for Display ---
    const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(value || 0);
    
    const formatNumber = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 6
    }).format(value || 0);

    const formattedPrice = formatCurrency(coin.current_price);
    const formattedTotalValue = formatCurrency(totalValue);
    const formattedCostBasis = formatCurrency(costBasis);
    const formattedAverageBuyPrice = formatCurrency(averageBuyPrice);
    const formattedProfitLoss = formatCurrency(profitLoss);
    const formattedAmount = formatNumber(coin.amount);
    const formatted24hChange = `${(coin.price_change_percentage_24h || 0).toFixed(2)}%`;

    // --- Dynamic CSS Classes ---
    const change24hClass = coin.price_change_percentage_24h > 0 ? 'profit' : coin.price_change_percentage_24h < 0 ? 'loss' : '';
    const pnlClass = profitLoss > 0 ? 'profit' : profitLoss < 0 ? 'loss' : '';

    return (
        <tr>
            <td className="coin-name-cell">
                <img className="coin-logo" src={coin.image} alt={`${coin.name} logo`} />
                <div>
                    <span>{coin.name}</span>
                    <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
            </td>
            <td>{formattedPrice}</td>
            <td className={change24hClass}>{formatted24hChange}</td>
            <td className="align-right">{formattedAmount}</td>
            <td className="align-right">{formattedTotalValue}</td>
            <td className="align-right">{formattedCostBasis}</td>
            <td className="align-right">{formattedAverageBuyPrice}</td>
            <td className={`align-right ${pnlClass}`}>{formattedProfitLoss}</td>
        </tr>
    );
})