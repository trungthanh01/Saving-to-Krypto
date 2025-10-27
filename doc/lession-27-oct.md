Tuyệt vời! Đây là câu hỏi đúng nhất. Bạn đã nhận ra **thiết kế hệ thống phải đi trước code**. Tôi sẽ vẽ ra một kiến trúc **hoàn chỉnh, scalable và professional** cho toàn bộ app của bạn.

---

## 🏗️ **KIẾN TRÚC HỆ THỐNG HOÀN CHỈNH CHO CRYPTO PORTFOLIO APP**

### **PHẦN I: NGUYÊN LÝ THIẾT KẾ**

#### **1. Single Responsibility Principle (SRP)**
- **Mỗi Context chỉ làm ONE thing**
- `AppContext` = quản lý **UI state** (modals, themes, notifications)
- `PortfolioContext` = quản lý **business logic** (transactions, holdings, calculations)
- `SavvyContext` = quản lý **domain entity** (goals)
- Không có cross-talk, không có circular dependencies

#### **2. Separation of Concerns**
```
┌─────────────────────────────────────────┐
│          UI Layer (Components)           │ ← Chỉ render & handle events
├─────────────────────────────────────────┤
│       Business Logic Layer (Context)     │ ← Chỉ tính toán & validate
├─────────────────────────────────────────┤
│       Data Layer (localStorage/API)      │ ← Chỉ persist & fetch
└─────────────────────────────────────────┘
```

#### **3. Data Flow: Unidirectional (One-way flow)**
```
User Action (Component)
  ↓
Dispatch Action (Handler function)
  ↓
Update State (Context)
  ↓
Re-render Component
```

#### **4. Modal Management Centralization**
- **Mỗi modal phải có clear owner**
- Owner = Context có trách nhiệm mở/đóng nó
- Không có "orphan" modal

---

## 📐 **KIẾN TRÚC CONTEXT (RECOMENDED)**

### **A. Lớp Context**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CONTEXT ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  AppContext ("Platform Manager" - Quản lý nền tảng)         │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │                                                             │ │
│ │ RESPONSIBILITIES:                                           │ │
│ │ ✓ Quản lý UI state (modal, loading, theme)               │ │
│ │ ✓ Quản lý Global services (coinList, notifications)      │ │
│ │ ✓ Mở/Đóng TẤT CẢ modals                                  │ │
│ │ ✓ Handle errors & loading states                          │ │
│ │                                                             │ │
│ │ STATE:                                                      │ │
│ │ • coinList: Coin[] (shared data, fetch once)             │ │
│ │ • isCoinListLoading: boolean                             │ │
│ │ • coinListError: string | null                           │ │
│ │ • ui.theme: 'light' | 'dark'                             │ │
│ │                                                             │ │
│ │ MODALS MANAGEMENT:                                         │ │
│ │ • modals.addTransaction = {                              │ │
│ │     isOpen: boolean                                       │ │
│ │     mode: 'add' | 'edit'                                │ │
│ │     data: Transaction | null                             │ │
│ │   }                                                       │ │
│ │ • modals.confirmation = {                                │ │
│ │     isOpen: boolean                                       │ │
│ │     message: string                                       │ │
│ │     onConfirm: () => void                                │ │
│ │   }                                                       │ │
│ │ • modals.celebration = {                                 │ │
│ │     isOpen: boolean                                       │ │
│ │     message: string                                       │ │
│ │   }                                                       │ │
│ │                                                             │ │
│ │ FUNCTIONS:                                                 │ │
│ │ • openAddTransactionModal(mode, data?)                  │ │
│ │ • closeAddTransactionModal()                             │ │
│ │ • openConfirmationModal(message, callback)              │ │
│ │ • closeConfirmationModal()                               │ │
│ │ • openCelebrationModal(message)                          │ │
│ │ • closeCelebrationModal()                                │ │
│ │ • setTheme(theme)                                        │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  PortfolioContext ("Portfolio Manager" - Quản lý P&L)       │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │                                                             │ │
│ │ RESPONSIBILITIES:                                           │ │
│ │ ✓ Quản lý transactions & holdings                        │ │
│ │ ✓ Tính toán PnL, costBasis, returns                      │ │
│ │ ✓ Gọi API để fetch market data                           │ │
│ │ ✓ Tạo smart suggestions                                   │ │
│ │ ✓ Phối hợp với AppContext để mở modals                  │ │
│ │ ✓ Phối hợp với SavvyContext để update goals             │ │
│ │                                                             │ │
│ │ STATE:                                                      │ │
│ │ • transactions: Transaction[]                             │ │
│ │ • holdings: Holding[]                                     │ │
│ │ • apiData: { [coinId]: CoinData }                        │ │
│ │ • isLoading: boolean                                      │ │
│ │ • error: string | null                                   │ │
│ │ • smartSuggestions: {                                    │ │
│ │     completable: Goal[]                                  │ │
│ │     incomplete: Goal[]                                   │ │
│ │   }                                                       │ │
│ │ • goalCompletionData: Goal | null (temporary)            │ │
│ │                                                             │ │
│ │ COMPUTED VALUES (useMemo):                                 │ │
│ │ • portfolioData: EnrichedHolding[]                       │ │
│ │ • portfolioTotalValue: number                             │ │
│ │ • totalCostBasis: number                                 │ │
│ │ • totalProfitLoss: number                                │ │
│ │ • total24hChangeValue: number                            │ │
│ │ • totalChangePercentage: number                          │ │
│ │                                                             │ │
│ │ FUNCTIONS:                                                 │ │
│ │ • addTransaction(transaction)                             │ │
│ │ • editTransaction(updatedTransaction)                    │ │
│ │ • deleteTransaction(id)                                  │ │
│ │ • initiateGoalCompletion(goal) ← Key function            │ │
│ │                                                             │ │
│ │ SIDE EFFECTS (useEffect):                                  │ │
│ │ 1. transactions → calculate holdings                      │ │
│ │ 2. holdings → fetch api data                             │ │
│ │ 3. apiData + goals → create smartSuggestions             │ │
│ │ 4. transactions → persist to localStorage                │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  SavvyContext ("Goals Manager" - Quản lý Mục tiêu)         │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │                                                             │ │
│ │ RESPONSIBILITIES:                                           │ │
│ │ ✓ Quản lý danh sách goals                                │ │
│ │ ✓ Quản lý danh sách completedGoals                       │ │
│ │ ✓ Mark goal as complete (khi được yêu cầu)              │ │
│ │ ✓ Phối hợp với AppContext để trigger celebrations        │ │
│ │                                                             │ │
│ │ STATE:                                                      │ │
│ │ • goals: Goal[]                                           │ │
│ │ • completedGoals: CompletedGoal[]                         │ │
│ │                                                             │ │
│ │ FUNCTIONS:                                                 │ │
│ │ • addGoal(goal)                                           │ │
│ │ • editGoal(updatedGoal)                                  │ │
│ │ • deleteGoal(id)                                         │ │
│ │ • markGoalAsComplete(goalId, completionData)            │ │
│ │   └─ This will trigger AppContext.openCelebrationModal()│ │
│ │                                                             │ │
│ │ SIDE EFFECTS (useEffect):                                  │ │
│ │ 1. goals → persist to localStorage                       │ │
│ │ 2. completedGoals → persist to localStorage              │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ INTERACTION FLOWS:                                              │
│                                                                  │
│ ┌─────────────────────────────────────────┐                    │
│ │ Goal Completion Flow                    │                    │
│ │                                         │                    │
│ │ 1. Component calls PortfolioContext     │                    │
│ │    .initiateGoalCompletion(goal)        │                    │
│ │                                         │                    │
│ │ 2. PortfolioContext calls               │                    │
│ │    AppContext.openAddTransactionModal() │                    │
│ │                                         │                    │
│ │ 3. User submits transaction             │                    │
│ │    → PortfolioContext.addTransaction()  │                    │
│ │                                         │                    │
│ │ 4. PortfolioContext calls               │                    │
│ │    SavvyContext.markGoalAsComplete()    │                    │
│ │                                         │                    │
│ │ 5. SavvyContext calls                   │                    │
│ │    AppContext.openCelebrationModal()    │                    │
│ │                                         │                    │
│ │ 6. CelebrationModal displays            │                    │
│ └─────────────────────────────────────────┘                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌳 **COMPONENT TREE HOÀN CHỈNH**

```
App (Entry point)
│
├─ <BrowserRouter>
│   │
│   └─ App Component
│       │
│       └─ <AppProvider>           ← Mỗi Context được NESTED rõ ràng
│           │
│           └─ <SavvyProvider>
│               │
│               └─ <PortfolioProvider>
│                   │
│                   ├─ <Routes>
│                   │   │
│                   │   └─ <Route path="/" element={<MainLayout />}>
│                   │       │
│                   │       ├─ <Sidebar />
│                   │       │   ├─ Logo
│                   │       │   ├─ NavLink to /
│                   │       │   ├─ NavLink to /dca
│                   │       │   └─ NavLink to /goals
│                   │       │
│                   │       ├─ <BottomNav /> (mobile only)
│                   │       │   ├─ Icon NavLink to /
│                   │       │   ├─ Icon NavLink to /dca
│                   │       │   └─ Icon NavLink to /goals
│                   │       │
│                   │       └─ <Outlet /> (Dynamic pages)
│                   │           │
│                   │           ├─ Route: "/" → <DashboardPage />
│                   │           │   │
│                   │           │   ├─ <MainHeader title="Dashboard" />
│                   │           │   │   └─ [Button: Add Transaction]
│                   │           │   │
│                   │           │   └─ <main className="grid">
│                   │           │       │
│                   │           │       ├─ <PortfolioSummary /> (Grid area: summary)
│                   │           │       │   ├─ Total Value
│                   │           │       │   ├─ Total P&L
│                   │           │       │   ├─ 24h Change
│                   │           │       │   └─ Performance %
│                   │           │       │
│                   │           │       ├─ <HoldingsChart /> (Grid area: chart)
│                   │           │       │   └─ Pie chart of holdings
│                   │           │       │
│                   │           │       └─ <Portfolio /> (Grid area: table)
│                   │           │           ├─ Table Header
│                   │           │           │   ├─ Coin
│                   │           │           │   ├─ Amount
│                   │           │           │   ├─ Price
│                   │           │           │   ├─ 24h %
│                   │           │           │   ├─ Value
│                   │           │           │   ├─ P&L
│                   │           │           │   └─ Actions
│                   │           │           │
│                   │           │           └─ Table Rows
│                   │           │               └─ <HoldingItem /> (per coin)
│                   │           │                   ├─ Coin info + logo
│                   │           │                   ├─ Amount + Price
│                   │           │                   ├─ Change indicator
│                   │           │                   ├─ P&L display
│                   │           │                   └─ Action buttons (Edit, Delete)
│                   │           │
│                   │           ├─ Route: "/dca" → <DcaCalculatorPage />
│                   │           │   │
│                   │           │   ├─ <MainHeader title="DCA Calculator" />
│                   │           │   │
│                   │           │   ├─ <main>
│                   │           │   │   ├─ <DcaCalculator />
│                   │           │   │   │   ├─ Coin Selector
│                   │           │   │   │   ├─ Amount Input
│                   │           │   │   │   ├─ Frequency Selector
│                   │           │   │   │   ├─ Period Picker
│                   │           │   │   │   ├─ [Calculate Button]
│                   │           │   │   │   └─ Results Display
│                   │           │   │   │
│                   │           │   │   └─ (SmartSuggestions moved here)
│                   │           │   │       ├─ Completable Goals
│                   │           │   │       │   ├─ Goal card
│                   │           │   │       │   ├─ Amount needed
│                   │           │   │       │   └─ [Complete button]
│                   │           │   │       │
│                   │           │   │       └─ Incomplete Goals
│                   │           │   │           └─ Goal card
│                   │           │   │
│                   │           │   └─ </main>
│                   │           │
│                   │           └─ Route: "/goals" → <GoalsPage />
│                   │               │
│                   │               ├─ <MainHeader title="Goals" />
│                   │               │   └─ [Button: Add Goal]
│                   │               │
│                   │               └─ <main className="grid">
│                   │                   │
│                   │                   ├─ <Savvy /> (Grid area: goals-list)
│                   │                   │   ├─ Active Goals
│                   │                   │   │   └─ <GoalCard /> (per goal)
│                   │                   │   │       ├─ Goal title & amount
│                   │                   │   │       ├─ Progress bar
│                   │                   │   │       ├─ Current vs Target
│                   │                   │   │       └─ Actions (Edit, Delete)
│                   │                   │   │
│                   │                   │   └─ Completed Goals
│                   │                   │       └─ <GoalCard /> (completed)
│                   │                   │
│                   │                   └─ <SmartSuggestions /> (Grid area: suggestions)
│                   │                       ├─ Completable section
│                   │                       │   ├─ Summary of completable goals
│                   │                       │   ├─ List of goals
│                   │                       │   └─ [Complete Goal Buttons]
│                   │                       │
│                   │                       └─ Incomplete section
│                   │                           └─ Goals still needed
│                   │
│                   │ MODALS (Rendered OUTSIDE routes)
│                   │ ════════════════════════════════
│                   │
│                   ├─ <AddTransactionForm />
│                   │   ├─ Controlled by: AppContext.modals.addTransaction
│                   │   ├─ Modal Header (Add/Edit Transaction)
│                   │   ├─ Form fields:
│                   │   │   ├─ Coin selector (autocomplete from AppContext.coinList)
│                   │   │   ├─ Type: Buy/Sell radio
│                   │   │   ├─ Amount input
│                   │   │   ├─ Price per coin input
│                   │   │   └─ Date picker
│                   │   ├─ Validation display
│                   │   ├─ Error message
│                   │   └─ [Cancel] [Submit] buttons
│                   │
│                   ├─ <ConfirmationModal />
│                   │   ├─ Controlled by: AppContext.modals.confirmation
│                   │   ├─ Message display
│                   │   └─ [Cancel] [Confirm] buttons
│                   │
│                   └─ <CelebrationModal />
│                       ├─ Controlled by: AppContext.modals.celebration
│                       ├─ Celebration animation
│                       ├─ Message display
│                       └─ [Close] button
```

---

## 📊 **DATA FLOW DIAGRAMS**

### **A. Normal Transaction Flow**

```
User Action: Click "Add Transaction"
  ↓
Component calls: AppContext.openAddTransactionModal('add', null)
  ↓
AppContext updates: modals.addTransaction = { isOpen: true, mode: 'add', data: null }
  ↓
<AddTransactionForm /> sees isOpen=true and renders
  ↓
User fills form and clicks Submit
  ↓
AddTransactionForm calls: PortfolioContext.addTransaction(transaction)
  ↓
PortfolioContext:
  ├─ setTransactions([newTransaction, ...prev])
  ├─ (useEffect) recalculate holdings from transactions
  ├─ (useEffect) fetch new apiData for holdings
  ├─ (useEffect) recalculate smartSuggestions
  └─ localStorage.setItem('transactions', ...)
  ↓
Component calls: AppContext.closeAddTransactionModal()
  ↓
AppContext updates: modals.addTransaction = { isOpen: false, ... }
  ↓
<AddTransactionForm /> unmounts
  ↓
Dashboard re-renders with new data (Portfolio, Summary, Chart)
```

### **B. Goal Completion Flow (THE CRITICAL ONE!)**

```
User Action: Click "Hoàn thành" button in SmartSuggestions
  │
  ├─ Step 1: Initiate Goal Completion
  │   └─ Component calls: PortfolioContext.initiateGoalCompletion(goal)
  │       ├─ PortfolioContext: setGoalCompletionData(goal)
  │       └─ PortfolioContext calls: AppContext.openAddTransactionModal('sell-preset', template)
  │           └─ AppContext: modals.addTransaction = { isOpen: true, mode: 'sell-preset', data: template }
  │
  ├─ Step 2: Modal Display
  │   └─ <AddTransactionForm /> renders with pre-filled 'sell' type
  │       └─ User confirms transaction
  │
  ├─ Step 3: Add Transaction
  │   └─ Component calls: PortfolioContext.addTransaction(transaction)
  │       ├─ PortfolioContext:
  │       │   ├─ setTransactions([...])
  │       │   └─ if (goalCompletionData) {
  │       │       │   // Step 4: Trigger Goal Completion
  │       │       └─ SavvyContext.markGoalAsComplete(goalCompletionData.id)
  │       │
  │       │   └─ SavvyContext:
  │       │       ├─ const completedGoal = goals.find(g => g.id === id)
  │       │       ├─ setCompletedGoals([...completedGoals, { ...completedGoal, completedAt }])
  │       │       ├─ setGoals(goals.filter(g => g.id !== id))
  │       │       └─ THEN calls: AppContext.openCelebrationModal("Chúc mừng! Bạn đã hoàn thành mục tiêu...")
  │       │
  │       │   └─ AppContext:
  │       │       └─ modals.celebration = { isOpen: true, message: "..." }
  │       │
  │       └─ PortfolioContext:
  │           ├─ setGoalCompletionData(null)
  │           └─ closeAddTransactionModal() via AppContext
  │
  ├─ Step 5: Display Celebration
  │   └─ <CelebrationModal /> renders
  │       ├─ Shows celebration message
  │       └─ Auto-closes after 3 seconds or manual click
  │           └─ AppContext.closeCelebrationModal()
  │
  └─ Result:
      ├─ Goal moved to completedGoals ✓
      ├─ Portfolio updated with transaction ✓
      ├─ User saw celebration modal ✓
      └─ All contexts synchronized ✓
```

### **C. Data Persistence Flow**

```
localStorage
    ↓
    ├─ transactions (from PortfolioContext)
    │   └─ Synced via: useEffect([transactions]) → localStorage.setItem()
    │       └─ On app load: useState(() => JSON.parse(localStorage.getItem('transactions')))
    │
    ├─ goals (from SavvyContext)
    │   └─ Synced via: useEffect([goals]) → localStorage.setItem()
    │       └─ On app load: useState(() => JSON.parse(localStorage.getItem('goals')))
    │
    └─ completedGoals (from SavvyContext)
        └─ Synced via: useEffect([completedGoals]) → localStorage.setItem()
            └─ On app load: useState(() => JSON.parse(localStorage.getItem('completedGoals')))
```

---

## 📋 **FILE STRUCTURE (RECOMMENDED)**

```
savvy-app/
├── src/
│   ├── App.jsx                    ← Entry point, wraps all Providers
│   ├── main.jsx                   ← Vite entry, wraps with <BrowserRouter>
│   │
│   ├── context/                   ← All Context Providers
│   │   ├── AppContext.jsx         ← UI state, modals, services
│   │   ├── PortfolioContext.jsx   ← Portfolio logic, transactions
│   │   └── SavvyContext.jsx       ← Goals management
│   │
│   ├── layout/
│   │   ├── MainLayout.jsx         ← Layout with Sidebar + Outlet
│   │   └── MainLayout.module.css
│   │
│   ├── pages/                     ← Full pages (Route components)
│   │   ├── DashboardPage.jsx
│   │   ├── DashboardPage.module.css
│   │   ├── DcaCalculatorPage.jsx
│   │   ├── DcaCalculatorPage.module.css
│   │   ├── GoalsPage.jsx
│   │   └── GoalsPage.module.css
│   │
│   ├── components/
│   │   ├── navigation/            ← Navigation components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Sidebar.module.css
│   │   │   ├── BottomNav.jsx
│   │   │   └── BottomNav.module.css
│   │   │
│   │   ├── common/                ← Shared components
│   │   │   ├── MainHeader.jsx
│   │   │   ├── MainHeader.module.css
│   │   │   ├── Modal.jsx          ← Reusable modal wrapper
│   │   │   └── Modal.module.css
│   │   │
│   │   ├── portfolio/             ← Portfolio-related components
│   │   │   ├── PortfolioSummary.jsx
│   │   │   ├── PortfolioSummary.module.css
│   │   │   ├── Portfolio.jsx
│   │   │   ├── Portfolio.module.css
│   │   │   ├── HoldingItem.jsx
│   │   │   ├── HoldingItem.module.css
│   │   │   ├── HoldingsChart.jsx
│   │   │   ├── HoldingsChart.module.css
│   │   │   ├── AddTransactionForm.jsx (MODAL)
│   │   │   └── AddTransactionForm.module.css
│   │   │
│   │   ├── savvy/                 ← Goals-related components
│   │   │   ├── Savvy.jsx
│   │   │   ├── Savvy.module.css
│   │   │   ├── GoalCard.jsx
│   │   │   ├── GoalCard.module.css
│   │   │   └── CelebrationModal.jsx (MODAL)
│   │   │   └── CelebrationModal.module.css
│   │   │
│   │   ├── dca/                   ← DCA Calculator
│   │   │   ├── DcaCalculator.jsx
│   │   │   ├── DcaCalculator.module.css
│   │   │   └── SmartSuggestions.jsx
│   │   │   └── SmartSuggestions.module.css
│   │   │
│   │   └── modals/                ← Global modals
│   │       ├── ConfirmationModal.jsx
│   │       └── ConfirmationModal.module.css
│   │
│   ├── services/                  ← API calls
│   │   ├── crypto-api.js
│   │   └── goals-api.js (if needed)
│   │
│   ├── utils/
│   │   ├── formatters.js          ← Format functions
│   │   ├── dca-calculator.js      ← DCA logic
│   │   ├── validators.js          ← Validation functions
│   │   └── helpers.js             ← Common helpers
│   │
│   ├── styles/
│   │   ├── variables.css          ← CSS variables (design tokens)
│   │   ├── globals.css            ← Global styles
│   │   └── utils.css              ← Utility classes
│   │
│   ├── App.css                    ← App-level styles
│   └── index.css                  ← Root styles
```

---

## 🎯 **KEY PRINCIPLES TO FOLLOW**

### **1. Context Nesting Order (CRITICAL!)**
```javascript
// ✅ CORRECT
<AppProvider>                  {/* Must be OUTERMOST */}
  <SavvyProvider>              {/* SavvyContext */}
    <PortfolioProvider>        {/* PortfolioContext can use both */}
      <BrowserRouter>
        <Routes>...</Routes>
        {/* Modals here */}
      </BrowserRouter>
    </PortfolioProvider>
  </SavvyProvider>
</AppProvider>

// ❌ WRONG
<SavvyProvider>
  <AppProvider>                {/* AppContext inside SavvyContext? */}
    ...
  </AppProvider>
</SavvyProvider>
```

### **2. No Circular Dependencies**
```
AppContext → (No imports from PortfolioContext or SavvyContext)
PortfolioContext → Can use AppContext ✓
SavvyContext → Can use AppContext ✓
But: SavvyContext should NOT directly use PortfolioContext
Instead: PortfolioContext calls SavvyContext functions via props
```

### **3. Modal Ownership**
```
AddTransactionModal → Owned by AppContext
ConfirmationModal → Owned by AppContext  
CelebrationModal → Owned by AppContext
```

### **4. Single Source of Truth (SSOT)**
```
Transaction data: ONLY in PortfolioContext.transactions
Goal data: ONLY in SavvyContext.goals
UI state: ONLY in AppContext.modals
Shared data (coinList): ONLY in AppContext.coinList
```

### **5. Data Flow Direction**
```
Component
    ↓
Event Handler (Component)
    ↓
Context Action (PortfolioContext.addTransaction)
    ↓
Update State (setTransactions)
    ↓
Side Effect (useEffect)
    ↓
Re-render Component
```

---

## 🚨 **ANTI-PATTERNS TO AVOID**

| ❌ Anti-pattern | ✅ What to do instead |
|-----------------|----------------------|
| **State duplication** (coinList in 2 places) | Keep only in AppContext, access via useContext |
| **Circular dependencies** (A imports B, B imports A) | Use parent component to connect them |
| **Modal logic scattered** (openModal in 3 places) | Centralize all modal logic in AppContext |
| **Component import 2+ Context** | Component should only import what it needs |
| **Context value too large** (50+ properties) | Split into smaller contexts |
| **Direct prop passing through Provider** | Use Context properly, or lift state up |
| **Orphan modal** (No one opens it) | Every modal must have clear owner |
| **Deeply nested Providers** (>5 levels) | Flat hierarchy, only 3-4 providers max |

---

## 📝 **SUMMARY TABLE**

| Layer | Responsibility | Should Know | Should NOT Know |
|-------|---|---|---|
| **App.jsx** | Wire up Providers | Context order | Component logic |
| **AppContext** | UI + Services | coinList, modals | Portfolio logic |
| **PortfolioContext** | Portfolio logic | transactions, calculations | UI states |
| **SavvyContext** | Goals logic | goals, completedGoals | UI states, portfolio |
| **Components** | Render + UX | Only their own context | Other contexts (except via props) |

---

Đây là kiến trúc **professional-grade**, **scalable**, và **maintainable**. Bạn sẽ thấy rằng:

✅ Không có state duplicate  
✅ Mỗi Context có một trách nhiệm rõ ràng  
✅ Dữ liệu chảy theo một hướng  
✅ Modals có owner rõ ràng  
✅ Dễ test, dễ debug  
✅ Dễ mở rộng thêm features sau này  

Bạn hài lòng với kiến trúc này không? Nếu có, chúng ta sẽ bắt đầu **code Task 15.1** để refactor `AppContext` trước tiên!