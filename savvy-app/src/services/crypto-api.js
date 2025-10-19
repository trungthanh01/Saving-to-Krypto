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

export const fetchCoinList = async () => {
  const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error HTTP! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Lỗi khi lấy coin list từ CoinGecko API:", error);
    throw error;
  }
}







