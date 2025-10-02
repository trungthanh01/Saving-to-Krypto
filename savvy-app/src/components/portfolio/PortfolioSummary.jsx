import { useContext } from "react"
import { PortfolioContext } from "../../context/PortfolioContext"
import './portfolio-summary.css'

export function PortfolioSummary(){
    const {portfolioTotalValue, isLoading, totalCostBasis, totalProfitLoss} = useContext(PortfolioContext)
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

    // Xác định màu sắc cho Lời/Lỗ
    const pnlClass = totalProfitLoss > 0 ? 'profit' : totalProfitLoss < 0 ? 'loss' : '';

    if(isLoading) {
        return <p className="summary-loading">Đang tính toán tổng giá trị...</p>
    }
    return(
        <section className="portfolio-summary">
            <h2 className="summary-title">Tổng Quan</h2>
            <p className="summary-value">{formattedTotalValue}</p>
            {totalCostBasis > 0 && (
                <div className="summary-details">
                    <p>
                        <span>Tổng Vốn:</span>
                        <span>{formattedTotalCostBasis}</span>
                    </p>
                    <p>
                        <span>Lời/Lỗ:</span>
                        <span className={pnlClass}>{formattedTotalProfitLoss}</span>
                    </p>
                </div>
            )}
        </section>
    )
}