import { useState, useContext, useEffect, memo } from "react";
import './AddTransactionForm.css';
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AddButton } from "../savvy/AddButton.jsx";

export const AddTransactionForm = memo(({ isOpen, onClose, transactionToEdit }) => {
    console.log("2. AddTransactionForm rendered. isOpen is:", isOpen);
    const portfolioCtx = useContext(PortfolioContext);
    console.log("Context value RECEIVED in Form:", portfolioCtx);
    const { addTransaction, editTransaction, coinList } = portfolioCtx;

    const [coinId, setCoinId] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('buy');
    const [pricePerCoin, setPricePerCoin] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [date, setDate] = useState('');   

    const isEditMode = Boolean(transactionToEdit);

    useEffect(() => {
        if (isOpen) {
            if (isEditMode) {
                setCoinId(transactionToEdit.coinId);
                setAmount(transactionToEdit.amount || '');
                setType(transactionToEdit.type);
                setPricePerCoin(transactionToEdit.pricePerCoin || '');
                setSuggestions([]);
                setDate(transactionToEdit.date || '');
            } else {
                setCoinId('');
                setAmount('');
                setType('buy');
                setPricePerCoin('');
                setSuggestions([]);
                setDate(new Date().toISOString().split('T')[0]);
            }
        }
    }, [isOpen, isEditMode, transactionToEdit]);

    useEffect(() => {
        if (isEditMode || !coinId.trim()) {
            setSuggestions([]);
            return;
        }
        const filtered = coinList.filter(coin =>
            coin.name.toLowerCase().includes(coinId.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(coinId.toLowerCase())
        ).slice(0, 10);
        setSuggestions(filtered);
    }, [coinId, coinList, isEditMode]);

    if (!isOpen) {
        console.log("2a. isOpen is false, returning null.");
        return null;
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!coinId || !amount || !pricePerCoin) {
            alert("Vui lòng điền đầy đủ thông tin: Coin, Số lượng, và Giá.");
            return;
        }

        const transactionData = {
            id: isEditMode ? transactionToEdit.id : 't_' + new Date().getTime(),
            coinId: coinId.toLowerCase().trim(),
            amount: parseFloat(amount),
            type: type,
            pricePerCoin: parseFloat(pricePerCoin),
            date: date,
        };

        if (isEditMode) {
            editTransaction(transactionData);
        } else {
            addTransaction(transactionData);
        }

        onClose();
    };

    return (
        <div className="overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <header className="header">
                    <h2>{isEditMode ? 'Sửa Giao Dịch' : 'Thêm Giao Dịch'}</h2>
                    <button className="closeButton" onClick={onClose}>&times;</button>
                </header>
                <form onSubmit={handleSubmit}>
                    <div className="formGroup suggestion-wrapper">
                        <label htmlFor="coinId">Coin</label>
                        <input
                            id="coinId"
                            type="text"
                            placeholder="vd: btc, eth, link, sol"
                            value={coinId}
                            onChange={(e) => setCoinId(e.target.value)}
                            autoComplete="off"
                            disabled={isEditMode}
                        />
                        {suggestions.length > 0 && (
                            <ul className="suggestion-list">
                                {suggestions.map(suggestion => (
                                    <li key={suggestion.id} onClick={() => {
                                        setCoinId(suggestion.id);
                                        setSuggestions([]);
                                    }}>
                                        <img className="suggestion-logo" src={suggestion.image} alt={suggestion.name} />
                                        <div className="suggestion-text">
                                            <span className="suggestion-name">{suggestion.name}</span>
                                            <span className="suggestion-symbol">{suggestion.symbol.toUpperCase()}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="formGroup">
                        <label htmlFor="date">Ngày</label>
                        <input 
                            type="date" 
                            id="date"
                            name="date"
                            value={date} onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                    
                    <div className="formGroup">
                        <label>Loại giao dịch</label>
                        <div className="radio-group">
                            <input type="radio" id="buy" name="transactionType" value="buy" checked={type === 'buy'} onChange={(e) => setType(e.target.value)} />
                            <label htmlFor="buy" className="radio-label">Mua</label>
                            <input type="radio" id="sell" name="transactionType" value="sell" checked={type === 'sell'} onChange={(e) => setType(e.target.value)} />
                            <label htmlFor="sell" className="radio-label">Bán</label>
                            <div className="radio-pill"></div>
                        </div>
                    </div>
                    <div className="formGroup">
                        <label htmlFor="pricePerCoin">Giá mỗi coin (USD)</label>
                        <input id="pricePerCoin" type="number" placeholder="0" value={pricePerCoin} onChange={(e) => setPricePerCoin(e.target.value)} min="0" step="any" />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="amount">Số lượng</label>
                        <input id="amount" type="number" placeholder="0" value={amount} onChange={(e) => setAmount(e.target.value)} min="0" step="any" />
                    </div>
                    <div className="formActions">
                        <AddButton>{isEditMode ? 'Lưu Thay Đổi' : 'Thêm'}</AddButton>
                    </div>
                </form>
            </div>
        </div>
    );
})