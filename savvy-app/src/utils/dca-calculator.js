/**
 * Tìm giá gần nhất trong dữ liệu lịch sử cho một ngày cụ thể.
 * @param {Array<[number, number]>} historicalData - Mảng dữ liệu lịch sử [[timestamp, price]].
 * @param {Date} targetDate - Ngày cần tìm giá.
 * @returns {number | null} Giá của ngày gần nhất, hoặc null nếu không tìm thấy.
 */
const findClosestPrice = (historicalData, targetDate) => {
  const targetTimestamp = targetDate.getTime();
  let closestEntry = null;
  let smallestDiff = Infinity;

  for (const entry of historicalData) {
    const [timestamp, price] = entry;
    const diff = Math.abs(timestamp - targetTimestamp);

    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestEntry = entry;
    }
  }
  return closestEntry ? closestEntry[1] : null;
};

/**
 * Tính toán kết quả của chiến lược đầu tư trung bình giá (DCA).
 * @param {object} params
 * @param {Array<[number, number]>} params.historicalData - Mảng dữ liệu giá lịch sử.
 * @param {number} params.investment - Số tiền đầu tư mỗi lần.
 * @param {string} params.frequency - Tần suất ('monthly' hoặc 'weekly').
 * @param {number} params.periodDays - Khoảng thời gian đầu tư tính bằng ngày (ví dụ: 365*3 cho 3 năm).
 * @returns {{totalInvested: number, totalCoins: number, currentValue: number, profitLoss: number} | null}
 */
export const calculateDcaResult = ({
  historicalData,
  investment,
  frequency = 'monthly',
  periodDays,
}) => {
  if (!historicalData || historicalData.length < 2) {
    return null;
  }

  const now = new Date();
  const startDate = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);

  let totalInvested = 0;
  let totalCoins = 0;
  let currentDate = new Date(startDate);

  while (currentDate <= now) {
    const price = findClosestPrice(historicalData, currentDate);

    if (price !== null && price > 0) {
      const coinsBought = investment / price;
      totalCoins += coinsBought;
      totalInvested += investment;
    }

    if (frequency === 'monthly') {
      currentDate.setMonth(currentDate.getMonth() + 1);
    } else { // weekly
      currentDate.setDate(currentDate.getDate() + 7);
    }
  }

  const latestPrice = historicalData[historicalData.length - 1][1];
  const currentValue = totalCoins * latestPrice;
  const profitLoss = currentValue - totalInvested;

  return {
    totalInvested,
    totalCoins,
    currentValue,
    profitLoss,
  };
};       
