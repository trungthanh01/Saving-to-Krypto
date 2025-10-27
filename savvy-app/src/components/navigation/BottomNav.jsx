import { NavLink } from 'react-router-dom';
import styles from './BottomNav.module.css';
import { FiGrid, FiBarChart2, FiTarget } from 'react-icons/fi';

export function BottomNav() {
    return (
        <nav className={styles.bottomNav}>
            <NavLink to="/" className={({ isActive }) => isActive ? styles.active : styles.link}>
                <FiGrid size={22} />
                <span>Dashboard</span>
            </NavLink>
            <NavLink to="/dca" className={({ isActive }) => isActive ? styles.active : styles.link}>
                <FiBarChart2 size={22} />
                <span>DCA</span>
            </NavLink>
            <NavLink to="/goals" className={({ isActive }) => isActive ? styles.active : styles.link}>
                <FiTarget size={22} />
                <span>Goals</span>
            </NavLink>
        </nav>
    );
}
