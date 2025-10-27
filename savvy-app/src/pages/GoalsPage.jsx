import { Savvy } from '../components/savvy/Savvy';
import { SmartSuggestions } from '../components/portfolio/SmartSuggestions';
import { MainHeader } from '../components/common/MainHeader';
import styles from './GoalsPage.module.css';

export function GoalsPage() {
    return (
        <>
            <MainHeader title="Mục tiêu" />
            <div className={styles.goalsLayout}>
                <div className={styles.mainContent}>
                    <Savvy />
                </div>
                <div className={styles.sideContent}>
                    <SmartSuggestions />
                </div>
            </div>
        </>
    );
}
