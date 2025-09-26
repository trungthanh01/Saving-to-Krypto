import './HoldingsChart.css'
import { useContext } from 'react'
import { PortfolioContext } from '../../context/PortfolioContext'
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip} from 'recharts'
// Thêm một mảng màu sắc để biểu đồ sinh động hơn
const COLORS = [
    '#FFBB28', 
    '#00C49F', 
    '#0088FE', 
    '#FF8042', 
    '#AF19FF', 
    '#FF1943'];
    
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
    console.log("Dữ liệu cho biểu đồ:", chartData);

    // Xử lý trường hợp không có dữ liệu để vẽ
    if (chartData.length === 0) {
      return (
        <section className="chart-section">
          <h2>Phân bổ Danh mục</h2>
          <p>Không có dữ liệu để hiển thị biểu đồ.</p>
        </section>
      )
    }

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
                            labelLine={false}
                            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                              const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                              const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                              const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                              // Chỉ hiển thị label nếu % lớn hơn 5%
                              if (percent * 100 > 5) {
                                return (
                                  <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                                    {`${(percent * 100).toFixed(0)}%`}
                                  </text>
                                );
                              }
                              return null;
                            }}
                        >
                          {/* Dùng map để gán màu cho từng phần */}
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </section>
    )
}