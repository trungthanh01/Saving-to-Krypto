# 📋 Task 11.2 & 11.3 - Summary & Action Plan

**Status:** 🔴 IN PROGRESS (2025-11-02)  
**Estimated Duration:** 3-4 hours  
**Difficulty:** ⭐⭐⭐ Intermediate

---

## 🎯 What You Need to Do

### **Task 11.2: Fix DCA Calculation Logic** (dca-calculator.js)

#### What's Wrong Now?
- 🔴 Using `findClosestPrice()` → finds ANY closest price (before or after)
- 🔴 NO fee calculation → ignoring 0.02% transaction fee
- 🔴 NO metadata tracking → can't see how many buys/skips

#### What You'll Fix
1. ✅ Replace `findClosestPrice()` with `getPriceOnOrBefore()` - always get price from ON or BEFORE target date
2. ✅ Add `feeRate` parameter - default 0.02%
3. ✅ Track `validBuys` & `skippedBuys` - for debugging
4. ✅ Track `buyHistory` - detailed record of each purchase
5. ✅ Calculate `roiPct` - show ROI percentage
6. ✅ Add `console.log()` statements - for easy debugging

#### Files to Modify
- `savvy-app/src/utils/dca-calculator.js` - Core calculation logic

#### Expected Output (Console)
```
📊 [DCA] Input params: { ... }
✅ [DCA] Result: {
  totalInvested: "$950",
  totalCoins: "33.65",
  currentValue: "$14,960",  ← Should match website
  profitLoss: "$14,010",
  roiPct: "1475.26%",
  validBuys: 95,
  skippedBuys: 0
}
```

---

### **Task 11.3: Update UI Component** (DcaCalculator.jsx)

#### What's Missing Now?
- 🔴 NO fee input field - user can't change fee rate
- 🔴 NO metadata display - user doesn't see ROI% or buy count
- 🔴 NO logging - hard to debug when result is wrong

#### What You'll Add
1. ✅ Add `feeRate` state (mặc định 0.02%)
2. ✅ Add fee input field in the form
3. ✅ Update `handleSubmit()` to pass `feeRate` to calculator
4. ✅ Display metadata (ROI%, buy count, coin total)
5. ✅ Add `console.log()` statements for debugging
   - Log API response (raw data)
   - Log transformed data
   - Log input parameters
   - Log final result

#### Files to Modify
- `savvy-app/src/components/dca/DcaCalculator.jsx` - UI & logging

---

## 📚 Reference Documents

I've created 2 new guides for you:

### 1. **doc/detail-task.md** (Main Task Document)
   - Contains detailed sub-tasks (11.2.1 through 11.3.6)
   - Each sub-task has:
     - Purpose (Mục đích)
     - How to do it (Cách làm)
     - Tips & tricks
   - **👉 READ THIS FIRST before coding**

### 2. **doc/DCA-LOGGING-GUIDE.md** (Quick Reference)
   - Copy-paste code templates
   - Console.log examples (Good vs Bad)
   - Debug checklist
   - Pro tips for debugging
   - **👉 REFER TO THIS while coding**

---

## 🚀 Step-by-Step Workflow

### Phase 1: Read & Understand (20 mins)
- [ ] Read `doc/detail-task.md` section "Task 11.2 & 11.3"
- [ ] Read `doc/DCA-LOGGING-GUIDE.md` to understand logging strategy
- [ ] Understand the math: `coinsBought = (investment * (1 - feeRate)) / price`

### Phase 2: Code Task 11.2 (1-1.5 hours)
- [ ] **11.2.1:** Replace `findClosestPrice()` → `getPriceOnOrBefore()`
  - Delete old function (lines 7-22)
  - Write new function with on-or-before logic
  - Test mentally with example dates

- [ ] **11.2.2:** Add `feeRate` parameter
  - Default value: `0.0002` (which is 0.02%)
  - Modify coin buying formula

- [ ] **11.2.3:** Add metadata tracking
  - Initialize `validBuys`, `skippedBuys`
  - Increment them in the loop

- [ ] **11.2.4:** Track `buyHistory`
  - Create array
  - Push object for each successful buy

- [ ] **11.2.5:** Calculate & return `roiPct`
  - Formula: `(profitLoss / totalInvested) * 100`

- [ ] **11.2.6:** Add `console.log()` statements
  - Copy templates from `DCA-LOGGING-GUIDE.md`
  - Log at start, during loop, at end

### Phase 3: Code Task 11.3 (1-1.5 hours)
- [ ] **11.3.1:** Add `feeRate` to state
  - Find `useState(inputs)` around line 12
  - Add: `feeRate: 0.02`

- [ ] **11.3.2:** Add fee input field
  - Copy template from guide
  - Paste after startDate input

- [ ] **11.3.3:** Update `handleSubmit()`
  - Find calculateDcaResult call
  - Add: `feeRate: inputs.feeRate / 100`

- [ ] **11.3.4:** Display metadata in result
  - Show ROI% 
  - Show buy count
  - Show current coin price
  - Show total coins held

- [ ] **11.3.5:** Add API logging
  - Log API response
  - Log transformed data
  - Copy templates from guide

- [ ] **11.3.6:** Test & Debug
  - Run app: `npm run dev`
  - Test with LINK example
  - Check console logs
  - Compare result with website

### Phase 4: Verify & Submit (30 mins)
- [ ] Check no compilation errors
- [ ] Test flow end-to-end
- [ ] Verify console logs are clear
- [ ] Compare: App result ≈ Website result?
- [ ] Update `detail-task.md` ✅ marks when complete

---

## 🔍 Test Case: LINK (2017-11-09 → 2025-09-12)

**Input:**
- Coin: LINK (Chainlink)
- Start Date: November 9, 2017
- End Date: September 12, 2025
- Investment per month: $10
- Frequency: Monthly
- Fee: 0.02%

**Expected Result:**
```
✅ Total Invested: $950 (or $960 if you include rounding)
✅ Total Coins: ~33-34 LINK
✅ Current Value: ~$14,960
✅ Profit/Loss: ~$14,010
✅ ROI %: ~1,475%
✅ Valid Buys: ~94-95
✅ Skipped Buys: 0
```

**Website Reference:**
- https://dcacryptocalculator.com/chainlink?start_date=2017-11-09&finish_date=2025-09-12&regular_investment=10&currency_code=USD&investment_interval=monthly&exchange_fee=0.02
- Shows: "$14,960" & "+1,475.04%"

---

## 📊 Console Output Check

When you run the test, you should see in Console (F12):

```
🔗 [API] Raw response: Object
  ▶ receivedDataPoints: 2000
  ▶ firstItem: {time: 1509168000, close: 0.25, ...}

🔄 [TRANSFORM] Transformed data: Object
  ▶ transformedLength: 2000
  ▶ firstItem: [1509168000000, 0.25]

📊 [DCA] Input params: Object
  ▶ historicalDataLength: 2000
  ▶ feeRate: "0.02%"

✅ [DCA] Result: Object
  ✓ totalInvested: "$950"
  ✓ currentValue: "$14,960"  ← KEY: Should match website!
  ✓ roiPct: "1475.26%"
  ✓ validBuys: 95
  ✓ skippedBuys: 0
```

---

## 🐛 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| Result = $2,452 (old wrong value) | You're using old logic, double-check fee calculation |
| API returns 0 data points | API error, check internet connection |
| validBuys = 94 instead of 95 | Check `getPriceOnOrBefore()` logic, might be off-by-one |
| ROI % way too high/low | Check fee calculation: should be `0.0002` not `0.02` |
| Console logs don't show | Make sure you put `console.log()` in the right place |

---

## ✅ Completion Checklist

### Code Quality
- [ ] No compilation errors
- [ ] No ESLint warnings
- [ ] Code is readable and well-commented

### Functionality
- [ ] Task 11.2 done (calculation logic fixed)
- [ ] Task 11.3 done (UI updated with logging)
- [ ] Fee input works
- [ ] Metadata displays correctly
- [ ] console.log() outputs are clear

### Testing
- [ ] Test with LINK example
- [ ] Result ≈ Website reference
- [ ] Console logs show all 4 stages (API, Transform, Params, Result)
- [ ] No JavaScript errors in console

### Documentation
- [ ] Updated `detail-task.md` with ✅ marks
- [ ] All console.log() messages are clear with emoji prefix
- [ ] Code has inline comments explaining the logic

---

## 📞 Questions?

If you get stuck:

1. **Check the guides:**
   - `doc/DCA-LOGGING-GUIDE.md` for logging templates
   - `doc/detail-task.md` for detailed steps

2. **Debug in Console:**
   - Open DevTools (F12)
   - Look for 🔗, 🔄, 📊, ✅ messages
   - Expand objects to see values

3. **Compare with Reference:**
   - Website: $14,960
   - Your app: How much?
   - Difference tells you what's wrong

---

## 🎯 Remember

> **"Write code with your own hands to truly learn it."** - Senior Dev Mentor

Good luck! You've got this! 💪🚀
