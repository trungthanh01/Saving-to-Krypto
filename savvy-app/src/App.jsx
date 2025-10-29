import { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SavvyProvider, SavvyContext } from './context/SavvyContext.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';

// Import Layout
// SỬA Ở ĐÂY: đổi "layouts" thành "layout"
import { MainLayout } from './layout/MainLayout.jsx';

// Import Pages
import { DashboardPage } from './pages/DashboardPage.jsx';
import { DcaCalculatorPage } from './pages/DcaCalculatorPage.jsx';
import { GoalsPage } from './pages/GoalsPage.jsx';

// Import Modals & Global Components
// Sửa tên component cho đúng với file của bạn
import { AddTransactionForm } from './components/portfolio/AddTransactionForm.jsx'; 
import { ConfirmationModal } from './components/portfolio/ConfirmationModal.jsx';
import { CelebrationModal } from './components/savvy/CelebrationModal.jsx';
import './App.css';

// Component trung gian để lấy context từ Savvy và truyền vào Portfoligo
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
      
      {/* TRẢ LẠI CÁC MODAL VÀO ĐÂY */}
      <AddTransactionForm />
      <ConfirmationModal />
      <CelebrationModal />
    </PortfolioProvider>
  );
}

// Component App chính giờ đây rất gọn gàng
export function App() {
  return (
    <SavvyProvider>
      <AppRoutes />
    </SavvyProvider>
  );
}
