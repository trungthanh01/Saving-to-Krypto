import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { calculateDcaResult, calculateDaysBetween, transformCryptoCompareData } from '../../utils/dca-calculator';
import { fetchCoinHistory } from '../../services/crypto-api';
import styles from './DcaCalculator.module.css';

export const DcaCalculator = () => {
  const { coinList, isCoinListLoading, coinListError } = useContext(AppContext);

  const [inputs, setInputs] = useState({
    coinId: '',
    investment: 50,
    frequency: 'monthly',
    startDate: '',
    feeRate: 0.02, // 📌 LƯU Ý: Đây là % (0.02%), UI nhập dạng phần trăm
  });

  // State mới cho autocomplete
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // useEffect cho logic autocomplete
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSuggestions([]);
      return;
    }
    const filtered = coinList.filter(coin =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
    setSuggestions(filtered);
    setIsSuggestionsVisible(true);
  }, [searchTerm, coinList]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'coinSearch') {
      setSearchTerm(value);
      if (inputs.coinId) {
        setInputs(prev => ({ ...prev, coinId: '' }));
      }
    } else {
      setInputs(prevInputs => ({
        ...prevInputs,
        [name]: name === 'investment' || name === 'feeRate' 
          ? Number(value) || 0 
          : value,
      }));
    }
  };

  const handleSuggestionClick = (coin) => {
    setInputs(prev => ({ ...prev, coinId: coin.id }));
    setSearchTerm(coin.name);
    setIsSuggestionsVisible(false);
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

      console.log('📊 [DcaCalculator] Form Input:', {
        coinId: inputs.coinId,
        investment: inputs.investment,
        frequency: inputs.frequency,
        startDate: inputs.startDate,
        diffDays: diffDays,
        feeRatePercent: inputs.feeRate + '%',
      });

      // 🔗 Gọi API lấy dữ liệu lịch sử
      const rawHistoricalData = await fetchCoinHistory(inputs.coinId, diffDays);

      console.log('🔗 [API] Raw response:', {
        receivedDataPoints: rawHistoricalData?.length || 0,
        firstItem: rawHistoricalData?.[0],
        lastItem: rawHistoricalData?.[rawHistoricalData.length - 1],
      });

      // 🔄 Transform dữ liệu từ CryptoCompare format sang [[timestamp, price]]
      const historicalData = transformCryptoCompareData(rawHistoricalData);

      console.log('📊 [INSPECT] historicalData:', {
        length: historicalData.length,
        firstDate: new Date(historicalData[0][0]).toLocaleDateString('vi-VN'),
        firstPrice: historicalData[0][1],
        lastDate: new Date(historicalData[historicalData.length - 1][0]).toLocaleDateString('vi-VN'),
        lastPrice: historicalData[historicalData.length - 1][1],
        sample3Items: [
          historicalData[0],
          historicalData[Math.floor(historicalData.length / 2)],
          historicalData[historicalData.length - 1],
        ],
      });

      // ✅ TASK 11.3.3: Gọi calculateDcaResult với feeRate chuyển đổi
      const dcaResult = calculateDcaResult({
        historicalData,
        investment: inputs.investment,
        frequency: inputs.frequency,
        periodDays: diffDays,
        feeRate: inputs.feeRate / 100, // ✅ Chuyển từ % (0.02) sang decimal (0.0002)
      });

      console.log('✅ [DCA Result]:', dcaResult);

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

      {isCoinListLoading && <p>Đang tải danh sách coin...</p>}
      {coinListError && <p className={styles.errorText}>{coinListError}</p>}

      {coinList.length > 0 && (
        <form className={styles.calculatorForm} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formControls}>
            {/* ✅ TASK 11.3.1: Coin Search Input */}
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

            {/* Investment Amount */}
            <div className={styles.formControl}>
              <label htmlFor="investment">Số tiền đầu tư ($)</label>
              <input
                type="number"
                name="investment"
                id="investment"
                placeholder='0'
                value={inputs.investment.toString()}
                onChange={handleInputChange}
                min="1"
                step="any"
              />
            </div>

            {/* ✅ TASK 11.3.1: Fee Rate Input (với label rõ ràng hơn) */}
            <div className={styles.formControl}>
              <label htmlFor="feeRate">
                Phí giao dịch (%) <span style={{ fontSize: '0.85em', color: '#666' }}>mặc định 0.02%</span>
              </label>
              <input
                type="number"
                name="feeRate"
                id="feeRate"
                value={inputs.feeRate}
                onChange={handleInputChange}
                min="0"
                max="1"
                step="0.01"
                placeholder="0.02"
              />
            </div>

            {/* Frequency */}
            <div className={styles.formControl}>
              <label htmlFor="frequency">Tần suất</label>
              <select name="frequency" id="frequency" value={inputs.frequency} onChange={handleInputChange}>
                <option value="monthly">Hàng tháng</option>
                <option value="weekly">Hàng tuần</option>
              </select>
            </div>

            {/* Start Date */}
            <div className={styles.formControl}>
              <label htmlFor="startDate">Ngày bắt đầu</label>
              <input
                type="date"
                name="startDate"
                id="startDate"
                value={inputs.startDate}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading || !inputs.coinId}>
            {isLoading ? 'Đang tính toán...' : 'Xem kết quả'}
          </button>
        </form>
      )}

      {/* ✅ TASK 11.3.4: RESULT SECTION MỚI - Hiển thị metadata đầy đủ */}
      <div className={styles.resultSection}>
        {isLoading && <p>Đang tải dữ liệu và tính toán...</p>}

        {error && <p className={styles.errorText}>{error}</p>}

        {result && (
          <div className={styles.resultCard}>
            <h3>Kết quả Giả lập DCA</h3>
            <p>
              Nếu bạn đã đầu tư
              <strong> ${inputs.investment.toLocaleString()}</strong> mỗi
              <strong> {inputs.frequency === 'monthly' ? 'tháng' : 'tuần'}</strong> vào
              <strong> {searchTerm}</strong>
            </p>
            <p>
              kể từ ngày <strong>{new Date(inputs.startDate).toLocaleDateString('vi-VN')}</strong>
              {' '}(với phí {inputs.feeRate}%)
            </p>

            {/* Main Result */}
            <div className={styles.resultSummary}>
              <p>...bây giờ bạn sẽ có:</p>
              <h2>${result.currentValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h2>
              <p className={result.profitLoss >= 0 ? styles.profit : styles.loss}>
                Tổng vốn đầu tư: <strong>${result.totalInvested.toLocaleString()}</strong>
                <br />
                Lời/Lỗ: <strong>${result.profitLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                <br />
                ROI: <strong>{result.roiPct.toFixed(2)}%</strong>
              </p>
            </div>

            {/* ✅ TASK 11.3.4: Metadata Details */}
            <div className={styles.resultMetadata}>
              <h4>Chi tiết Tính toán:</h4>
              <ul>
                <li>
                  Số lần mua thành công: <strong>{result.validBuys}</strong>
                </li>
                <li>
                  Số lần bỏ qua: <strong>{result.skippedBuys}</strong>
                </li>
                <li>
                  Tổng số coin: <strong>{result.totalCoins.toFixed(8)}</strong>
                </li>
                <li>
                  Giá hiện tại: <strong>${result.latestPrice.toFixed(2)}</strong>
                </li>
                <li>
                  Phí giao dịch: <strong>{(result.feeRate ?? 0).toFixed(4)}%</strong>
                </li>
              </ul>
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