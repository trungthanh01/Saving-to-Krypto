import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { FiGrid, FiTrendingUp, FiTarget } from 'react-icons/fi';

export function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>Savvy</h2>
            </div>
            <nav className={styles.nav}>
                <ul>
                    <li>
                        <NavLink 
                            to="/" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            <FiGrid size={20} />
                            <span>Dashboard</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/dca" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            <FiTrendingUp size={20} />
                            <span>DCA Calculator</span>
                        </NavLink>
                    </li>
                    <li>
                        <NavLink 
                            to="/goals" 
                            className={({ isActive }) => 
                                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
                            }
                        >
                            <FiTarget size={20} />
                            <span>Goals</span>
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}

