import axios from 'axios';
const API_BASE_URL =`https://api.coingecko.com/api/v3`;
export const fetchCoinData = async (coinIds) => {
  if (!coinIds || coinIds.length === 0) {
    return [];
  }
  const coinListString = coinIds.join(',');
  const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&ids=${coinListString}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ CoinGecko API:", error);
    throw error;
  }
};

export const fetchCoinList = async () => {
  const url = `${API_BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false`;
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

export const fetchCoinHistory = async (coinId, days = 365) => {
  if (!coinId) {
    console.warn("fetchCoinHistory: coinId không được cung cấp.");
    return [];
  }

  const url = `${API_BASE_URL}/coins/${coinId}/market_chart`;

  try {
    const response = await axios.get(url, {
      params: {
        vs_currency: "usd",
        days: days,
      },
    });
    return response.data.prices;
  } catch (error) {
    console.error(`Không lấy được dữ liệu giá lịch sử cho ${coinId}`, error);
    throw error;
  }
};







