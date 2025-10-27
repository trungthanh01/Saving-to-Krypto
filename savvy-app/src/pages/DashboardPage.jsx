import { PortfolioSummary } from '../components/portfolio/PortfolioSummary';
import { Portfolio } from '../components/portfolio/Portfolio'; 
import { HoldingsChart } from '../components/portfolio/HoldingsChart';
import { TransactionHistory } from '../components/portfolio/TransactionHistory';
import { MainHeader } from '../components/common/MainHeader';
import styles from './DashboardPage.module.css';

export function DashboardPage() {
    return (
        <>
            <MainHeader title="Dashboard" />
            <div className={styles.dashboardGrid}>
                <div className={styles.summary}>
                    <PortfolioSummary />
                </div>
                <div className={styles.table}>
                    <Portfolio />
                </div>
                <div className={styles.chart}>
                    <HoldingsChart />
                </div>
                <div className={styles.history}>
                    <TransactionHistory />
                </div>
            </div>
        </>
    );
}
