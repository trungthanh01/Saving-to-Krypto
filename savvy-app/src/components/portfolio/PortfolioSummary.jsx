import { useContext } from "react"
import { PortfolioContext } from "../../context/PortfolioContext"
import './portfolio-summary.css'
export function PortfolioSummary(){
    const {portfolioTotalValue, isLoading} = useContext(PortfolioContext)
    const formattedTotalValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,                       
    }).format(portfolioTotalValue || 0)
    if(isLoading) {
        return <p>Đang tính toán tổng giá trị...</p>
    }
    return(
        <section className="portfolio-summary">
            <h2 className="summary-title">Tổng Quan</h2>
            <p className="summary-value">Tổng Giá Trị: {formattedTotalValue}</p>
        </section>
    )
}