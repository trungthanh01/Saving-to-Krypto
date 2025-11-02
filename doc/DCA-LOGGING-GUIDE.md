# 🎯 DCA Calculator - Logging & Debug Guide

**Nhanh & Đơn giản - Tham khảo khi cần**

---

## 📱 Quick Start: Mở Console

| OS | Cách làm |
|--------|----------|
| **Windows/Linux** | Nhấn `F12` → `Console` tab |
| **Mac** | `Cmd + Option + J` → `Console` tab |
| **Safari** | Menu → Develop → Show Web Inspector → Console |

---

## 🔧 Copy-Paste Code Templates

### Template 1: Log API Response (DcaCalculator.jsx)

```javascript
// Đặt trong handleSubmit() sau khi gọi fetchCoinHistory()
const rawHistoricalData = await fetchCoinHistory(inputs.coinId, diffDays);

console.log('🔗 [API] Raw response:', {
  coinId: inputs.coinId,
  requestedDays: diffDays,
  receivedDataPoints: rawHistoricalData?.length || 0,
  firstItem: rawHistoricalData?.[0],
  lastItem: rawHistoricalData?.[rawHistoricalData.length - 1],
});

// Expected:
// - receivedDataPoints: 2000 (max limit)
// - firstItem.time: 1509168000 (Nov 9, 2017 in Unix)
// - lastItem.time: 1757500800 (Sep 12, 2025 in Unix)
```

### Template 2: Log Transformed Data (DcaCalculator.jsx)

```javascript
// Đặt sau khi transform data
const historicalData = transformCryptoCompareData(rawHistoricalData);

console.log('🔄 [TRANSFORM] Transformed data:', {
  transformedLength: historicalData.length,
  firstItem: historicalData?.[0],  // [timestamp_ms, price]
  lastItem: historicalData?.[historicalData.length - 1],
  sample: historicalData?.slice(0, 3),
});

// Expected:
// - firstItem[0]: 1509168000000 (milliseconds)
// - firstItem[1]: 0.25 (price)
```

### Template 3: Log Input Parameters (dca-calculator.js)

```javascript
// Đặt ở đầu hàm calculateDcaResult()
console.log('📊 [DCA] Input params:', {
  historicalDataLength: historicalData.length,
  investment: investment,
  frequency: frequency,
  periodDays: periodDays,
  feeRate: (feeRate * 100).toFixed(4) + '%',
});
```

### Template 4: Log Final Result (dca-calculator.js)

```javascript
// Đặt trước return statement
console.log('✅ [DCA] Result:', {
  totalInvested: '$' + totalInvested.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  totalCoins: totalCoins.toFixed(8),
  currentValue: '$' + currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  profitLoss: '$' + profitLoss.toLocaleString('en-US', { maximumFractionDigits: 2 }),
  roiPct: roiPct.toFixed(2) + '%',
  validBuys: validBuys,
  skippedBuys: skippedBuys,
});

// Compare with website:
// Website: $14,960
// App: $?
```

---

## 📊 Console Output Examples

### Good Output 🟢

```
🔗 [API] Raw response: Object
  coinId: "LINK"
  receivedDataPoints: 2000  ✓
  firstItem: {time: 1509168000, close: 0.25, ...}
  lastItem: {time: 1757500800, close: 28.45, ...}

🔄 [TRANSFORM] Transformed data: Object
  transformedLength: 2000
  firstItem: Array(2) [1509168000000, 0.25]
  lastItem: Array(2) [1757500800000, 28.45]

📊 [DCA] Input params: Object
  historicalDataLength: 2000
  investment: 10
  frequency: "monthly"
  periodDays: 2868
  feeRate: "0.02%"

✅ [DCA] Result: Object
  totalInvested: "$950"
  totalCoins: "33.65000000"
  currentValue: "$14,960"
  profitLoss: "$14,010"
  roiPct: "1475.26%"
  validBuys: 95
  skippedBuys: 0
```

### Bad Output 🔴

```
🔗 [API] Raw response: Object
  receivedDataPoints: 500  ❌ Quá ít data (chỉ có 500 thay vì 2000)
  firstItem: undefined  ❌ API error

🔄 [TRANSFORM] Transformed data: Object
  transformedLength: 0  ❌ Transform thất bại

✅ [DCA] Result: Object
  currentValue: "$2,452.88"  ❌ Sai (so với website $14,960)
```

---

## 🔍 Cách Inspect Console Output

### Method 1: Expand Object

1. Console sẽ show: `🟐 [API] Raw response: Object`
2. **Click vào mũi tên `▶`** phía trước để expand
3. Xem chi tiết các properties

### Method 2: Store as Variable

1. Right-click object → **"Store as global variable"**
2. Console sẽ gán nó vào `temp1`, `temp2`, etc.
3. Type `temp1` → xem toàn bộ object

### Method 3: Filter & Search

1. Dùng search box (Ctrl+F) trong Console
2. Tìm `🔗 [API]` để xem API logs
3. Tìm `✅ [DCA]` để xem kết quả cuối

---

## 🐛 Debug Checklist

### Khi kết quả SAI (app ≠ website):

- [ ] **Check API Data:**
  - receivedDataPoints = 2000? Nếu không → API limit issue
  - firstItem.time = 1509168000? Nếu không → sai ngày
  - lastItem.time = 1757500800? Nếu không → sai ngày

- [ ] **Check Transform:**
  - transformedLength = receivedDataPoints? Nếu không → transform bug
  - firstItem[0] có 000 ở cuối? Nếu không → timestamp sai format

- [ ] **Check Calculation:**
  - feeRate = 0.0002? Nếu không → phí sai
  - validBuys = 95? Nếu > 95 → có vấn đề
  - skippedBuys = 0? Nếu > 0 → missing data

- [ ] **Compare Logic:**
  - Công thức: `coinsBought = (investment * (1 - feeRate)) / price`?
  - Nếu xóa fee → kết quả có gần hơn không?

---

## 💡 Pro Tips

### Tip 1: Dùng Emoji để Tìm Nhanh
```javascript
// Dễ tìm trong Console
console.log('🔗 API...');      // API calls
console.log('🔄 TRANSFORM...'); // Data transformation
console.log('📊 DCA...');       // DCA logic
console.log('✅ SUCCESS...');   // Results
console.log('❌ ERROR...');     // Errors
```

### Tip 2: Format Tiền Tệ Đẹp
```javascript
// Instead of: 14960
// Use: '$14,960'
const formatted = '$' + totalInvested.toLocaleString('en-US', { 
  maximumFractionDigits: 2 
});
console.log(formatted); // Output: $14,960.00
```

### Tip 3: Log Objects thay vì Strings
```javascript
// ❌ Tệ - khó đọc
console.log('Total: ' + result.totalInvested + ', Value: ' + result.currentValue);

// ✅ Tốt - dễ đọc, dễ expand
console.log('Result:', {
  total: result.totalInvested,
  value: result.currentValue,
});
```

### Tip 4: Conditional Logging
```javascript
// Chỉ log khi dev mode
if (process.env.NODE_ENV === 'development') {
  console.log('📊 Debug info:', data);
}

// Hoặc dùng flag
const DEBUG = true;
if (DEBUG) console.log('...data...');
```

---

## 📝 Logging Checklist cho Task 11.2 & 11.3

### Khi viết `calculateDcaResult()`:
- [ ] Log input params ở đầu
- [ ] Log từng bước trong while loop (3 lần đầu + 3 lần cuối)
- [ ] Log final result trước return
- [ ] Format tiền tệ đẹp ($14,960 thay vì 14960)
- [ ] Dùng emoji để dễ tìm

### Khi viết `DcaCalculator.jsx`:
- [ ] Log raw API response ngay sau fetchCoinHistory()
- [ ] Log transformed data ngay sau transformCryptoCompareData()
- [ ] Log input params trước gọi calculateDcaResult()
- [ ] Log final result sau khi nhận return
- [ ] Compare với website reference

---

## 🚀 Next Steps

1. **Copy templates trên** vào code
2. **Chạy app:** `npm run dev`
3. **Mở Console:** F12 → Console tab
4. **Trigger test:** Chọn LINK, từ 2017-11-09, nhấn "Xem kết quả"
5. **Xem logs:** Tìm 🔗, 🔄, 📊, ✅ theo thứ tự
6. **Debug:** Nếu sai, kiểm tra từng step theo checklist
7. **Compare:** $14,960 (website) vs ? (app)

---

**Happy Debugging! 🎉**
