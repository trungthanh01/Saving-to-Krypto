import './App.css';
import { useState, useEffect } from 'react';
import { Portfolio } from './components/portfolio/Portfolio.jsx';
import { AddHoldingForm } from './components/portfolio/AddHoldingForm.jsx';
import { HoldingsChart } from './components/portfolio/HoldingsChart.jsx';
import { Savvy } from './components/savvy/Savvy.jsx';
import { SavvyProvider } from './context/SavvyContext.jsx';
import { PortfolioProvider } from './context/PortfolioContext.jsx';

export function App() {
  // 1. App quản lý state thông báo chung
  const [goalMessage, setGoalMessage] = useState('');

  // 2. App quản lý useEffect cho thông báo
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

  return (
    <div className='app-container'>
      <header className='app-header'>
        <h1>Savvy</h1>
        {goalMessage && <h3 className='goalMessage'>{goalMessage}</h3>}
      </header>
      
      <main>
        <PortfolioProvider setGoalMessage={setGoalMessage}>
          <div className="portfolio-container">
            <Portfolio />
            <HoldingsChart />
          </div>
          <AddHoldingForm /> 
        </PortfolioProvider>

        <SavvyProvider setGoalMessage={setGoalMessage}>
          <Savvy />
        </SavvyProvider>
      </main>
    </div> 
  );
}

