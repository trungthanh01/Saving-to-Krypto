import { useState, useContext } from "react";
import './add-holding-form.css'; // Sửa lại cách import
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AddButton } from "../savvy/AddButton.jsx"; // Import nút bấm

export function AddTransactionForm({isOpen, onClose}) {
  const { addTransaction } = useContext(PortfolioContext);
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('buy');
  const [pricePerCoin, setPricePerCoin] = useState('');

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
      amount: parseFloat(amount),
      type: type,
      pricePerCoin: parseFloat(pricePerCoin),
      coinId: coinId.toLowerCase().trim(),
    };
    
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
          <h2>Thêm Giao Dịch</h2>
          <button className="closeButton" onClick={onClose}>&times;</button>
        </header>
        <form onSubmit={handleSubmit}>
            <div className="formGroup">
                <label htmlFor="coinId">Coin ID</label>
                <input
                    id="coinId"
                    type="text"
                    placeholder="vd: bitcoin"
                    value={coinId}
                    onChange={(e) => setCoinId(e.target.value)}
                />
            </div>
            <div className="formGroup">
                <label htmlFor="type">Loại giao dịch</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="buy">Mua</option>
                    <option value="sell">Bán</option>
                </select>
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
            <AddButton>Thêm</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
}