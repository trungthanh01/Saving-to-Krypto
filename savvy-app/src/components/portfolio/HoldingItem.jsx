import { useContext, useMemo, memo } from "react";
import { PortfolioContext } from "../../context/PortfolioContext";

export const HoldingItem = memo(({ coin }) => {
    const {
        name,
        symbol,
        image,
        current_price,
        price_change_percentage_24h,
        amount,
        currentValue,
        costBasis,
        averageBuyPrice,
        profitLoss
    } = coin;

 

    // --- Derived Data Calculation (Optimized with useMemo) ---

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
    const formattedTotalValue = formatCurrency(currentValue);
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