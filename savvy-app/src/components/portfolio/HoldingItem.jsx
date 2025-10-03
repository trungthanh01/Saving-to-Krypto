import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext";

export function HoldingItem({coin}) {
    const { transactions } = useContext(PortfolioContext);

    // --- Tính toán & Định dạng ---
    const formattedPrice = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(coin.current_price || 0);

    const formatted24hChange = 
        `${(coin.price_change_percentage_24h || 0).toFixed(2)}%`
    ;

    const totalValue = coin.amount * coin.current_price;
    const formattedTotalValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalValue || 0);

    // Tính toán PNL cho riêng coin này
    const coinTransactions = transactions.filter(t => t.coinId === coin.id);
    const costBasis = coinTransactions.reduce((total, t) => total + (t.amount * t.purchasePrice), 0);
    const profitLoss = costBasis > 0 ? totalValue - costBasis : 0;
    const formattedProfitLoss = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(profitLoss || 0);


    // --- Class CSS động ---
    const change24hClass = 
        coin.price_change_percentage_24h > 0 ? 'profit' 
        : coin.price_change_percentage_24h < 0 ? 'loss' : ''
    ;
    const pnlClass = profitLoss > 0 ? 'profit' : profitLoss < 0 ? 'loss' : '';


    return (
        <tr>
            <td className="coin-name-cell">
                <img className="coin-logo" src={coin.image} alt={`${coin.name} logo`} />
                <div>
                    <span>
                    {coin.name}
                    </span>
                    <span className="coin-symbol">
                        {coin.symbol.toUpperCase()}
                    </span>
                </div>
            </td>
            <td>{formattedPrice}</td>
            <td className={change24hClass}>{formatted24hChange}</td>
            <td>{coin.amount}</td>
            <td>{formattedTotalValue}</td>
            <td className={pnlClass}>{formattedProfitLoss}</td>
        </tr>
    )
}