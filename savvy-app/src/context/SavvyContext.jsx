import { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import { AppContext } from "./AppContext.jsx";

export const SavvyContext = createContext();

// ─────────────────────────────────────────────────────────────
// MESSAGE FACTORY - Tạo messages động theo context
// ─────────────────────────────────────────────────────────────
const createMessage = {
  celebration: (goalTitle) => 
    `Chúc mừng! Bạn đã hoàn thành mục tiêu: ${goalTitle}`,
  
  deleteTransaction: () => 
    'Bạn có chắc muốn xóa giao dịch này không?',
  
  deleteGoal: () => 
    'Bạn có chắc chắn muốn xóa mục tiêu này không? Tất cả các khoản tiết kiệm liên quan cũng sẽ bị xóa vĩnh viễn.',
  
  deleteCompletedGoal: () => 
    'Bạn có chắc muốn xóa mục tiêu này khỏi lịch sử không?',
};

// ─────────────────────────────────────────────────────────────
// SAVVY PROVIDER COMPONENT
// ─────────────────────────────────────────────────────────────
export function SavvyProvider({ children }) {
  // ✅ Lấy functions từ AppContext để mở modals
  const { openConfirmationModal, openCelebrationModal } = useContext(AppContext);

  // ─────────────────────────────────────────
  // STATE: SAVINGS (Tiền tiết kiệm)
  // ─────────────────────────────────────────
  const [savings, setSavings] = useState(() => {
    const savedSavings = localStorage.getItem('savvy-savings');
    return savedSavings ? JSON.parse(savedSavings) : [];
  });

  // ─────────────────────────────────────────
  // STATE: GOALS (Mục tiêu)
  // ─────────────────────────────────────────
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('savvy-goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });

  // ─────────────────────────────────────────
  // STATE: COMPLETED GOALS (Mục tiêu đã hoàn thành)
  // ─────────────────────────────────────────
  const [completedGoals, setCompletedGoals] = useState(() => {
    const savedCompletedGoals = localStorage.getItem('completeGoals_data');
    return savedCompletedGoals ? JSON.parse(savedCompletedGoals) : [];
  });

  // ─────────────────────────────────────────
  // STATE: UI (Modal states)
  // ─────────────────────────────────────────
  const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [currentTargetGoalId, setCurrentTargetGoalId] = useState(null);

  // ─────────────────────────────────────────
  // SIDE EFFECTS: Persist to localStorage
  // ─────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('savvy-savings', JSON.stringify(savings));
    localStorage.setItem('savvy-goals', JSON.stringify(goals));
    localStorage.setItem('completeGoals_data', JSON.stringify(completedGoals));
    console.log('Dữ liệu đã được lưu vào Local Storage');
  }, [savings, goals, completedGoals]);

  // ─────────────────────────────────────────
  // HANDLERS: Saving Modal
  // ─────────────────────────────────────────
  const handleOpenAddSavingModal = useCallback((goalId) => {
    setIsAddSavingModalOpen(true);
    setCurrentTargetGoalId(goalId);
    console.log('Mở modal thêm giao dịch');
  }, []);

  const handleCloseAddSavingModal = useCallback(() => {
    setIsAddSavingModalOpen(false);
    setCurrentTargetGoalId(null);
    console.log('Đóng modal thêm giao dịch');
  }, []);

  const handleAddSaving = useCallback((newSavingData) => {
    const newCompleteSaving = {
      ...newSavingData,
      id: `s_${new Date().getTime()}`, // Tạo unique ID
      date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
      goalId: currentTargetGoalId,
    };
    setSavings((prevSavings) => [newCompleteSaving, ...prevSavings]);
    console.log('Đã thêm giao dịch tiết kiệm:', newCompleteSaving);
  }, [currentTargetGoalId]);

  // ─────────────────────────────────────────
  // HANDLERS: Goal Modal
  // ─────────────────────────────────────────
  const handleOpenGoalModal = useCallback(() => {
    setIsAddGoalModalOpen(true);
    console.log('Mở modal thêm mục tiêu');
  }, []);

  const handleCloseAddGoalModal = useCallback(() => {
    setIsAddGoalModalOpen(false);
    console.log('Đóng modal thêm mục tiêu');
  }, []);

  const handleAddGoal = useCallback((newGoalData) => {
    const newCompleteGoal = {
      ...newGoalData,
      id: `g_${new Date().getTime()}`, // Tạo unique ID
    };
    setGoals((prevGoals) => [newCompleteGoal, ...prevGoals]);
    console.log('Đã thêm mục tiêu:', newCompleteGoal);
  }, []);

  // ─────────────────────────────────────────
  // HANDLERS: Delete Saving
  // ─────────────────────────────────────────
  const handleDeleteSaving = useCallback((savingIdToDelete) => {
    setSavings((prevSavings) =>
      prevSavings.filter((saving) => saving.id !== savingIdToDelete)
    );
    console.log('Đã xóa giao dịch:', savingIdToDelete);
  }, []);

  // ─────────────────────────────────────────
  // HANDLERS: Delete Goal
  // ─────────────────────────────────────────
  const handleDeleteGoal = useCallback(
    (goalIdToDelete) => {
      // ✅ Dùng message factory
      const message = createMessage.deleteGoal();

      const onConfirmDelete = () => {
        // Xóa goal
        setGoals((prevGoals) =>
          prevGoals.filter((goal) => goal.id !== goalIdToDelete)
        );

        // Xóa tất cả savings liên quan đến goal này
        setSavings((prevSavings) =>
          prevSavings.filter((saving) => saving.goalId !== goalIdToDelete)
        );

        console.log('Đã xóa mục tiêu:', goalIdToDelete);
      };

      // ✅ Gọi AppContext để mở confirmation modal
      openConfirmationModal(message, onConfirmDelete);
    },
    [openConfirmationModal]
  );

  // ─────────────────────────────────────────
  // HANDLERS: Delete Completed Goal
  // ─────────────────────────────────────────
  const handleDeleteCompletedGoal = useCallback(
    (goalIdToDelete) => {
      // ✅ Dùng message factory
      const message = createMessage.deleteCompletedGoal();

      const onConfirmDelete = () => {
        setCompletedGoals((prevCompletedGoals) =>
          prevCompletedGoals.filter((goal) => goal.id !== goalIdToDelete)
        );
        console.log('Đã xóa mục tiêu khỏi lịch sử:', goalIdToDelete);
      };

      // ✅ Gọi AppContext để mở confirmation modal
      openConfirmationModal(message, onConfirmDelete);
    },
    [openConfirmationModal]
  );

  // ─────────────────────────────────────────
  // TASK 15.2: MARK GOAL AS COMPLETE
  // ─────────────────────────────────────────
  const markGoalAsComplete = useCallback(
    (goalId) => {
      // 1️⃣ Tìm goal cần hoàn thành
      const goalToComplete = goals.find((goal) => goal.id === goalId);
      
      if (!goalToComplete) {
        console.error('Goal not found:', goalId);
        return;
      }

      console.log(`Hoàn thành mục tiêu: ${goalToComplete.title}`);

      // 2️⃣ Di chuyển goal từ goals → completedGoals
      setCompletedGoals((prevCompleted) => [
        ...prevCompleted,
        {
          ...goalToComplete,
          completedAt: new Date().toISOString(), // Ghi nhận thời điểm hoàn thành
        },
      ]);

      setGoals((prevGoals) =>
        prevGoals.filter((goal) => goal.id !== goalId)
      );

      // 3️⃣ ✅ Gọi AppContext để mở celebration modal
      // ✅ Dùng message factory để tạo message động
      const celebrationMessage = createMessage.celebration(goalToComplete.title);
      openCelebrationModal(celebrationMessage);

      console.log('✅ Modal chúc mừng sẽ hiển thị');
    },
    [goals, openCelebrationModal]
  );

  // ─────────────────────────────────────────
  // DERIVED DATA: Calculate totalSavings
  // ─────────────────────────────────────────
  const totalSavings = useMemo(() => {
    return savings.reduce((sum, currentSaving) => {
      return sum + currentSaving.amount;
    }, 0);
  }, [savings]);

  // ─────────────────────────────────────────
  // DERIVED DATA: Enrich goals with currentAmount
  // ─────────────────────────────────────────
  const goalsWithCurrentAmount = useMemo(() => {
    return goals.map((goal) => {
      // Tìm tất cả savings liên quan đến goal này
      const relevantSavings = savings.filter((s) => s.goalId === goal.id);

      // Tính tổng tiền đã tiết kiệm cho goal này
      const currentAmount = relevantSavings.reduce((total, s) => {
        return total + s.amount;
      }, 0);

      // Trả về goal kèm theo currentAmount
      return {
        ...goal,
        currentAmount: currentAmount,
      };
    });
  }, [goals, savings]);

  // ─────────────────────────────────────────
  // CONTEXT VALUE - Đóng gói tất cả functions & state
  // ─────────────────────────────────────────
  const value = useMemo(
    () => ({
      // --- GOALS ---
      goals: goalsWithCurrentAmount, // Goals kèm currentAmount
      completedGoals,
      isAddGoalModalOpen,
      handleOpenGoalModal,
      handleCloseAddGoalModal,
      handleAddGoal,
      handleDeleteGoal,
      handleDeleteCompletedGoal,
      markGoalAsComplete, // ✅ TASK 15.2

      // --- SAVINGS ---
      savings,
      totalSavings,
      isAddSavingModalOpen,
      currentTargetGoalId,
      handleOpenAddSavingModal,
      handleCloseAddSavingModal,
      handleAddSaving,
      handleDeleteSaving,
    }),
    [
      goalsWithCurrentAmount,
      completedGoals,
      isAddGoalModalOpen,
      handleOpenGoalModal,
      handleCloseAddGoalModal,
      handleAddGoal,
      handleDeleteGoal,
      handleDeleteCompletedGoal,
      markGoalAsComplete,
      savings,
      totalSavings,
      isAddSavingModalOpen,
      currentTargetGoalId,
      handleOpenAddSavingModal,
      handleCloseAddSavingModal,
      handleAddSaving,
      handleDeleteSaving,
    ]
  );

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <SavvyContext.Provider value={value}>
      {children}
    </SavvyContext.Provider>
  );
}