import { createContext, useState, useEffect, useMemo, useCallback, useContext } from "react";
import { AppContext } from "./AppContext.jsx";
export const SavvyContext = createContext();

export function SavvyProvider({children, goalMessage, setGoalMessage}) { // 2. Nhận setGoalMessage qua props
    
    const { handleOpenConfirmationModal } = useContext(AppContext);
    
    const [savings, setSavings] = useState(() => {
        const savedSavings = localStorage.getItem('savvy-savings');
        return savedSavings ? JSON.parse(savedSavings) : [];
    });
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem('savvy-goals');
        return savedGoals ? JSON.parse(savedGoals) : [];
    });
    const [completedGoals, setCompletedGoals] = useState(() => {
        const savedCompletedGoals = localStorage.getItem('completeGoals_data');
        return savedCompletedGoals ? JSON.parse(savedCompletedGoals) : [];
    })
    const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false)
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
    const [currentTargetGoalId, setCurrentTargetGoalId] = useState(null)
    const [celebrationModal, setCelebrationModal] = useState({
        isOpen: false,
        goalName: '',
    })
    const message = {
        deleteTransaction: 'Bạn có chắc muốn xóa giao dịch này không?',
      };

    useEffect(() => {
        localStorage.setItem('savvy-savings', JSON.stringify(savings));
        localStorage.setItem('savvy-goals', JSON.stringify(goals));
        localStorage.setItem('completeGoals_data', JSON.stringify(completedGoals));
        console.log('Dữ liệu đã được lưu vào Local Storage')
    }, [savings, goals, completedGoals])

    function handleOpenAddSavingModal(goalId){
        setIsAddSavingModalOpen(true)
        setCurrentTargetGoalId(goalId)
        console.log('Mở modal thêm giao dịch')
      }
      
    function handleCloseAddSavingModal(){
    setIsAddSavingModalOpen(false)
    setCurrentTargetGoalId(null)
    console.log('Đóng modal thêm giao dịch')
    }

    function handleAddSaving(newSavingData) {
        const newCompleteSaving = {
            ...newSavingData,
            id: `s_${new Date().getTime()}`,//tạo id
            date: new Date().toISOString().split('T')[0],//ngày
            goalId: currentTargetGoalId
        }
        setSavings([newCompleteSaving,...savings])
        setGoalMessage('Tốt lắm! Góp gió thành bão.') // 4. Sử dụng prop được truyền vào
    }

    const totalSavings = savings.reduce((sum, currentsaving)=>{
        return sum + currentsaving.amount
    },0) // '0' là số khởi điểm của sum

    function handleOpenGoalModal(){
        setIsAddGoalModalOpen(true)
    }
    function handleCloseAddGoalModal(){
        setIsAddGoalModalOpen(false)
    }
    function handleAddGoal(newGoalData){
        const newCompleteGoal = {
            ...newGoalData,
            id: `g_${new Date().getTime()}`
         }
        setGoals([newCompleteGoal,...goals])
    }
    function handleDeleteSaving(savingIdToDelete) {
        const newSavings = savings.filter(saving => 
            saving.id !== savingIdToDelete);
        setSavings(newSavings);
    }  
    function handleDeleteGoal(goalIdToDelete) {
        const onConfirmDelete = () => {
            const newGoals = goals.filter(goal => 
                goal.id !== goalIdToDelete);
            setGoals(newGoals);
            const newSavings = savings.filter(saving =>
                saving.goalId !== goalIdToDelete);
            setSavings(newSavings);
        };

        handleOpenConfirmationModal(
            'Bạn có chắc chắn muốn xóa mục tiêu này không? Tất cả các khoản tiết kiệm liên quan cũng sẽ bị xóa vĩnh viễn.',
            onConfirmDelete
        );
    }

    // SỬA LẠI HÀM NÀY
    function handleDeleteCompletedGoal(goalIdToDelete) {
        const onConfirmDelete = () => {
            const newCompletedGoals = completedGoals.filter(goal =>
                goal.id !== goalIdToDelete);
            setCompletedGoals(newCompletedGoals);
        };

        handleOpenConfirmationModal(
            'Bạn có chắc muốn xóa mục tiêu này khỏi lịch sử không?',
            onConfirmDelete
        );
    }
    
    const markGoalAsComplete = useCallback((goalId) => {
        const goalToComplete = goals.find(goal => goal.id === goalId);
        if(!goalToComplete) {
            console.error('Goal not found');
                return;
            }
            console.log(`Completing goal: ${goalToComplete.name}`)
            setCompletedGoals(prevCompleted => [...prevCompleted, goalToComplete]);
            setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
            setCelebrationModal({
                isOpen: true,
                goalName: goalToComplete.title,
            })
        }, [goals]);
        
    const handleCloseCelebrationModal = useCallback(() => {
        setCelebrationModal({
            isOpen: false,
            goalName: '',
        })
    }, [])

    // TẠO RA MỘT PHIÊN BẢN GOALS ĐẦY ĐỦ HƠN
    const goalsWithCurrentAmount = useMemo(() => {
        return goals.map(goal => {
            const relevantSavings = savings.filter(s => 
                s.goalId === goal.id);
            const currentAmount = relevantSavings.reduce((total, s) => 
                total + s.amount, 0);
            return {
                ...goal,
                currentAmount: currentAmount,
            };
        });
    }, [goals, savings]); // Tính lại khi goals hoặc savings thay đổi


    const value = {
        goals: goalsWithCurrentAmount, 
        savings,
        isAddSavingModalOpen,
        isAddGoalModalOpen,
        totalSavings,
        handleOpenAddSavingModal,
        handleCloseAddSavingModal,
        handleAddSaving,
        handleOpenGoalModal,
        handleCloseAddGoalModal,
        handleAddGoal,
        handleDeleteSaving,
        handleDeleteGoal,
        handleDeleteCompletedGoal,
        goalMessage, // <-- Đảm bảo dòng này tồn tại
        setGoalMessage,
        markGoalAsComplete,
        celebrationModal,
        handleCloseCelebrationModal,
        completedGoals,
    }
     return(
        <SavvyContext.Provider value={value}>
            {children}
        </SavvyContext.Provider>
    )
}