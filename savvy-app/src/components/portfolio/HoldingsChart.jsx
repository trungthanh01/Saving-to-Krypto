import { useContext } from "react";
import { PortfolioContext } from "../../context/PortfolioContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import styles from './HoldingsChart.module.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19AF'];

const CustomLegend = ({ payload }) => {
    return (
        <ul className={styles.legendList}>
            {payload.map((entry, index) => (
                <li key={`item-${index}`} className={styles.legendItem}>
                    <div className={styles.legendColorBox} style={{ backgroundColor: entry.color }} />
                    {entry.value} ({parseFloat(entry.payload.percent * 100).toFixed(2)}%)
                </li>
            ))}
        </ul>
    );
};

export function HoldingsChart() {
    const { portfolioData } = useContext(PortfolioContext);

    if (!portfolioData || portfolioData.length === 0) {
        return (
            <div className={styles.chartContainer}>
                <h3>Phân bổ Danh mục</h3>
                <p style={{ textAlign: 'center', color: '#a0a0d0' }}>Chưa có dữ liệu để hiển thị biểu đồ.</p>
            </div>
        );
    }

    const chartData = portfolioData.map(holding => ({
        name: holding.symbol.toUpperCase(),
        value: holding.currentValue
    }));

    return (
        <div className={styles.chartContainer}>
            <h3>Phân bổ Danh mục</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Legend content={<CustomLegend />} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}