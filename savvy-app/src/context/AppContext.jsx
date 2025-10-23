import { createContext, useState, useCallback } from "react";

export const AppContext = createContext();

export function AppProvider({ children }) {
    const [confirmationModal, setConfirmationModal] = useState({
        isOpen: false,
        message: '',
        onConfirm: () => {},
    });

    const handleOpenConfirmationModal = useCallback((message, onConfirm) => {
        setConfirmationModal({
            isOpen: true,
            message: message,
            onConfirm: onConfirm,
        });
    }, []);

    const handleCloseConfirmationModal = useCallback(() => {
        setConfirmationModal(prev => ({ ...prev, isOpen: false }));
    }, []);

    const value = {
        confirmationModal,
        handleOpenConfirmationModal,
        handleCloseConfirmationModal,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}
