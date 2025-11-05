// Format Message

export function formatCurrency(num) {
    return `$${num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }
  
  export function formatCoins(num) {
    return num.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }
  
  export function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  export function formatROI(num) {
    const sign = num >= 0 ? "+" : "-";
    const emoji = num >= 0 ? "✅" : "❌";
    return `${sign}${Math.abs(num).toFixed(2)}% ${emoji}`;
  }
  
  // Mock data Test
  const mockLumpSum = {
    strategy: 'lump_sum',
    lumpSum: { investment: 3000, date: '2024-01-01', price: 10 },
    totalInvestment: 3000,
    totalCoins: 300,
    totalValue: 4650,
    roi: 55,
    coin: 'LINK'
  };
  
  // Function Message - ✨ NHẬN result LÀM PARAMETER
  export function generateResultMessage(result) {
    // Input
    const {
      strategy,
      lumpSum,
      dca,
      totalInvestment,
      totalCoins,
      totalValue,
      roi,
      coin
    } = result;
  
    // Process
    const profitLoss = totalValue - totalInvestment;
    const profitLossSign = profitLoss >= 0 ? "profit" : "loss";
  
    // Output - Strategy Message Template
    // LumpSum
    if (strategy === 'lump_sum') {
      return `
        🎯 Kết quả Giả lập Lump Sum
        
        Nếu bạn đầu tư ban đầu với vốn ${formatCurrency(lumpSum.investment)} vào ${coin} vào ngày ${formatDate(lumpSum.date)}, bây giờ bạn sẽ có:
        
        💰 ${formatCoins(totalCoins)} ${coin}
        
        Tổng vốn đầu tư: ${formatCurrency(totalInvestment)}
        Giá trị hiện tại: ${formatCurrency(totalValue)}
        ${profitLossSign.toUpperCase()}: ${formatCurrency(Math.abs(profitLoss))}
        ROI: ${formatROI(roi)}
            
        `.trim();
    }
  
    // DCA
    if (strategy === 'dca_only') {
      return `
        📊 Kết quả Giả lập DCA
        
        Nếu bạn đã đầu tư ${formatCurrency(dca.monthlyInvestment)} mỗi tháng vào ${coin}
        kể từ ngày ${formatDate(dca.dcaStartDate)} (trong ${dca.dcaMonths} tháng)
        với phí 0.02%
        
        bây giờ bạn sẽ có:
        
        💰 ${formatCoins(totalCoins)} ${coin}
        
        Tổng vốn đầu tư: ${formatCurrency(totalInvestment)}
        Giá trị hiện tại: ${formatCurrency(totalValue)}
        ${profitLossSign.toUpperCase()}: ${formatCurrency(Math.abs(profitLoss))}
        ROI: ${formatROI(roi)}
            
        `.trim();
    }
  
    // Hybrid: Lumpsum + DCA
    if (strategy === 'hybrid') {
      return `
        🚀 Kết quả Giả lập Hybrid Investment
        
        Nếu bạn đầu tư ban đầu với vốn ${formatCurrency(lumpSum.investment)} vào ${coin}
        vào ngày ${formatDate(lumpSum.date)}
        
        ✨ và tiếp tục DCA ${formatCurrency(dca.monthlyInvestment)} mỗi tháng
        kể từ ngày ${formatDate(dca.dcaStartDate)} (trong ${dca.dcaMonths} tháng)
        với phí 0.02%
        
        bây giờ bạn sẽ có:
        
        💰 ${formatCoins(totalCoins)} ${coin}
        
        Tổng vốn đầu tư: ${formatCurrency(totalInvestment)}
        Giá trị hiện tại: ${formatCurrency(totalValue)}
        ${profitLossSign.toUpperCase()}: ${formatCurrency(Math.abs(profitLoss))}
        ROI: ${formatROI(roi)}
            
        `.trim();
    }
  }
  
  // 🧪 TEST SECTION
  console.log('Testing generateResultMessage with mockLumpSum:');
  console.log(generateResultMessage(mockLumpSum));