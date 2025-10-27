import React, { createContext, useState, useEffect } from 'react';
import { fetchCoinList } from '../services/crypto-api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- State cho Confirmation Modal ---
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    message: '',
    onConfirm: () => {},
  });

  // --- State cho Add/Edit Transaction Modal ---
  const [isAddTransactionModalOpen, setIsAddTransactionModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null); // State để giữ transaction cần sửa

  // ✅ --- State mới cho Danh sách Coin Toàn cục ---
  const [coinList, setCoinList] = useState([]);
  const [isCoinListLoading, setIsCoinListLoading] = useState(true);
  const [coinListError, setCoinListError] = useState(null);

  // ✅ useEffect để tải coinList một lần duy nhất
  useEffect(() => {
    const loadCoinList = async () => {
      try {
        setIsCoinListLoading(true);
        const list = await fetchCoinList();
        setCoinList(list);
        setCoinListError(null);
      } catch (error) {
        console.error("Lỗi khi tải danh sách coin toàn cục:", error);
        setCoinListError('Không thể tải danh sách coin.');
      } finally {
        setIsCoinListLoading(false);
      }
    };

    loadCoinList();
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy 1 lần
  
  // --- Functions cho Add/Edit Transaction Modal ---
  const openAddTransactionModal = (transaction = null) => {
    setEditingTransaction(transaction); // Nếu không có transaction, sẽ là null (chế độ Add)
    setIsAddTransactionModalOpen(true);
  };

  const closeAddTransactionModal = () => {
    setIsAddTransactionModalOpen(false);
    setEditingTransaction(null); // Reset khi đóng modal
  };

  const handleOpenConfirmationModal = ( message, onConfirmCallback ) => {
    setConfirmationModal({
      isOpen: true,
      message,
      onConfirm: onConfirmCallback,
    });
  };
  const handleCloseConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      message: '',
      onConfirm: null,
    });
  };


  const handleConfirm = () => {
    if(typeof confirmationModal.onConfirm === 'function') {
        confirmationModal.onConfirm();
      }
    handleCloseConfirmationModal();
}
  const value = {
    // Add/Edit Transaction Modal
    isAddTransactionModalOpen,
    editingTransaction,
    openAddTransactionModal,
    closeAddTransactionModal,
    
    // Confirmation Modal
    confirmationModal,
    handleOpenConfirmationModal,
    handleCloseConfirmationModal,
    handleConfirm,
    coinList,
    isCoinListLoading,
    coinListError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
