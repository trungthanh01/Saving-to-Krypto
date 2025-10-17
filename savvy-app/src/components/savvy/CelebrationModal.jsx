import './CelebrationModal.css';
import { useContext } from 'react';
import { SavvyContext } from '../../context/SavvyContext.jsx';

export function CelebrationModal() {
    const { celebrationModal, handleCloseCelebrationModal } = useContext(SavvyContext);
    if (!celebrationModal.isOpen){ 
        return null; 
    }
    return (
        <div className="celebration-overlay" onClick={handleCloseCelebrationModal}>
            <div className="celebration-modal" onClick={(e) => e.stopPropagation()}>
                <div className="celebration-content">
                    <h2>🎉 Chúc Mừng! 🎉</h2>
                    <p>
                        Bạn đã hoàn thành mục tiêu: <br/> 
                        <strong>{celebrationModal.goalName}</strong>
                    </p>
                    <p>Hãy tiếp tục hành trình tích lũy của mình nhé!</p>
                </div>
               <button className="celebration-close-btn" onClick={handleCloseCelebrationModal}>&times;</button>
            </div>
        </div>
        )
}