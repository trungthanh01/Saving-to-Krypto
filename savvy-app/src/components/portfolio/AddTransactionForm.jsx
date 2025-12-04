import { useState, useContext, useEffect, useMemo } from 'react';
import { AppContext } from '../../context/AppContext';
import { PortfolioContext } from '../../context/PortfolioContext';
import styles from './AddTransactionForm.module.css';

export function AddTransactionForm() {
  const { coinList, modals, closeAddTransactionModal } = useContext(AppContext);
  const { addTransaction, editTransaction } = useContext(PortfolioContext);

  const { isOpen, mode, data } = modals.addTransaction;

  const [type, setType] = useState('buy');
  const [coinId, setCoinId] = useState('');
  const [coinSearch, setCoinSearch] = useState('');
  const [amount, setAmount] = useState('');
  const [pricePerCoin, setPricePerCoin] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && data) {
      setType(data.type || 'buy');
      setCoinId(data.coinId || '');
      setCoinSearch(data.coinId || '');
      setAmount(data.amount?.toString() || '');
      setPricePerCoin(data.pricePerCoin?.toString() || '');
      setDate(data.date || new Date().toISOString().split('T')[0]);
    } else {
      setType('buy');
      setCoinId('');
      setCoinSearch('');
      setAmount('');
      setPricePerCoin('');
      setDate(new Date().toISOString().split('T')[0]);
    }
  }, [mode, data]);

  const filteredCoins = useMemo(() => {
    if (!coinSearch || coinSearch.length < 2) return [];
    const searchLower = coinSearch.toLowerCase();
    return coinList
      .filter(
        (coin) =>
          coin.name.toLowerCase().includes(searchLower) ||
          coin.symbol.toLowerCase().includes(searchLower)
      )
      .slice(0, 10);
  }, [coinSearch, coinList]);

  const handleSelectCoin = (coin) => {
    setCoinId(coin.id);
    setCoinSearch(coin.name);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const transactionData = {
      id: mode === 'edit' && data ? data.id : `tx_${Date.now()}`,
      type,
      coinId,
      amount: parseFloat(amount),
      pricePerCoin: parseFloat(pricePerCoin),
      date,
    };

    if (mode === 'edit') {
      editTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={closeAddTransactionModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{mode === 'edit' ? 'Sửa Giao Dịch' : 'Thêm Giao Dịch'}</h2>
          <button className={styles.closeButton} onClick={closeAddTransactionModal}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Loại giao dịch</label>
            <div className={styles.radioGroup}>
              <input
                type="radio"
                id="buy"
                name="type"
                value="buy"
                checked={type === 'buy'}
                onChange={(e) => setType(e.target.value)}
              />
              <label
                htmlFor="buy"
                className={`${styles.radioLabel} ${type === 'buy' ? styles.radioChecked : ''}`}
              >
                Mua
              </label>

              <input
                type="radio"
                id="sell"
                name="type"
                value="sell"
                checked={type === 'sell'}
                onChange={(e) => setType(e.target.value)}
              />
              <label
                htmlFor="sell"
                className={`${styles.radioLabel} ${type === 'sell' ? styles.radioChecked : ''}`}
              >
                Bán
              </label>

              <div
                className={`${styles.radioPill} ${
                  type === 'buy' ? styles.buyChecked : styles.sellChecked
                }`}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Chọn Coin</label>
            <div className={styles.suggestionWrapper}>
              <input
                type="text"
                placeholder="Tìm kiếm coin..."
                value={coinSearch}
                onChange={(e) => {
                  setCoinSearch(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                required
              />
              {showSuggestions && filteredCoins.length > 0 && (
                <ul className={styles.suggestionList}>
                  {filteredCoins.map((coin) => (
                    <li
                      key={coin.id}
                      className={styles.suggestionItem}
                      onClick={() => handleSelectCoin(coin)}
                    >
                      <img src={coin.thumb} alt={coin.name} className={styles.suggestionLogo} />
                      <div className={styles.suggestionText}>
                        <span className={styles.suggestionName}>{coin.name}</span>
                        <span className={styles.suggestionSymbol}>{coin.symbol.toUpperCase()}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Số lượng</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Giá mỗi coin (USD)</label>
            <input
              type="number"
              step="any"
              placeholder="0.00"
              value={pricePerCoin}
              onChange={(e) => setPricePerCoin(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Ngày giao dịch</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className={styles.formActions}>
            <button type="submit" className="btn btn-primary">
              {mode === 'edit' ? 'Cập nhật' : 'Thêm giao dịch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

