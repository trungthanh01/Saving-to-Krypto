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
