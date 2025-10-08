import { useState, useContext, useEffect } from "react";
import './AddTransactionForm.css'; // Sửa lại cách import
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AddButton } from "../savvy/AddButton.jsx"; // Import nút bấm

export function AddTransactionForm({isOpen, onClose, transactionToEdit}) {
  const { addTransaction, coinList, editTransaction } = useContext(PortfolioContext);
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('buy');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const isEditMode = Boolean(transactionToEdit);

  useEffect(() => {
    if (coinId.length === 0) {
      setSuggestions([]);
      return;
    }
    if (coinId.length > 0) {
      const filteredSuggestions = coinList.filter(coin => 
        coin.name.toLowerCase().includes(coinId.toLowerCase()) || 
        coin.symbol.toLowerCase().includes(coinId.toLowerCase())
      ).slice(0, 10);
      setSuggestions(filteredSuggestions);
    }
  }, [coinId, coinList])

  useEffect(() => {
    if (isEditMode) {
      setCoinId(transactionToEdit.coinId);
      setAmount(transactionToEdit.amount);
      setType(transactionToEdit.type);
      setPricePerCoin(transactionToEdit.pricePerCoin);
    } else {
      setCoinId('');
      setAmount('');
      setType('buy');
      setPricePerCoin('');
    }
  }, [transactionToEdit, isEditMode])
  
  if(!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (coinId.length === 0 || amount.length === 0) {
      alert("Vui lòng nhập đủ thông tin Coin ID và Số lượng.");
      return;
    }
    const transactionData = {
      id: isEditMode ? transactionToEdit.id : undefined,
      amount: parseFloat(amount),
      type: type,
      pricePerCoin: parseFloat(pricePerCoin),
      coinId: coinId.toLowerCase().trim(),
    }
    if (isEditMode) {
      console.log('Form Submitted in Add Model!', transactionData);
      editTransaction( transactionData);
    }else{
      console.log('Form Submitted in Add Model!', transactionData);
      addTransaction(transactionData);
    }
    console.log('Form Submitted!', transactionData);
    addTransaction(transactionData);
    setCoinId('');
    setAmount('');
    setType('buy');
    setPricePerCoin('');
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
                <label htmlFor="coinId">Coin ID</label>
                <input
                    id="coinId"
                    type="text"
                    placeholder="vd: bitcoin"
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                    autoComplete="off" 
                />
                {suggestions.length > 0 && (
                    <ul className="suggestion-list">
                        {suggestions.map(suggestion => (
                            <li 
                                key={suggestion.id} 
                                onClick={() => {
                                    setCoinId(suggestion.id); 
                                    setSuggestions([]);      
                                }}>
                                <img className="suggestion-logo" src={suggestion.image} alt={suggestion.name} />
                                {suggestion.name} ({suggestion.symbol})
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            

            <div className="formGroup">
                <label>Loại giao dịch</label>
                <div className="radio-group">
                    
                    <input 
                        type="radio" 
                        id="buy" 
                        name="transactionType" 
                        value="buy"
                        checked={type === 'buy'} 
                        onChange={(e) => setType(e.target.value)} 
                    />
                    <label htmlFor="buy" className="radio-label">Mua</label>

                    <input 
                        type="radio" 
                        id="sell" 
                        name="transactionType" 
                        value="sell"
                        checked={type === 'sell'}
                        onChange={(e) => setType(e.target.value)}
                    />
                    <label htmlFor="sell" className="radio-label">Bán</label>


                    <div className="radio-pill"></div>
                </div>
            </div>
            <div className="formGroup">
                <label htmlFor="pricePerCoin">Giá mỗi coin</label>
                <input
                    id="pricePerCoin"
                    type="number"
                    placeholder="0"
                    value={pricePerCoin}
                    onChange={(e) => setPricePerCoin(e.target.value)}
                    min="0"
                    step="any" 
                />
            </div>
            
          
            <div className="formGroup">
                <label htmlFor="amount">Số lượng</label>
                <input
                    id="amount"
                    type="number"
                    placeholder="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="any" 
                />
            </div>
          <div className="formActions">
            <AddButton>{isEditMode ? 'Lưu Thay Đổi' : 'Thêm'}</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
}