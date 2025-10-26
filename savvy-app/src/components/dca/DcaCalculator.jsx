import React, { useState, useEffect, useContext } from 'react'; // Thêm useContext
import { AppContext } from '../../context/AppContext'; // Thêm AppContext
import { calculateDcaResult, calculateDaysBetween, transformCryptoCompareData } from '../../utils/dca-calculator'; // 1. Thêm import
import { fetchCoinHistory } from '../../services/crypto-api';
import styles from './DcaCalculator.module.css';

export const DcaCalculator = () => {
  // 3. Lấy coinList từ context
  const { coinList, isCoinListLoading, coinListError } = useContext(AppContext);

  // 4. Xóa useState và useEffect cho coinList
  const [inputs, setInputs] = useState({
    coinId: '', // coinId được chọn cuối cùng
    investment: 50,
    frequency: 'monthly',
    startDate: '', // Thay thế periodDays bằng startDate
  });
  
  // State mới cho autocomplete
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(''); // Khởi tạo là chuỗi rỗng

  // useEffect cho logic autocomplete không đổi
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }
    const filtered = coinList.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10); // Chỉ hiển thị 10 kết quả
    setSuggestions(filtered);
    setIsSuggestionsVisible(true);
  }, [searchTerm, coinList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'coinSearch') {
      setSearchTerm(value);
      // Xóa coinId đã chọn nếu người dùng bắt đầu tìm kiếm lại
      if (inputs.coinId) {
        setInputs(prev => ({ ...prev, coinId: '' }));
      }
    } else {
      setInputs(prevInputs => ({
        ...prevInputs,
        [name]: name === 'investment' ? Number(value) : value,
      }));
    }
  };

  const handleSuggestionClick = (coin) => {
    setInputs(prev => ({ ...prev, coinId: coin.id }));
    setSearchTerm(coin.name); // Hiển thị tên coin trong input
    setIsSuggestionsVisible(false); // Ẩn danh sách gợi ý
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!inputs.coinId || !inputs.startDate) {
      setError('Vui lòng chọn coin và ngày bắt đầu.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const diffDays = calculateDaysBetween(inputs.startDate);
      
      if (diffDays <= 0) {
        setError("Ngày bắt đầu không hợp lệ hoặc ở trong tương lai.");
        setIsLoading(false);
        return;
      }

      // 2. Gọi API (coinId giờ là symbol, vd: "BTC")
      const rawHistoricalData = await fetchCoinHistory(inputs.coinId, diffDays);

      // 3. "Biên dịch" dữ liệu trước khi tính toán
      const historicalData = transformCryptoCompareData(rawHistoricalData);

      const dcaResult = calculateDcaResult({
        historicalData, // Dữ liệu đã được chuẩn hóa
        investment: inputs.investment,
        frequency: inputs.frequency,
        periodDays: diffDays,
      });

      setResult(dcaResult);

    } catch (err) {
      console.error("Lỗi khi tính toán DCA:", err);
      setError('Đã có lỗi xảy ra. Không thể lấy dữ liệu giá hoặc tính toán.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className={styles.calculatorSection}>
      <h2>Cỗ Máy Thời Gian DCA 🚀</h2>
      
      {/* 5. Xử lý trạng thái loading/error từ context */}
      {isCoinListLoading && <p>Đang tải danh sách coin...</p>}
      {coinListError && <p className={styles.errorText}>{coinListError}</p>}

      {/* Form chỉ hiển thị khi đã có coinList */}
      {coinList.length > 0 && (
        <form className={styles.calculatorForm} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formControls}>
            <div className={styles.formControl} onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 100)}>
              <label htmlFor="coinSearch">Chọn Coin</label>
              <input
                type="text"
                name="coinSearch"
                id="coinSearch"
                placeholder="Tìm kiếm (vd: Bitcoin, ETH...)"
                value={searchTerm}
                onChange={handleInputChange}
              />
              {isSuggestionsVisible && suggestions.length > 0 && (
                <ul className={styles.suggestionList}>
                  {suggestions.map(coin => (
                    <li key={coin.id} onMouseDown={() => handleSuggestionClick(coin)}>
                      <img src={coin.image} alt={coin.name} />
                      <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className={styles.formControl}>
              <label htmlFor="investment">Số tiền đầu tư ($)</label>
              <input
                type="number"
                name="investment"
                value={inputs.investment}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className={styles.formControl}>
              <label htmlFor="frequency">Tần suất</label>
              <select name="frequency" value={inputs.frequency} onChange={handleInputChange}>
                <option value="monthly">Hàng tháng</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>

            <div className={styles.formControl}>
              <label htmlFor="startDate">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={inputs.startDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]} // Không cho chọn ngày tương lai
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading || !inputs.coinId}>
            {isLoading ? 'Đang tính toán...' : 'Xem kết quả'}
          </button>
        </form>
      )}
      
      {/* ✅ KHU VỰC MỚI: HIỂN THỊ KẾT QUẢ */}
      <div className={styles.resultSection}>
        {isLoading && <p>Đang tải dữ liệu và tính toán...</p>}
        
        {error && <p className={styles.errorText}>{error}</p>}
        
        {result && (
          <div className={styles.resultCard}>
            <h3>Kết quả Giả lập</h3>
            <p>
              Nếu bạn đã đầu tư 
              <strong> ${inputs.investment.toLocaleString()}</strong> mỗi
              <strong> {inputs.frequency === 'monthly' ? 'tháng' : 'tuần'}</strong> vào
              <strong> {searchTerm}</strong>
            </p>
            <p>kể từ ngày <strong>{new Date(inputs.startDate).toLocaleDateString('vi-VN')}</strong>,
            </p>
            <div className={styles.resultSummary}>
              <p>...bây giờ bạn sẽ có:</p>
              <h2>${result.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className={result.profitLoss >= 0 ? styles.profit : styles.loss}>
                (Tổng vốn đầu tư: ${result.totalInvested.toLocaleString()})
                <br/>
                (Lời/Lỗ: ${result.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})
              </p>
            </div>
            <p className={styles.disclaimer}>
              *Lưu ý: Kết quả chỉ mang tính chất tham khảo dựa trên dữ liệu lịch sử và không đảm bảo lợi nhuận trong tương lai.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
