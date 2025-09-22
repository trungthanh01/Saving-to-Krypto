import axios from 'axios';

export const fetchCoinData = async (coinIds) => {
  if (!coinIds || coinIds.length === 0) {
    return [];
  }
  const coinListString = coinIds.join(',');
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinListString}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ CoinGecko API:", error);
    throw error;
  }
};








