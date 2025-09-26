import './HoldingsChart.css'
import { useContext } from 'react'
import { PortfolioContext } from '../../context/PortfolioContext'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip} from 'recharts'
export function HoldingsChart() {
    const {portfolioData, isLoading, error} = useContext(PortfolioContext)

    if (isLoading) {
        return <p>Đang tải dữ liệu portfolio...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    const chartData = portfolioData.map(coin => ({
        name: coin.name,
        value: coin.amount * coin.current_price,
    }))
    console.log("chartData", chartData)

    return(
        <section className='chart-section'>
            <h2>Phân Bổ Danh Mục</h2>
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        />
                        <Tooltip />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}