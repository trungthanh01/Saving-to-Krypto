const formatCurrency = (num) => {
  return `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Tìm giá gần nhất trong dữ liệu lịch sử cho một ngày cụ thể.
 * @param {Array<[number, number]>} historicalData - Mảng dữ liệu lịch sử [[timestamp, price]].
 * @param {Date} targetDate - Ngày cần tìm giá.
 * @returns {number | null} Giá của ngày gần nhất, hoặc null nếu không tìm thấy.
 */
const getPriceOnOrBefore = (historicalData, targetDate) => {
  const targetTimestamp = targetDate.getTime();
  let bestPrice = null;

  // Round 1: Tìm giá ngày <= target
  for (const [timestamp, price] of historicalData) {
    if (timestamp <= targetTimestamp) {
      bestPrice = price;
    } else {
      break;
    }
  }

  // Nếu tìm được -> trả về
  if (bestPrice !== null) {
    return bestPrice;
  }

  // Fallback: không có ngày <= target, lấy ngày sau
  for (const [timestamp, price] of historicalData) {
    if (timestamp > targetTimestamp) {
      return price;
    }
  }

  // Nếu vẫn không có
  return null;
};

/**
 * Tính số ngày chênh lệch giữa một ngày trong quá khứ và hiện tại.
 * @param {string | Date} startDateInput - Ngày bắt đầu (dưới dạng chuỗi hoặc đối tượng Date).
 * @returns {number} Tổng số ngày chênh lệch.
 */
export const calculateDaysBetween = (startDateInput) => {
  if (!startDateInput) return 0;

  const now = new Date();
  const startDate = new Date(startDateInput);

  if (startDate > now) return 0;

  const diffTime = now - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Tính toán kết quả hybrid - Support 3 strategies (Lump Sum, DCA Only, Hybrid)
 * @param {object} params
 * @param {Array<[number, number]>} params.historicalData - Mảng dữ liệu giá lịch sử [[timestamp, price]]
 * @param {string} params.strategy - Chiến lược ('lump_sum' | 'dca_only' | 'hybrid')
 * @param {number} params.initialInvestment - Vốn ban đầu (Lump Sum)
 * @param {string} params.initialDate - Ngày đầu tư (Lump Sum)
 * @param {number} params.monthlyInvestment - Tiền đầu tư hàng tháng (DCA)
 * @param {number} params.dcaMonths - Số tháng DCA
 * @param {number} params.feeRate - Tỷ lệ phí giao dịch (default 0.0002 = 0.02%)
 * @returns {object|null} Kết quả đầu tư kết hợp
 */
export const calculateDcaResult = ({
  historicalData,
  strategy = 'hybrid',
  // Lump Sum params
  initialInvestment = 0,
  initialDate = null,
  // DCA params
  monthlyInvestment = 0,
  dcaMonths = 0,
  // Legacy params (for backward compatibility)
  investment,
  frequency = 'monthly',
  periodDays,
  feeRate = 0.0002,
}) => {
  if (!historicalData || historicalData.length < 2) {
    console.error('❌ Invalid historicalData');
    return null;
  }

  console.log('📊 [calculateDcaResult] Input:', {
    strategy,
    historicalDataLength: historicalData.length,
    initialInvestment: initialInvestment > 0 ? formatCurrency(initialInvestment) : 'N/A',
    initialDate,
    monthlyInvestment: monthlyInvestment > 0 ? formatCurrency(monthlyInvestment) : 'N/A',
    dcaMonths: dcaMonths > 0 ? dcaMonths : 'N/A',
    feeRate: (feeRate * 100).toFixed(4) + '%',
  });

  // ======= SECTION 1: LUMP SUM CALCULATION =======
  let lumpSumResult = null;
  if (initialInvestment > 0 && initialDate) {
    const initialPrice = getPriceOnOrBefore(historicalData, new Date(initialDate));
    if (initialPrice !== null && initialPrice > 0) {
      const investmentAfterFee = initialInvestment * (1 - feeRate);
      const lumpSumCoins = investmentAfterFee / initialPrice;
      
      lumpSumResult = {
        investment: initialInvestment,
        date: initialDate,
        price: initialPrice,
        coins: lumpSumCoins
      };
      
      console.log('💰 [LUMP SUM] Calculation:', {
        investment: formatCurrency(initialInvestment),
        date: initialDate,
        price: formatCurrency(initialPrice),
        coinsAfterFee: lumpSumCoins.toFixed(8),
        feeDeducted: formatCurrency(initialInvestment * feeRate)
      });
    }
  }

  // ======= SECTION 2: DCA CALCULATION =======
  let dcaResult = null;
  if (monthlyInvestment > 0 && dcaMonths > 0) {
    // Auto-start: Nếu hybrid, DCA bắt đầu từ tháng tiếp theo sau Lump Sum
    const dcaStartDate = initialDate 
      ? addMonths(new Date(initialDate), 1) 
      : new Date()
    ;

    let dcaTotalCoins = 0;
    let dcaTotalInvested = 0;
    
    console.log('📈 [DCA] Starting calculation:', {
      startDate: dcaStartDate.toLocaleDateString('vi-VN'),
      months: dcaMonths,
      monthlyAmount: formatCurrency(monthlyInvestment)
    });

    for (let month = 0; month < dcaMonths; month++) {
      const monthDate = addMonths(dcaStartDate, month);
      const monthPrice = getPriceOnOrBefore(historicalData, monthDate);
      
      if (monthPrice !== null && monthPrice > 0) {
        const investmentAfterFee = monthlyInvestment * (1 - feeRate);
        const monthCoins = investmentAfterFee / monthPrice;
        dcaTotalCoins += monthCoins;
        dcaTotalInvested += monthlyInvestment;

        // Log chi tiết (chỉ log tháng 1, 2, 3 và 2 tháng cuối)
        if (month < 3 || month >= dcaMonths - 2) {
          console.log(`  🛒 Month ${month + 1}:`, {
            date: monthDate.toLocaleDateString('vi-VN'),
            price: formatCurrency(monthPrice),
            coins: monthCoins.toFixed(8),
            cumulative: dcaTotalCoins.toFixed(8)
          });
        }
      }
    }
    
    dcaResult = {
      monthlyInvestment,
      dcaStartDate: dcaStartDate.toISOString().split('T')[0],
      dcaMonths,
      totalInvestment: dcaTotalInvested,
      coins: dcaTotalCoins
    };
    
    console.log('📈 [DCA] Complete:', {
      totalInvestment: formatCurrency(dcaTotalInvested),
      totalCoins: dcaTotalCoins.toFixed(8)
    });
  }

  // ======= SECTION 3: MERGE RESULTS & CALCULATE TOTALS =======
  // Determine actual strategy based on results
  let strategyLabel = strategy;
  if (lumpSumResult && !dcaResult) strategyLabel = 'lump_sum';
  if (!lumpSumResult && dcaResult) strategyLabel = 'dca_only';
  if (lumpSumResult && dcaResult) strategyLabel = 'hybrid';

  const totalInvestment = 
    (lumpSumResult?.investment || 0) 
    + (dcaResult?.totalInvestment || 0)
  ;
  const totalCoins = 
    (lumpSumResult?.coins || 0) 
    + (dcaResult?.coins || 0)
  ;
  const latestPrice = historicalData[historicalData.length - 1][1];
  const totalValue = totalCoins * latestPrice;
  const profitLoss = totalValue - totalInvestment;
  
  const roi = 
    totalInvestment > 0 
    ? (profitLoss / totalInvestment) * 100 
    : 0
  ;
  
  console.log('✅ [MERGED RESULT]:', {
    strategy: strategyLabel,
    totalInvestment: formatCurrency(totalInvestment),
    totalCoins: totalCoins.toFixed(8),
    currentPrice: formatCurrency(latestPrice),
    totalValue: formatCurrency(totalValue),
    profitLoss: formatCurrency(profitLoss),
    roi: roi.toFixed(2) + '%'
  });

  // ======= RETURN OBJECT =======
  return {
    strategy: strategyLabel,
    lumpSum: lumpSumResult,
    dca: dcaResult,
    totalInvestment,
    totalCoins,
    totalValue,
    profitLoss,
    roi,
    latestPrice,
    // Backward compatibility
    validBuys: (lumpSumResult ? 1 : 0) + (dcaResult?.dcaMonths || 0),
    currentValue: totalValue,
    roiPct: roi,
    feeRate
  };
};

/**
 * Chuyển đổi dữ liệu lịch sử từ CryptoCompare sang định dạng chuẩn [[timestamp, price]].
 * @param {Array<object>} cryptoCompareData - Mảng dữ liệu từ API CryptoCompare.
 * @returns {Array<[number, number]>}
 */
export const transformCryptoCompareData = (cryptoCompareData) => {
  if (!cryptoCompareData) return [];
  return cryptoCompareData.map(dayData => [
    dayData.time * 1000, // CryptoCompare: timestamp theo giây → mili giây
    dayData.close, // Giá đóng cửa của ngày hôm đó
  ]);
};