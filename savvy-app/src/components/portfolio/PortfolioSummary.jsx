import { useContext } from "react"
import { PortfolioContext } from "../../context/PortfolioContext"
import './portfolio-summary.css'

export function PortfolioSummary(){
    const {
        portfolioTotalValue, 
        isLoading, 
        totalCostBasis, 
        totalProfitLoss,
        total24hChangeValue,
        totalChangePercentage} = useContext(PortfolioContext)
    ;
    console.log("giá trị totalcostbasis", totalCostBasis);
    const formattedTotalValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,                       
    }).format(portfolioTotalValue || 0)

    const formattedTotalCostBasis = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(totalCostBasis || 0);

    const formattedTotalProfitLoss = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(totalProfitLoss || 0);

    const formatted24hChangeValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(total24hChangeValue || 0);

    const formatted24hChangePercentage = `${(totalChangePercentage || 0).toFixed(2)}%`;


    // Xác định màu sắc cho Lời/Lỗ
    const pnlClass = 
        totalProfitLoss > 0 ? 'profit' : 
        totalProfitLoss < 0 ? 'loss' : ''
    ;

    const change24hClass = 
        total24hChangeValue > 0 ? 'profit' : 
        total24hChangeValue < 0 ? 'loss' : ''
    ;

    if(isLoading) {
        return <p className="summary-loading">Đang tính toán tổng giá trị...</p>
    }

    return(
        <section className="portfolio-summary">
            <h2 className="summary-title">Tổng Quan</h2>
            <p className="summary-value">{formattedTotalValue}</p>
            {totalCostBasis > 0 && (
                <div className="summary-details">
                    <div>
                        <p>
                            <span>Tổng Vốn:</span>
                            <span>{formattedTotalCostBasis}</span>
                        </p>
                        <p>
                            <span>Lời/Lỗ:</span>
                            <span className={pnlClass}>{formattedTotalProfitLoss}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>Thay Đổi 24H:</span>
                            <span className={change24hClass}>{formatted24hChangeValue}</span>
                        </p>
                        <p>
                            <span>Phần Trăm Thay Đổi:</span>
                            <span className={change24hClass}>{formatted24hChangePercentage}</span>
                        </p>
                    </div>
                </div>
            )}
        </section>
    )
}