import { useContext } from "react"
import { PortfolioContext } from "../../context/PortfolioContext"
import styles from './PortfolioSummary.module.css'

export function PortfolioSummary(){
    const {
        portfolioTotalValue, 
        isLoading, 
        totalCostBasis, 
        totalProfitLoss,
        total24hChangeValue,
        totalChangePercentage} = useContext(PortfolioContext)
    ;

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
        totalProfitLoss > 0 ? styles.profit : 
        totalProfitLoss < 0 ? styles.loss : ''
    ;

    const change24hClass = 
        total24hChangeValue > 0 ? styles.profit : 
        total24hChangeValue < 0 ? styles.loss : ''
    ;

    if(isLoading) {
        return <p className={styles.summaryLoading}>Đang tính toán tổng giá trị...</p>
    }

    return(
        <section className={styles.portfolioSummary}>
            <h2 className={styles.summaryTitle}>Tổng Quan</h2>
            <p className={styles.summaryValue}>{formattedTotalValue}</p>
            {totalCostBasis > 0 && (
                <div className={styles.summaryDetails}>
                    <div>
                        <p>
                            <span className={styles.label}>Tổng Vốn:</span>
                            <span className={styles.value}>{formattedTotalCostBasis}</span>
                        </p>
                        <p>
                            <span className={styles.label}>Lời/Lỗ:</span>
                            <span className={`${styles.value} ${pnlClass}`}>{formattedTotalProfitLoss}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span className={styles.label}>Thay Đổi 24H:</span>
                            <span className={`${styles.value} ${change24hClass}`}>{formatted24hChangeValue}</span>
                        </p>
                        <p>
                            <span className={styles.label}>Phần Trăm Thay Đổi:</span>
                            <span className={`${styles.value} ${change24hClass}`}>{formatted24hChangePercentage}</span>
                        </p>
                    </div>
                </div>
            )}
        </section>
    )
}
