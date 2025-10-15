import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import './SmartSuggestions.css';

export function SmartSuggestions() {
    const { smartSuggestions, handleOpenEditModal } = useContext(PortfolioContext);

    if(!smartSuggestions.length)  return null;

    const formatProfitAvailable = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value || 0);

    const formatAmountNeeded = (value) => new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value || 0);


    return (
        <div className="smart-suggestions">
            <h1>Smart Suggestions</h1>
            {smartSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="smart-suggestion">
                    <h2>{suggestion.coinName}</h2>
                    <p>{suggestion.goalName}</p>
                    <p>{formatProfitAvailable(suggestion.profitAvailable)}</p> 
                    <p>{formatAmountNeeded(suggestion.amountNeeded)}</p>
                    <button onClick={() => handleOpenEditModal(suggestion)}>Sell</button>
                </div>
            ))}
        </div>
    );
}


