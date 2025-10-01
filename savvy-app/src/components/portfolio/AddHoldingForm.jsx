import { useState, useContext } from "react";
import './add-holding-form.css'; // Sửa lại cách import
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AddButton } from "../savvy/AddButton.jsx"; // Import nút bấm

export function AddHoldingForm({isOpen, onClose}) {
  const { addHolding } = useContext(PortfolioContext);
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');

  if(!isOpen) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (coinId.length === 0 || amount.length === 0) {
      alert("Vui lòng nhập đủ thông tin Coin ID và Số lượng.");
      return;
    }

    const newHolding = {
      id: coinId.toLowerCase().trim(),
      amount: parseFloat(amount)
    };
    
    console.log('Form Submitted!', newHolding);
    addHolding(newHolding);

    // Dọn dẹp và đóng modal
    setCoinId('');
    setAmount('');
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