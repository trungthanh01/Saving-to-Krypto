import axios from 'axios';

// ✅ BƯỚC 1: Thay đổi Base URL
const PAPRIKA_API_BASE_URL = 'https://api.coinpaprika.com/v1';

/**
 * Lấy danh sách coin từ CoinPaprika và chuyển đổi về định dạng chuẩn của ứng dụng.
 * @returns {Promise<Array<{id: string, symbol: string, name: string, image: string}>>}
 */
export const fetchCoinList = async () => {
  const url = `${PAPRIKA_API_BASE_URL}/coins`;
  try {
    const response = await axios.get(url);
    // ✅ BƯỚC 2: "Biên dịch" dữ liệu
    // Lấy 250 coin đầu tiên và chuyển đổi key cho phù hợp với app của chúng ta
    const transformedList = response.data.slice(0, 250).map(coin => ({
      id: coin.id,
      symbol: coin.symbol,
      name: coin.name,
      // CoinPaprika không có sẵn 'image', chúng ta sẽ dùng logo từ một nguồn khác sau
      // Tạm thời để trống hoặc dùng một placeholder
      image: `https://static.coinpaprika.com/coin/${coin.id}/logo.png` 
    }));
    return transformedList;
  } catch (error) {
    console.error("Lỗi khi lấy coin list từ CoinPaprika API:", error);
    throw error;
  }
};

/**
 * Lấy dữ liệu lịch sử giá cho một đồng coin cụ thể từ CoinPaprika.
 * @param {string} coinId - ID của coin (ví dụ: 'btc-bitcoin').
 * @param {string} startDate - Ngày bắt đầu theo định dạng 'YYYY-MM-DD'.
 * @returns {Promise<Array<{time_close: string, close: number}>>}
 */
export const fetchCoinHistory = async (coinId, startDate) => {
  if (!coinId || !startDate) {
    console.warn("fetchCoinHistory: cần coinId và startDate.");
    return [];
  }
  const url = `${PAPRIKA_API_BASE_URL}/coins/${coinId}/ohlcv/historical`;
  try {
    const response = await axios.get(url, {
      params: {
        start: startDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Không lấy được dữ liệu giá lịch sử cho ${coinId} từ Paprika`, error);
    throw error;
  }
};

// Chúng ta có thể xóa các hàm cũ của CoinGecko hoặc comment chúng lại
/*
export const fetchCoinData = ...
*/







