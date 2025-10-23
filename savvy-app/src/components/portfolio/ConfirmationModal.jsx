import './ConfirmationModal.css';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

export function ConfirmationModal() {
    const { confirmationModal, handleCloseConfirmationModal } = useContext(AppContext);
    const { onConfirm, isOpen, message } = confirmationModal;
    if (!isOpen) return null;
    const handleConfirm = () => {
        onConfirm();
        handleCloseConfirmationModal();
    }
    return (
        <div className="overlay" onClick={handleCloseConfirmationModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <header className="header">
                    <h2>Xác nhận</h2>
                </header>
                <div className="content">
                    <span>{message}</span>
                </div>
                <footer className="actions">
                    <button className="confirm-btn" onClick= {handleConfirm}>Xác nhận</button>
                    <button className="cancel-btn" onClick={handleCloseConfirmationModal}>Hủy</button>
                </footer>
            </div>
        </div>
    );
}