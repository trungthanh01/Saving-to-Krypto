import { useState, useContext, useEffect, memo } from "react";
import './AddTransactionForm.css';
import { PortfolioContext } from "../../context/PortfolioContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { AddButton } from "../savvy/AddButton.jsx";

export const AddTransactionForm = memo(() => {
  // ─────────────────────────────────────────────────
  // CONTEXT: AppContext (UI state & modals)
  // ─────────────────────────────────────────────────
  const { 
    coinList,
    modals,
    closeAddTransactionModal,  // ✅ Import hàm này
  } = useContext(AppContext);

  // ─────────────────────────────────────────────────
  // CONTEXT: PortfolioContext (Transaction logic)
  // ─────────────────────────────────────────────────
  const { 
    addTransaction, 
    editTransaction,  // ✅ Import này để handle edit
  } = useContext(PortfolioContext);

  // ─────────────────────────────────────────────────
  // LOCAL STATE: Form fields
  // ─────────────────────────────────────────────────
  const [coinId, setCoinId] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('buy');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [suggestions, setSuggestions] = useState(null);
  const [date, setDate] = useState('');

  // ─────────────────────────────────────────────────
  // DERIVED STATE: Check if in edit mode
  // ─────────────────────────────────────────────────
  // ✅ Edit mode 
  const isEditMode = modals.addTransaction.mode === 'edit';

  // ─────────────────────────────────────────────────
  // EFFECT: Pre-fill form when modal opens/mode changes
  // ─────────────────────────────────────────────────
  useEffect(() => {
    // ✅ Kiểm tra modals.addTransaction.data (không phải editTransaction!)
    if (modals.addTransaction.data) {
      // Edit mode: pre-fill form with transaction data
      const data = modals.addTransaction.data;
      setCoinId(data.coinId || '');
      setAmount(data.amount || '');
      setType(data.type || 'buy');
      setPricePerCoin(data.pricePerCoin || '');
      setDate(data.date || '');
      setSuggestions(null);
    } else {
      // Add mode: reset form to defaults
      setCoinId('');
      setAmount('');
      setType('buy');
      setPricePerCoin('');
      setSuggestions(null);
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [modals.addTransaction.data, modals.addTransaction.mode]);  // ✅ Dependency: modals.addTransaction.data

  // ─────────────────────────────────────────────────
  // EFFECT: Generate suggestions when user types coin name
  // ─────────────────────────────────────────────────
  useEffect(() => {
    // Skip suggestions in edit mode
    if (isEditMode || !coinId.trim() || coinList.length === 0) {
      setSuggestions(null);
      return;
    }

    // Filter coins by name or symbol
    const filtered = coinList.filter(coin =>
      coin.name.toLowerCase().includes(coinId.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(coinId.toLowerCase())
    ).slice(0, 10);

    if (filtered.length === 0) {
      console.log('No coins found for search:', coinId);
      console.log('Available coins:', coinList.map(c => ({ name: c.name, symbol: c.symbol })));
    }

    setSuggestions(filtered.length > 0 ? filtered : null);
  }, [coinId, coinList, isEditMode]);

  // ─────────────────────────────────────────────────
  // EARLY RETURN: Modal closed
  // ─────────────────────────────────────────────────
  // ✅ Check modals.addTransaction.isOpen (not modals.isOpen!)
  if (!modals.addTransaction.isOpen) {
    return null;
  }

  // ─────────────────────────────────────────────────
  // HANDLER: Form submit
  // ─────────────────────────────────────────────────
  const handleSubmit = (event) => {
    event.preventDefault();

    // 1. Find coin from coinList
    const searchTerm = coinId.toLowerCase();
    const selectedCoin = coinList.find((c) =>
      c.name.toLowerCase() === searchTerm ||
      c.symbol.toLowerCase() === searchTerm
    );

    // 2. VALIDATE
    if (!selectedCoin) {
      alert("Coin không hợp lệ. Vui lòng gõ và chọn một coin từ danh sách gợi ý.");
      return;
    }

    if (!amount || !pricePerCoin) {
      alert("Vui lòng điền đầy đủ thông tin: Số lượng và Giá.");
      return;
    }

    // 3. Create transaction object
    const transactionData = {
      id: isEditMode ? modals.addTransaction.data.id : `t_${new Date().getTime()}`,
      coinId: selectedCoin.symbol.toUpperCase(),  // Use uppercase symbol
      amount: parseFloat(amount),
      type: type,
      pricePerCoin: parseFloat(pricePerCoin),
      date: date,
    };

    // 4. Add or edit transaction
    if (isEditMode) {
      editTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }

    // 5. Close modal
    // ✅ PortfolioContext.addTransaction sẽ handle goal completion
    // ✅ Không nên gọi markGoalAsComplete ở đây!
    closeAddTransactionModal();
  };

  // ─────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────
  return (
    <div className="overlay" onClick={closeAddTransactionModal}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <header className="header">
          <h2>{isEditMode ? 'Sửa Giao Dịch' : 'Thêm Giao Dịch'}</h2>
          <button className="closeButton" onClick={closeAddTransactionModal}>
            &times;
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          {/* Coin Input with Suggestions */}
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
            {suggestions && (
              <ul className="suggestion-list">
                {suggestions.map((suggestion) => (
                  <li
                    key={suggestion.id}
                    onClick={() => {
                      setCoinId(suggestion.name);
                      setSuggestions(null);
                    }}
                  >
                    <img
                      className="suggestion-logo"
                      src={suggestion.image}
                      alt={suggestion.name}
                    />
                    <div className="suggestion-text">
                      <span className="suggestion-name">{suggestion.name}</span>
                      <span className="suggestion-symbol">
                        {suggestion.symbol.toUpperCase()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Date Input */}
          <div className="formGroup">
            <label htmlFor="date">Ngày</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Transaction Type Radio */}
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
              <label htmlFor="buy" className="radio-label">
                Mua
              </label>
              <input
                type="radio"
                id="sell"
                name="transactionType"
                value="sell"
                checked={type === 'sell'}
                onChange={(e) => setType(e.target.value)}
              />
              <label htmlFor="sell" className="radio-label">
                Bán
              </label>
              <div className="radio-pill"></div>
            </div>
          </div>

          {/* Price Input */}
          <div className="formGroup">
            <label htmlFor="pricePerCoin">Giá mỗi coin (USD)</label>
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

          {/* Amount Input */}
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

          {/* Submit Button */}
          <div className="formActions">
            <AddButton>{isEditMode ? 'Lưu Thay Đổi' : 'Thêm'}</AddButton>
          </div>
        </form>
      </div>
    </div>
  );
});

AddTransactionForm.displayName = 'AddTransactionForm';