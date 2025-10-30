import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SavvyProvider, SavvyContext } from './context/SavvyContext.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import { AppContext, AppProvider } from './context/AppContext.jsx'; // ✅ Thêm import này

// Import Layout
import { MainLayout } from './layout/MainLayout.jsx';

// Import Pages
import { DashboardPage } from './pages/DashboardPage.jsx';
import { DcaCalculatorPage } from './pages/DcaCalculatorPage.jsx';
import { GoalsPage } from './pages/GoalsPage.jsx';

// Import Modals & Global Components
import { AddTransactionForm } from './components/portfolio/AddTransactionForm.jsx'; 
import { ConfirmationModal } from './components/portfolio/ConfirmationModal.jsx';
import { CelebrationModal } from './components/savvy/CelebrationModal.jsx';
import './App.css';

// ─────────────────────────────────────────────────────────────
// TASK 15.5.3: AppRoutes - Lấy context từ SavvyContext
// ─────────────────────────────────────────────────────────────
function AppRoutes() {
  const { goals, markGoalAsComplete } = useContext(SavvyContext);

  return (
    <PortfolioProvider 
      goals={goals} 
      markGoalAsComplete={markGoalAsComplete}
    >
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/dca" element={<DcaCalculatorPage />} />
          <Route path="/goals" element={<GoalsPage />} />
        </Route>
      </Routes>
      
      <AddTransactionForm />
      <ConfirmationModal />
      <CelebrationModal />
    </PortfolioProvider>
  );
}

export function App() {
  return (
    <AppProvider>
      <SavvyProvider>
        <AppRoutes />
      </SavvyProvider>
    </AppProvider>
  );
}
// ┌─────────────────────────────────────┐
// │   AppProvider                       │ ← OUTERMOST (cung cấp UI state)
// │ ┌───────────────────────────────┐   │
// │ │ SavvyProvider                 │   │ ← Bên trong (cung cấp goals)
// │ │ ┌───────────────────────────┐ │   │
// │ │ │ AppRoutes                 │ │   │ ← Chứa routes & PortfolioProvider
// │ │ │ ┌─────────────────────┐   │ │   │
// │ │ │ │ PortfolioProvider   │   │ │   │ ← INNERMOST (có access tất cả context ở ngoài)
// │ │ │ │ ┌─────────────────┐ │   │ │   │
// │ │ │ │ │ Routes & Modals │ │   │ │   │
// │ │ │ │ └─────────────────┘ │   │ │   │
// │ │ │ └─────────────────────┘   │ │   │
// │ │ └───────────────────────────┘ │   │
// │ └───────────────────────────────┘   │
// └─────────────────────────────────────┘