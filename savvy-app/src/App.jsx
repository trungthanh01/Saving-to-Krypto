import { useContext, useEffect } from 'react';
import './App.css';
import { SavvyProvider, SavvyContext } from './context/SavvyContext.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import { Savvy } from './components/savvy/Savvy.jsx';
import { Portfolio } from './components/portfolio/Portfolio.jsx';
import { TransactionHistory } from './components/portfolio/TransactionHistory.jsx';
import { PortfolioSummary } from './components/portfolio/PortfolioSummary.jsx';
import { HoldingsChart } from './components/portfolio/HoldingsChart.jsx';
import { SmartSuggestions } from './components/portfolio/SmartSuggestions.jsx';
import { ConfirmationModal } from './components/portfolio/ConfirmationModal.jsx';
import { CelebrationModal } from './components/savvy/CelebrationModal.jsx';
import { DcaCalculator } from './components/dca/DcaCalculator.jsx';

// Component con, nằm BÊN TRONG SavvyProvider
function AppContent() {
  // Bây giờ gọi useContext ở đây là hợp lệ
  const { goals, markGoalAsComplete, setGoalMessage, goalMessage } = useContext(SavvyContext);

  useEffect(() => {
    if (goalMessage) {
      const timer = setTimeout(() => {
        setGoalMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [goalMessage, setGoalMessage]);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Savvy</h1>
        {goalMessage && <h3 className='goalMessage'>{goalMessage}</h3>}
      </header>
      <main>
        {/* Truyền các giá trị cần thiết từ SavvyContext xuống PortfolioProvider */}
        <PortfolioProvider 
          goals={goals} 
          markGoalAsComplete={markGoalAsComplete}
        >
          <div className="portfolio-container">
            <PortfolioSummary />
            <HoldingsChart />
          </div>
          <DcaCalculator />
          <SmartSuggestions />
          <Portfolio />
          <TransactionHistory />
        </PortfolioProvider>
        
        <Savvy />
        <CelebrationModal />
        <ConfirmationModal />
      </main>
    </div>
  );
}

// Component App chính, chỉ làm nhiệm vụ bao bọc
export function App() {
  return (
    <SavvyProvider>
      <AppContent />
    </SavvyProvider>
  );
}
