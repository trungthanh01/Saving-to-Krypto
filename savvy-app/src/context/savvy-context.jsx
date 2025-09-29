import { createContext, useState, useEffect } from "react";
export const SavvyContext = createContext();

export function SavvyProvider({children}) {
    
    const [savings, setSavings] = useState(() => {
        const savedSavings = localStorage.getItem('savvy-savings');
        return savedSavings ? JSON.parse(savedSavings) : [];
    });
  
    const [goals, setGoals] = useState(() => {
        const savedGoals = localStorage.getItem('savvy-goals');
        return savedGoals ? JSON.parse(savedGoals) : [];
    });
    const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false)
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
    const [currentTargetGoalId, setCurrentTargetGoalId] = useState(null)
    const [goalMessage, setGoalMessage] = useState('')
      
    useEffect(() => {
        localStorage.setItem('savvy-savings', JSON.stringify(savings));
        localStorage.setItem('savvy-goals', JSON.stringify(goals));
        console.log('Dữ liệu đã được lưu vào Local Storage')
    }, [savings, goals])

    useEffect(() => {
        if (!goalMessage) {
            return;
        }
        const timerId = setTimeout(() => {
            setGoalMessage('');
        }, 3000);
        return () => {
            clearTimeout(timerId);
        };
    }, [goalMessage]); 

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
        setGoalMessage('Tốt lắm! Góp gió thành bão.')
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
        const userConfirmed = window.confirm(
            'Bạn có chắc chắn muốn xóa mục tiêu này không? Tất cả các khoản tiết kiệm liên quan cũng sẽ bị xóa vĩnh viễn.'
        )
        if (!userConfirmed) {
            return;
        }
        const newGoals = goals.filter(goal => 
            goal.id !== goalIdToDelete);
        setGoals(newGoals);
        const newSavings = savings.filter(saving =>
            saving.goalId !== goalIdToDelete);
        setSavings(newSavings)
    }


    const value = {
        savings,
        goals,
        isAddSavingModalOpen,
        isAddGoalModalOpen,
        goalMessage,
        totalSavings,
        handleOpenAddSavingModal,
        handleCloseAddSavingModal,
        handleAddSaving,
        handleOpenGoalModal,
        handleCloseAddGoalModal,
        handleAddGoal,
        handleDeleteSaving,
        handleDeleteGoal,
    }
     return(
        <SavvyContext.Provider value={value}>
            {children}
        </SavvyContext.Provider>
    )
}