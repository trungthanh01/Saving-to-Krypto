import { PortfolioSummary } from '../components/portfolio/PortfolioSummary';
// SỬA Ở ĐÂY: Đổi tên component và file cho đúng
import { Portfolio } from '../components/portfolio/Portfolio'; 
import { HoldingsChart } from '../components/portfolio/HoldingsChart';
import { TransactionHistory } from '../components/portfolio/TransactionHistory';

export function DashboardPage() {
    return (
        <>
            <PortfolioSummary />
            <div className="charts-container"> {/* Optional: for styling later */}
                {/* SỬA Ở ĐÂY: Dùng đúng tên component đã import */}
                <Portfolio />
                <HoldingsChart />
            </div>
            <TransactionHistory />
        </>
    );
}
