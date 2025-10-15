import './App.css';
import { useState, useEffect, useContext } from 'react';
import { Portfolio } from './components/portfolio/Portfolio.jsx';
import { AddTransactionForm } from './components/portfolio/AddTransactionForm.jsx';
import { HoldingsChart } from './components/portfolio/HoldingsChart.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';
import { TransactionHistory } from './components/portfolio/TransactionHistory.jsx';
import { PortfolioSummary } from './components/portfolio/PortfolioSummary.jsx';
import { ConfirmationModal } from './components/portfolio/ConfirmationModal.jsx';
import { Savvy } from './components/savvy/Savvy.jsx';
import { SavvyProvider } from './context/SavvyContext.jsx';
import { SavvyContext } from './context/SavvyContext.jsx';
import { SmartSuggestions } from './components/portfolio/SmartSuggestions.jsx';


export function AppContent() {
  const {goals, setGoalMessage} = useContext(SavvyContext);
  const {goalMessage} = useContext(SavvyContext);
  useEffect(() => {
    if (!goalMessage) {
      return;
    }
    const timerId = setTimeout(() => {
      setGoalMessage('');
    }, 3000);
    return () => {
      clearTimeout(timerId);
    };
  }, [goalMessage]);
  
  useEffect(() => {
    console.log(goals);
  }, [goals]);

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Savvy</h1>
        {goalMessage && <h3 className='goalMessage'>{goalMessage}</h3>}
      </header>
      
      <main>
        <PortfolioProvider setGoalMessage={setGoalMessage} goals={goals}>
          <div className="portfolio-container">
            <PortfolioSummary />
            <HoldingsChart />
          </div>
          <SmartSuggestions />
          <Portfolio />
          <TransactionHistory />
          <ConfirmationModal />
        </PortfolioProvider>

        <Savvy />
      </main>
    </div> 
  );
}

export function App() {
  return (
    <SavvyProvider>
      <AppContent />
    </SavvyProvider>
  );
}
