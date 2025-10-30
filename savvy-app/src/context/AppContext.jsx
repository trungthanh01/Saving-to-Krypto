import React, { createContext, useState, useEffect, useRef, useMemo } from 'react';
import { fetchCoinList } from '../services/crypto-api';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  //1. global service state
  const [coinList, setCoinList] = useState([]);
  const [isCoinListLoading, setIsCoinListLoading] = useState(true);
  const [coinListError, setCoinListError] = useState('');

  const apiCallGuard = useRef(false);
  //2. UI State
  const [ui, setUi] = useState({
    theme: 'light', 
  })
  //3. Modal management State
  const [modals, setModals] = useState({
      addTransaction: {
        isOpen: false, 
        mode: 'add', 
        data: null 
      },

      confirmation: { 
        isOpen: false,
        message: '',
        onConfirm: null,
      },

      celebration: {
        isOpen: false,
        message: '',
      },
  })

  //Side Effect: fetch coin list once
  useEffect( () => {
    if(apiCallGuard.current) return;

    const loadCoinList = async () => {
      try {
        setIsCoinListLoading(true);
        const list = await fetchCoinList();
        setCoinList(list);
        setCoinListError(null);
      } catch (error) {
        console.error('Error fetching coin list', error);
        setCoinListError('Failed to load coin list. Please try again');
      } finally {
        setIsCoinListLoading(false)
      }
    }
    loadCoinList();
    apiCallGuard.current = true; //mark as fetch
  }, []); //run once

  //Handle functions: AddTransactionModal
  const openAddTransactionModal = (mode = 'add', data = null) => {
    setModals( (prev) => ({
      ...prev,
      addTransaction: {
        isOpen: true,
        mode,
        data,
      },
    }));
  };

  const closeAddTransactionModal = () => {
    setModals( (prev) => ({
      ...prev,
      addTransaction: {
        isOpen: false,
        mode,
        data,
      },
    }));
  };

  //Handle functions: ConfirmationModal
  const openConfirmationModal = (message, onConfirmCallback) => {
    setModals( (prev) => ({
      ...prev,
      confirmation: {
        isOpen: true,
        message,
        onConfirm: onConfirmCallback,
      },
    }));
  };

  const closeConfirmationModal = () => {
    setModals( (prev) => ({
      ...prev,
      confirmation: {
        isOpen: false,
        message: '',
        onConfirm: null,
      },
    }));
  };

  const handleConfirm = () => {
    //make sure onConfirm is a function before calling
    if (typeof modals.confirmation.onConfirm === 'function') {
      modals.confirmation.onConfirm();
    }
    closeConfirmationModal();
  }

  //Handle function: Celebration Modal
  const openCelebrationModal = (message) => {
    setModals( (prev) => ({
      ...prev,
      celebration: {
        isOpen: true,
        message,
      },
    }));
  };

  const closeCelebrationModal = () => {
    setModals ( (prev) => ({
      ...prev,
      celebration: {
        isOpen: false,
        message: '',
      },
    }));
  };

  //Handle function: UI Theme
  const setTheme = (theme) => {
    setUi( (prev) => ({
      ...prev,
      theme, //light or dảk dảk 
    }));
  };

  //Context Value
  const value = useMemo( () => ({
    //global services
    coinList,
    isCoinListLoading,
    coinListError,

    //UI theme
    ui,
    setTheme,

    //modals
    modals,

    //Add Transaction modal fuction
    openAddTransactionModal,
    closeAddTransactionModal,

    //Confirmation modal function
    openConfirmationModal,
    closeConfirmationModal,

    //celebration modal function
    openCelebrationModal,
    closeCelebrationModal,
  }),
    [coinList, isCoinListLoading, coinListError, ui, modals]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
