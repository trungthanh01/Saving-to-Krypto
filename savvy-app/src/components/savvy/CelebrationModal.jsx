import './CelebrationModal.css';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';

export function CelebrationModal() {
    const { modals, closeCelebrationModal  } = useContext(AppContext);
    if (!modals.isOpen){ 
        return null; 
    }
    return (
        <div className="celebration-overlay" onClick={closeCelebrationModal}>
            <div className="celebration-modal" onClick={(e) => e.stopPropagation()}>
                <div className="celebration-content">
                    <h2>🎉 Chúc Mừng! 🎉</h2>
                    <p>
                        Bạn đã hoàn thành mục tiêu: <br/> 
                        <strong>{modals.celebration.message}</strong>
                    </p>
                    <p>Hãy tiếp tục hành trình tích lũy của mình nhé!</p>
                </div>
               <button 
                    className="celebration-close-btn" 
                    onClick={closeCelebrationModal}>
                        &times;
                </button>
            </div>
        </div>
    )
}