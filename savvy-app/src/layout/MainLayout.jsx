import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/navigation/Sidebar.jsx';
import styles from './MainLayout.module.css';

export function MainLayout() {
    return (
        <div className={styles.mainLayout}>
            <Sidebar />
            {/* SỬA Ở ĐÂY: Thêm className vào thẻ <main> */}
            <main className={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    )
}