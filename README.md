# Saving-to-Krypto 💰🪙

**Save money to buy cryptocurrency frequently**

A modern React application that helps users manage cryptocurrency portfolio and set savings goals with intelligent suggestions.

---

## 🎯 Key Features

- 📊 **Portfolio Management**: Track cryptocurrency holdings, buy/sell transactions, and calculate profit/loss
- 🎯 **Savings Goals**: Create financial goals and link savings to them
- 💡 **Smart Suggestions**: Get intelligent recommendations on when to complete goals based on portfolio profit
- 📈 **DCA Calculator**: Dollar-Cost Averaging calculator for investment planning
- 🔄 **Real-time Price Data**: Integration with CryptoCompare API for live market prices
- 🎨 **Responsive UI**: Beautiful and mobile-friendly interface

---

## 🏗️ Architecture Overview

### Context-Based State Management (3-Tier System)

```
┌────────────────────────────────────────────────────────────────┐
│                     <AppProvider>                               │
│              [GLOBAL APP MANAGER - UI State]                    │
│                                                                  │
│  ├─ Modals: addTransaction, confirmation, celebration          │
│  ├─ UI Theme: light/dark mode                                  │
│  └─ Services: coinList (CryptoCompare data)                    │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    <App>                                 │  │
│  │                                                           │  │
│  │  ┌──────────────────┐      ┌──────────────────────────┐ │  │
│  │  │ <SavvyProvider>  │      │ <PortfolioProvider>      │ │  │
│  │  │                  │      │                          │ │  │
│  │  │ Manages:         │      │ Manages:                 │ │  │
│  │  │ • Goals          │      │ • Transactions           │ │  │
│  │  │ • Savings        │      │ • Holdings               │ │  │
│  │  │ • Completed      │      │ • Market Data            │ │  │
│  │  │                  │      │ • Suggestions            │ │  │
│  │  └──────────────────┘      └──────────────────────────┘ │  │
│  │                                                           │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │         Global Modals & Routes                   │   │  │
│  │  │  • AddTransactionForm                            │   │  │
│  │  │  • ConfirmationModal                             │   │  │
│  │  │  • CelebrationModal                              │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
savvy-app/
├── src/
│   ├── App.jsx                          # Main application component
│   ├── App.css                          # App-level styles
│   ├── main.jsx                         # React entry point
│   ├── index.css                        # Global styles
│   │
│   ├── context/                         # Context API (State Management)
│   │   ├── AppContext.jsx               # Global UI & Modal Manager
│   │   │                                # - Centralized modal control
│   │   │                                # - Shared services (coinList)
│   │   │                                # - UI theme state
│   │   ├── SavvyContext.jsx             # Savings Goals Manager
│   │   │                                # - Goals CRUD operations
│   │   │                                # - Savings transactions
│   │   │                                # - Goal completion tracking
│   │   └── PortfolioContext.jsx         # Cryptocurrency Portfolio Manager
│   │                                    # - Transaction management
│   │                                    # - Holdings calculation
│   │                                    # - Portfolio statistics
│   │                                    # - Smart suggestions engine
│   │
│   ├── pages/                           # Page Components
│   │   ├── DashboardPage.jsx            # Dashboard/Home page
│   │   ├── DashboardPage.module.css     # Dashboard styles
│   │   ├── GoalsPage.jsx                # Savings goals page
│   │   ├── GoalsPage.module.css         # Goals page styles
│   │   ├── DcaCalculatorPage.jsx        # DCA calculator page
│   │   └── (other page files)
│   │
│   ├── layout/                          # Layout Components
│   │   ├── MainLayout.jsx               # Main app layout (header, nav, etc.)
│   │   └── MainLayout.module.css        # Layout styles
│   │
│   ├── components/                      # Reusable UI Components
│   │   │
│   │   ├── common/                      # Common components
│   │   │   ├── MainHeader.jsx           # Application header
│   │   │   └── MainHeader.module.css
│   │   │
│   │   ├── navigation/                  # Navigation components
│   │   │   ├── BottomNav.jsx            # Mobile bottom navigation
│   │   │   ├── BottomNav.module.css
│   │   │   ├── Sidebar.jsx              # Desktop sidebar navigation
│   │   │   └── Sidebar.module.css
│   │   │
│   │   ├── portfolio/                   # Portfolio-related components
│   │   │   ├── Portfolio.jsx            # Main portfolio container
│   │   │   ├── Portfolio.module.css
│   │   │   ├── PortfolioSummary.jsx     # Portfolio summary (total value, P&L)
│   │   │   ├── portfolio-summary.css
│   │   │   ├── AddTransactionForm.jsx   # Modal: Add/Edit transactions
│   │   │   ├── AddTransactionForm.css
│   │   │   ├── TransactionHistory.jsx   # Transaction history table
│   │   │   ├── TransactionHistory.css
│   │   │   ├── HoldingsChart.jsx        # Holdings visualization
│   │   │   ├── HoldingsChart.module.css
│   │   │   ├── HoldingItem.jsx          # Individual holding card
│   │   │   ├── HoldingItem.module.css
│   │   │   ├── SmartSuggestions.jsx     # Smart goal completion suggestions
│   │   │   ├── SmartSuggestions.css
│   │   │   ├── ConfirmationModal.jsx    # Modal: Confirm delete/actions
│   │   │   └── ConfirmationModal.css
│   │   │
│   │   ├── savvy/                       # Savings-related components
│   │   │   ├── Savvy.jsx                # Main savings container
│   │   │   ├── GoalCard.jsx             # Individual goal card
│   │   │   ├── GoalCard.module.css
│   │   │   ├── GoalHistory.jsx          # Completed goals history
│   │   │   ├── GoalHistory.css
│   │   │   ├── AddGoalForm.jsx          # Modal: Add new goal
│   │   │   ├── AddGoalForm.module.css
│   │   │   ├── AddSavingForm.jsx        # Modal: Add saving to goal
│   │   │   ├── AddSavingForm.module.css
│   │   │   ├── AddButton.jsx            # Reusable add button
│   │   │   ├── AddButton.module.css
│   │   │   ├── SavingHistoryItem.jsx    # Savings history list item
│   │   │   ├── SavingHistoryItem.module.css
│   │   │   ├── CelebrationModal.jsx     # Modal: Goal completion celebration
│   │   │   └── CelebrationModal.css
│   │   │
│   │   └── dca/                         # DCA Calculator components
│   │       ├── DcaCalculator.jsx        # DCA calculator logic & UI
│   │       └── DcaCalculator.module.css
│   │
│   ├── services/                        # External API & Services
│   │   └── crypto-api.js                # CryptoCompare API integration
│   │                                    # - fetchCoinList(): Get popular coins
│   │                                    # - fetchCoinData(): Get market prices
│   │                                    # - fetchCoinHistory(): Get price history
│   │
│   ├── utils/                           # Utility Functions
│   │   ├── formatters.js                # Formatting helpers (currency, numbers)
│   │   └── dca-calculator.js            # DCA calculation logic
│   │
│   └── styles/                          # Global stylesheets
│
├── public/                              # Static assets
│   └── vite.svg
│
├── package.json                         # Project dependencies
├── vite.config.js                       # Vite configuration
├── eslint.config.js                     # ESLint configuration
└── index.html                           # HTML entry point
```

---

## 🔑 Context API Details

### 1. **AppContext** - Global UI Manager
**File:** `src/context/AppContext.jsx`

**Responsibilities:**
- Manage modal states (addTransaction, confirmation, celebration)
- Theme management (light/dark mode)
- Fetch and cache coin list from CryptoCompare API

**Key Functions:**
- `openAddTransactionModal(mode, data)` - Open add/edit transaction modal
- `closeAddTransactionModal()` - Close transaction modal
- `openConfirmationModal(message, onConfirmCallback)` - Open confirmation dialog
- `handleConfirm()` - Execute confirmation action
- `openCelebrationModal(message)` - Show celebration after goal completion
- `setTheme(theme)` - Switch theme

---

### 2. **SavvyContext** - Savings Goals Manager
**File:** `src/context/SavvyContext.jsx`

**Responsibilities:**
- Manage savings goals (create, read, update, delete)
- Track savings transactions per goal
- Track completed goals history
- Calculate total savings across all goals

**Key Functions:**
- `handleAddGoal(goalData)` - Create new goal
- `handleDeleteGoal(goalId)` - Delete active goal
- `handleDeleteCompletedGoal(goalId)` - Remove from completed history
- `markGoalAsComplete(goalId)` - Mark goal as achieved
- `handleOpenAddSavingModal(goalId)` - Open savings form modal
- `handleAddSaving(savingData)` - Add transaction to goal
- `handleDeleteSaving(savingId)` - Remove saving transaction

**Data Structure:**
```javascript
goals: [
  {
    id: 'g_timestamp',
    title: 'Buy Bitcoin',
    targetAmount: 1000,
    currentAmount: 450,  // Calculated from related savings
    deadline: '2025-12-31',
    priority: 'high'
  }
]

savings: [
  {
    id: 's_timestamp',
    goalId: 'g_timestamp',
    amount: 100,
    date: '2024-10-30',
    note: 'Monthly savings'
  }
]

completedGoals: [
  {
    ...goal,
    completedAt: 'ISO_DATE'
  }
]
```

---

### 3. **PortfolioContext** - Cryptocurrency Portfolio Manager
**File:** `src/context/PortfolioContext.jsx`

**Responsibilities:**
- Manage buy/sell transactions
- Calculate holdings and average costs
- Fetch real-time market data
- Calculate portfolio statistics (total value, P&L, 24h change)
- Generate smart suggestions for goal completion

**Key Functions:**
- `addTransaction(transactionData)` - Record buy/sell transaction
- `editTransaction(transactionData)` - Update existing transaction
- `deleteTransaction(transactionId)` - Remove transaction
- `handleOpenEditModal(transaction)` - Open edit modal
- `handleInitiateGoalCompletion(goal)` - Initiate goal completion flow

**Data Structure:**
```javascript
transactions: [
  {
    id: 't_timestamp',
    type: 'buy',           // or 'sell'
    coinId: 'BTC',
    amount: 0.5,
    pricePerCoin: 43000,
    date: '2024-10-30'
  }
]

holdings: [
  {
    id: 'BTC',
    amount: 0.5,
    costBasis: 21500,      // Total cost to acquire
    averageBuyPrice: 43000
  }
]

portfolioData: [
  {
    ...holding,
    ...coinData,
    currentValue: 21700,
    profitLoss: 200,
    price_change_24h: 150
  }
]

smartSuggestions: {
  completable: [goal1, goal2],  // Goals achievable with current profit
  incompletable: [goal3]         // Goals needing more profit
}
```

---

## 🔄 Data Flow

### Adding a Transaction (Buy/Sell)
```
User fills form in AddTransactionForm
       ↓
Form validates coin selection & amounts
       ↓
PortfolioContext.addTransaction() is called
       ↓
Transaction stored in state & localStorage
       ↓
Holdings are recalculated
       ↓
API fetches new market data
       ↓
Portfolio statistics updated
       ↓
Smart suggestions regenerated
       ↓
Modal closes via closeAddTransactionModal()
```

### Completing a Goal
```
User clicks "Complete Goal" in SmartSuggestions
       ↓
PortfolioContext.handleInitiateGoalCompletion() stores goal
       ↓
AppContext.openAddTransactionModal('add', template)
       ↓
User fills sell transaction form
       ↓
PortfolioContext.addTransaction() + SavvyContext.markGoalAsComplete()
       ↓
AppContext.openCelebrationModal() shows celebration
       ↓
Goal moved to completedGoals, removed from active goals
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Git

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/Saving-to-Krypto.git
cd Saving-to-Krypto/savvy-app

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run ESLint
npm run lint
```

### Environment
No environment variables required. The app uses CryptoCompare's free API endpoint.

---

## 📦 Dependencies

### Core
- **React 19**: UI library
- **React Router DOM**: Client-side routing
- **Vite**: Build tool & dev server

### API & Data
- **Axios**: HTTP client for API calls

### Development
- **ESLint**: Code quality
- **Prettier**: Code formatting (recommended)

---

## 💾 Data Persistence

All data is stored in browser's localStorage:
- `savvy-goals` - Active savings goals
- `savvy-savings` - Savings transactions
- `completeGoals_data` - Completed goals history
- `portfolio-transactions` - Buy/sell transactions

---

## 🎨 Styling Approach

- **CSS Modules**: Component-scoped styles (`.module.css`)
- **Responsive Design**: Mobile-first approach
- **Accessibility**: ARIA labels, semantic HTML

---

## 📱 Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🚀 Future Enhancements

- [ ] Dark mode support
- [ ] Advanced portfolio analytics
- [ ] Price alerts & notifications
- [ ] Multi-currency support
- [ ] Export transaction reports (CSV/PDF)
- [ ] Goal sharing & social features
- [ ] Cloud backup & sync

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 👨‍💻 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

---

## 📧 Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the maintainers.

---

**Happy saving and investing! 🚀💰**