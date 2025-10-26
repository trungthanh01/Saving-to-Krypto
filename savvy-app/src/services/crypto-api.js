import axios from 'axios';

const CRYPTOCOMPARE_API_BASE_URL = 'https://min-api.cryptocompare.com';
const CRYPTOCOMPARE_IMAGE_BASE_URL = 'https://www.cryptocompare.com';

/**
 * Lấy danh sách các coin phổ biến nhất từ CryptoCompare.
 */
export const fetchCoinList = async () => {
  // Lấy top 100 coin theo Market Cap
  const url = `${CRYPTOCOMPARE_API_BASE_URL}/data/top/mktcapfull?limit=100&tsym=USD`;
  try {
    const response = await axios.get(url);
    const coinData = response.data.Data;

    const transformedList = coinData.map(data => ({
      // Định danh chính giờ là Symbol
      id: data.CoinInfo.Name, 
      symbol: data.CoinInfo.Name, // vd: "BTC"
      name: data.CoinInfo.FullName,
      image: `${CRYPTOCOMPARE_IMAGE_BASE_URL}${data.CoinInfo.ImageUrl}`,
    }));
    return transformedList;
  } catch (error) {
    console.error("Lỗi khi lấy coin list từ CryptoCompare API:", error);
    throw error;
  }
};


/**
 * Lấy dữ liệu thị trường hiện tại cho một danh sách coin.
 */
export const fetchCoinData = async (coinSymbols) => {
  if (!coinSymbols || coinSymbols.length === 0) {
    return [];
  }
  const symbolsString = coinSymbols.join(',');
  const url = `${CRYPTOCOMPARE_API_BASE_URL}/data/pricemultifull?fsyms=${symbolsString}&tsyms=USD`;

  try {
    const response = await axios.get(url);
    const rawData = response.data.RAW;
    
    // ✅ BƯỚC BẢO VỆ
    if (!rawData) {
      console.warn("API không trả về dữ liệu 'RAW'. Có thể do các symbol không hợp lệ:", coinSymbols);
      return []; // Trả về mảng rỗng để tránh lỗi
    }
    
    // CryptoCompare trả về một object, chúng ta cần chuyển nó thành mảng
    const transformedData = Object.keys(rawData).map(symbol => {
      const coin = rawData[symbol].USD;
      return {
        id: symbol, // Sử dụng Symbol làm id
        symbol: symbol.toLowerCase(),
        name: '', // API này không trả về tên đầy đủ, nhưng chúng ta có nó từ coinList
        image: `${CRYPTOCOMPARE_IMAGE_BASE_URL}${coin.IMAGEURL}`,
        current_price: coin.PRICE,
        market_cap: coin.MKTCAP,
        price_change_percentage_24h: coin.CHANGEPCT24HOUR,
      };
    });
    return transformedData;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu tickers từ CryptoCompare:", error);
    throw error;
  }
};


/**
 * Lấy dữ liệu lịch sử giá cho một đồng coin.
 */
export const fetchCoinHistory = async (coinSymbol, days) => {
  if (!coinSymbol || !days) {
    return [];
  }
  // Giới hạn miễn phí là 2000 ngày
  const limit = Math.min(days, 2000); 
  const url = `${CRYPTOCOMPARE_API_BASE_URL}/data/v2/histoday?fsym=${coinSymbol}&tsym=USD&limit=${limit}`;

  try {
    const response = await axios.get(url);
    return response.data.Data.Data; // Dữ liệu nằm khá sâu trong object trả về
  } catch (error) {
    console.error(`Lỗi khi lấy dữ liệu lịch sử cho ${coinSymbol}:`, error);
    throw error;
  }
};







