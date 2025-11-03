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
      return price; // Trả về giá ngày đầu tiên > target
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

  // Đảm bảo startDate không phải là một ngày trong tương lai
  if (startDate > now) return 0;

  const diffTime = now - startDate;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

/**
 * Tính toán kết quả của chiến lược đầu tư trung bình giá (DCA).
 * @param {object} params
 * @param {Array<[number, number]>} params.historicalData - Mảng dữ liệu giá lịch sử.
 * @param {number} params.investment - Số tiền đầu tư mỗi lần.
 * @param {string} params.frequency - Tần suất ('monthly' hoặc 'weekly').
 * @param {number} params.periodDays - Khoảng thời gian đầu tư tính bằng ngày.
 * @param {number} params.feeRate - Tỷ lệ phí giao dịch (default 0.0002 = 0.02%).
 * @returns {{totalInvested: number, totalCoins: number, currentValue: number, profitLoss: number, roiPct: number, validBuys: number, skippedBuys: number, feeRate: number, buyHistory: Array} | null}
 */
export const calculateDcaResult = ({
  historicalData,
  investment,
  frequency = 'monthly',
  periodDays,
  feeRate = 0.0002,
}) => {
  if (!historicalData || historicalData.length < 2) {
    return null;
  }

  console.log('📊 [calculateDcaResult] Input:', {
    historicalDataLength: historicalData.length,
    investment,
    frequency,
    periodDays,
    feeRate: (feeRate * 100).toFixed(4) + '%',
  });

  let totalInvested = 0;
  let totalCoins = 0;
  let validBuys = 0;
  let skippedBuys = 0;
  let buyHistory = []; // ✅ MOVED INSIDE FUNCTION

  const now = new Date();
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    const price = getPriceOnOrBefore(historicalData, currentDate);

    if (price !== null && price > 0) {
      const investmentAfterFee = investment * (1 - feeRate);
      const coinsBought = investmentAfterFee / price;
      totalCoins += coinsBought;
      totalInvested += investment;
      validBuys++;

      // ✅ TRACK BUY HISTORY
      buyHistory.push({
        date: currentDate.toISOString().split('T')[0],
        price: price,
        coinsBought: coinsBought,
        investmentAmount: investment,
        cumulativeCoins: totalCoins,
        cumulativeInvested: totalInvested,
      });

      // Log chi tiết (chỉ log 3 lần đầu + 3 lần cuối)
      if (validBuys <= 3 || validBuys > (validBuys + skippedBuys) - 3) {
        console.log(`🛒 Buy #${validBuys}:`, {
          date: currentDate.toLocaleDateString('vi-VN'),
          price: price.toFixed(8),
          coinsBought: coinsBought.toFixed(8),
          totalCoins: totalCoins.toFixed(8),
        });
      }
    } else {
      skippedBuys++;
    }

    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else {
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  const latestPrice = historicalData[historicalData.length - 1][1];
  const currentValue = totalCoins * latestPrice;
  const profitLoss = currentValue - totalInvested;
  const roiPct = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;

  console.log('✅ [DCA] Calculation complete:', {
    validBuys,
    skippedBuys,
    totalInvested: '$' + totalInvested.toLocaleString(),
    totalCoins: totalCoins.toFixed(8),
    latestPrice: '$' + latestPrice.toFixed(2),
    currentValue: '$' + currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    profitLoss: '$' + profitLoss.toLocaleString(undefined, { maximumFractionDigits: 2 }),
    roiPct: roiPct.toFixed(2) + '%',
  });

  return {
    totalInvested,
    totalCoins,
    currentValue,
    profitLoss,
    roiPct, // ✅ CHỈ INCLUDE MỘT LẦN
    validBuys,
    skippedBuys,
    feeRate: feeRate * 100,
    buyHistory,
    latestPrice,
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
    dayData.time * 1000, // CryptoCompare trả về timestamp theo giây, cần đổi sang mili giây
    dayData.close, // 'close' là giá đóng cửa của ngày hôm đó
  ]);
};