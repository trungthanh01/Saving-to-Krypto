import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { calculateDcaResult, calculateDaysBetween, transformCryptoCompareData } from '../../utils/dca-calculator';
import { fetchCoinHistory } from '../../services/crypto-api';
import { generateResultMessage } from '../../utils/message-generator';
import styles from './DcaCalculator.module.css';

export const DcaCalculator = () => {
  const { coinList, isCoinListLoading, coinListError } = useContext(AppContext);

  // ======= STATES =======
  const [strategy, setStrategy] = useState('hybrid');
  const [lumpSum, setLumpSum] = useState({
    initialInvestment: '',
    initialDate: ''
  });
  const [dcaInput, setDcaInput] = useState({
    monthlyInvestment: '',
    startDate: '',
    dcaMonths: ''
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCoin, setSelectedCoin] = useState(null);

  const [feeRate, setFeeRate] = useState(0.02);

  // ======= EFFECTS =======
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

  // ======= HANDLERS =======
  const handleCoinSearch = (value) => {
    setSearchTerm(value);
  };

  const handleSuggestionClick = (coin) => {
    setSearchTerm(coin.name);
    setSelectedCoin(coin);
    setIsSuggestionsVisible(false);
  };

  const handleFeeRateChange = (e) => {
    setFeeRate(Number(e.target.value) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCoin?.id) {
      setError('Vui lòng chọn coin.');
      return;
    }

    if (strategy === 'hybrid') {
      if (
        !lumpSum.initialInvestment || 
        !lumpSum.initialDate || 
        !dcaInput.monthlyInvestment || 
        !dcaInput.dcaMonths
      ) {
        setError('Vui lòng điền đầy đủ thông tin Lump Sum & DCA.');
        return;
      }
    }

    if (strategy === 'lump_sum' && 
      (!lumpSum.initialInvestment || !lumpSum.initialDate)) {
      setError('Vui lòng nhập Lump Sum Investment.');
      return;
    }
    
    if (strategy === 'dca_only' && 
      (!dcaInput.monthlyInvestment || !dcaInput.dcaMonths)) {
      setError('Vui lòng nhập DCA Investment.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      let startDate;
      if (strategy === 'lump_sum') {
        startDate = lumpSum.initialDate;
      } else if (strategy === 'dca_only') {
        startDate = dcaInput.startDate;
      } else {
        startDate = new Date(lumpSum.initialDate) < new Date(dcaInput.startDate) 
          ? lumpSum.initialDate 
          : dcaInput.startDate;
      }

      const diffDays = calculateDaysBetween(startDate);

      if (diffDays <= 0) {
        setError("Ngày bắt đầu không hợp lệ hoặc ở trong tương lai.");
        setIsLoading(false);
        return;
      }

      console.log('📊 [DcaCalculator] Strategy Input:', {
        strategy,
        coinId: selectedCoin.id,
        coinName: selectedCoin.name,
        startDate,
        diffDays: diffDays,
        feeRatePercent: feeRate + '%',
        lumpSum: strategy !== 'dca_only' ? lumpSum : 'N/A',
        dcaInput: strategy !== 'lump_sum' ? dcaInput : 'N/A',
      });

      const rawHistoricalData = await fetchCoinHistory(selectedCoin.id, diffDays);

      console.log('🔗 [API] Raw response:', {
        receivedDataPoints: rawHistoricalData?.length || 0,
        firstItem: rawHistoricalData?.[0],
        lastItem: rawHistoricalData?.[rawHistoricalData.length - 1],
      });

      const historicalData = transformCryptoCompareData(rawHistoricalData);

      console.log('📊 [INSPECT] historicalData:', {
        length: historicalData.length,
        firstDate: new Date(historicalData[0][0]).toLocaleDateString('vi-VN'),
        firstPrice: historicalData[0][1],
        lastDate: new Date(historicalData[historicalData.length - 1][0]).toLocaleDateString('vi-VN'),
        lastPrice: historicalData[historicalData.length - 1][1],
      });

      const dcaResult = calculateDcaResult({
        historicalData,
        strategy: strategy,
        initialInvestment: strategy !== 'dca_only' ? Number(lumpSum.initialInvestment) || 0 : 0,
        initialDate: strategy !== 'dca_only' ? lumpSum.initialDate : null,
        monthlyInvestment: strategy !== 'lump_sum' ? Number(dcaInput.monthlyInvestment) || 0 : 0,
        dcaMonths: strategy !== 'lump_sum' ? Number(dcaInput.dcaMonths) || 0 : 0,
        feeRate: feeRate / 100,
      });

      console.log('✅ [DCA Result]:', dcaResult);

      if (!dcaResult) {
        setError('Không thể tính toán. Vui lòng kiểm tra dữ liệu.');
        setIsLoading(false);
        return;
      }

      const resultWithCoin = {
        ...dcaResult,
        coin: selectedCoin.symbol.toUpperCase()
      };

      setResult(resultWithCoin);
      const msg = generateResultMessage(resultWithCoin);
      setMessage(msg);
      console.log('📬 [MESSAGE] Generated:', msg);

    } catch (err) {
      console.error("Lỗi khi tính toán DCA:", err);
      setError('Đã có lỗi xảy ra. Không thể lấy dữ liệu hoặc tính toán.');
    } finally {
      setIsLoading(false);
    }
  };

  // ======= RENDER =======
  return (
    <div className={styles.calculatorSection}>
      <h2>Cỗ Máy Thời Gian DCA 🚀</h2>

      {isCoinListLoading && <p>Đang tải danh sách coin...</p>}
      {coinListError && <p className={styles.errorText}>{coinListError}</p>}

      {coinList.length > 0 && (
        <form className={styles.calculatorForm} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.formControls}>
            {/* ✅ STRATEGY SELECTOR - FULL WIDTH */}
            <div className={styles.strategySelector}>
              <label style={{ marginBottom: '10px', fontWeight: 'bold', display: 'block' }}>
                Chọn chiến lược:
              </label>
              <label>
                <input 
                  type="radio" 
                  name="strategy"
                  value="lump_sum" 
                  checked={strategy === 'lump_sum'}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                💰 Lump Sum (Vốn đầu thôi)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="strategy"
                  value="dca_only" 
                  checked={strategy === 'dca_only'}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                📈 DCA Only (Góp hàng tháng)
              </label>
              <label>
                <input 
                  type="radio" 
                  name="strategy"
                  value="hybrid" 
                  checked={strategy === 'hybrid'}
                  onChange={(e) => setStrategy(e.target.value)}
                />
                🚀 Hybrid (Vốn + Góp)
              </label>
            </div>

            {/* ✅ COIN SEARCH */}
            <div className={styles.formControl} onBlur={() => setTimeout(() => setIsSuggestionsVisible(false), 100)}>
              <label htmlFor="coinSearch">Chọn Coin</label>
              <input
                type="text"
                id="coinSearch"
                placeholder="Tìm kiếm (vd: Bitcoin, ETH...)"
                value={searchTerm}
                onChange={(e) => handleCoinSearch(e.target.value)}
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

            {/* ✅ FEE RATE */}
            <div className={styles.formControl}>
              <label htmlFor="feeRate">
                Phí giao dịch (%) <span style={{ fontSize: '0.85em' }}>mặc định 0.02%</span>
              </label>
              <input
                type="number"
                id="feeRate"
                value={feeRate}
                onChange={handleFeeRateChange}
                min="0"
                max="1"
                step="0.01"
                placeholder="0.02"
              />
            </div>

            {/* ✅ LUMP SUM SECTION */}
            {(strategy === 'lump_sum' || strategy === 'hybrid') && (
              <div className={styles.section}>
                <h3>💰 Lump Sum Investment</h3>
                <div className={styles.formControls}>
                  <div className={styles.formControl}>
                    <label htmlFor="initialInvestment">Vốn đầu tư ($)</label>
                    <input
                      type="number"
                      id="initialInvestment"
                      value={lumpSum.initialInvestment}
                      onChange={(e) => setLumpSum({ ...lumpSum, initialInvestment: e.target.value })}
                      placeholder="VD: 3000"
                      step="100"
                      min="0"
                    />
                  </div>
                  <div className={styles.formControl}>
                    <label htmlFor="initialDate">Ngày đầu tư</label>
                    <input
                      type="date"
                      id="initialDate"
                      value={lumpSum.initialDate}
                      onChange={(e) => setLumpSum({ ...lumpSum, initialDate: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ✅ DCA SECTION */}
            {(strategy === 'dca_only' || strategy === 'hybrid') && (
              <div className={styles.section}>
                <h3>📈 DCA Investment</h3>
                <div className={styles.formControls}>
                  <div className={styles.formControl}>
                    <label htmlFor="monthlyInvestment">Số tiền hàng tháng ($)</label>
                    <input
                      type="number"
                      id="monthlyInvestment"
                      value={dcaInput.monthlyInvestment}
                      onChange={(e) => setDcaInput({ ...dcaInput, monthlyInvestment: e.target.value })}
                      placeholder="VD: 100"
                      step="10"
                      min="0"
                    />
                  </div>
                  <div className={styles.formControl}>
                    <label htmlFor="dcaStartDate">Ngày bắt đầu DCA</label>
                    <input
                      type="date"
                      id="dcaStartDate"
                      value={dcaInput.startDate}
                      onChange={(e) => setDcaInput({ ...dcaInput, startDate: e.target.value })}
                      max={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className={styles.formControl}>
                    <label htmlFor="dcaMonths">Số tháng</label>
                    <input
                      type="number"
                      id="dcaMonths"
                      value={dcaInput.dcaMonths}
                      onChange={(e) => setDcaInput({ ...dcaInput, dcaMonths: e.target.value })}
                      placeholder="VD: 20"
                      min="1"
                      max="120"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading || !selectedCoin}>
            {isLoading ? '⏳ Đang tính toán...' : '🚀 Xem kết quả'}
          </button>
        </form>
      )}

      {/* Result Section */}
      <div className={styles.resultSection}>
        {isLoading && <p>📊 Đang tải dữ liệu và tính toán...</p>}

        {error && <p className={styles.errorText}>{error}</p>}

        {result && (
          <>
            {/* ✅ Dynamic Message Box */}
            {message && (
              <div className={styles.messageBox}>
                <div className={styles.messageBoxHeader}>
                  {result.strategy === 'lump_sum' && '🎯 Phân tích Lump Sum'}
                  {result.strategy === 'dca_only' && '📊 Phân tích DCA'}
                  {result.strategy === 'hybrid' && '🚀 Phân tích Hybrid'}
                </div>
                <pre className={styles.resultMessage}>
                  {message}
                </pre>
              </div>
            )}

            {/* ✅ Lump Sum Details */}
            {result.lumpSum && (
              <div className={styles.detailsBox}>
                <h4>💰 Chi tiết Lump Sum</h4>
                <div className={styles.detailsGrid}>
                  <p><span>Vốn đầu tư:</span> <strong>${result.lumpSum.investment.toLocaleString()}</strong></p>
                  <p><span>Ngày đầu tư:</span> <strong>{new Date(result.lumpSum.date).toLocaleDateString('vi-VN')}</strong></p>
                  <p><span>Giá tại thời điểm:</span> <strong>${result.lumpSum.price.toFixed(2)}</strong></p>
                  <p><span>Số coin nhận được:</span> <strong>{result.lumpSum.coins.toFixed(8)}</strong></p>
                </div>
              </div>
            )}

            {/* ✅ DCA Details */}
            {result.dca && (
              <div className={styles.detailsBox}>
                <h4>📈 Chi tiết DCA</h4>
                <div className={styles.detailsGrid}>
                  <p><span>Tiền hàng tháng:</span> <strong>${result.dca.monthlyInvestment.toLocaleString()}</strong></p>
                  <p><span>Ngày bắt đầu:</span> <strong>{new Date(result.dca.dcaStartDate).toLocaleDateString('vi-VN')}</strong></p>
                  <p><span>Số tháng:</span> <strong>{result.dca.dcaMonths}</strong></p>
                  <p><span>Tổng vốn DCA:</span> <strong>${result.dca.totalInvestment.toLocaleString()}</strong></p>
                  <p><span>Tổng coin DCA:</span> <strong>{result.dca.coins.toFixed(8)}</strong></p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};