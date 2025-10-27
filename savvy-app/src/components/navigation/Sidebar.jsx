import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { DashboardPage } from '../../pages/DashboardPage.jsx';
import { DcaCalculatorPage } from '../../pages/DcaCalculatorPage.jsx';
import { GoalsPage } from '../../pages/GoalsPage.jsx';

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>Savvy</h2>
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? styles.active : ''}>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/dca" className={({ isActive }) => isActive ? styles.active : ''}>
                            DCA Calculator
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/goals" className={({ isActive }) => isActive ? styles.active : ''}>
                            Goals
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}