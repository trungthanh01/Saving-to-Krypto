import { useContext } from 'react';
import { PortfolioContext } from '../../context/PortfolioContext';
import { HoldingItem } from './HoldingItem';
import styles from './Portfolio.module.css';

export function Portfolio() {
  const { portfolioData, isLoading, error } = useContext(PortfolioContext);

  const renderContent = () => {
    if (isLoading) {
      return <p>Đang tải dữ liệu portfolio...</p>;
    }
    if (error) {
      return <p style={{ color: 'red' }}>{error}</p>;
    }
    if (!portfolioData || portfolioData.length === 0) {
      return <p>Danh mục đầu tư của bạn trống.</p>;
    }
    return (
      <div className={styles.tableWrapper}>
        <table className={styles.portfolioTable}>
          <thead>
            <tr>                                
              <th>Tên Coin</th>
              <th>Giá</th>
              <th>24h %</th>
              <th>Số lượng</th>
              <th>Giá trị</th>
              <th>Vốn</th>
              <th>Giá TB</th>
              <th>Lời/Lỗ</th>
            </tr>
          </thead>
          <tbody>
            {portfolioData.map(coin => (
              <HoldingItem key={coin.id} coin={coin}/>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <section className={styles.portfolioSection}>
      <div className={styles.header}>
        <h2>Danh mục Đầu tư</h2>
      </div>
      {renderContent()}
    </section>
  );
}