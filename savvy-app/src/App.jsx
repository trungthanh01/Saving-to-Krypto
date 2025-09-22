import { GoalCard } from './components/GoalCard.jsx';
import { SavingHistoryItem } from './components/SavingHistoryItem.jsx';
import { AddButton } from './components/AddButton.jsx';
import {AddSavingForm} from './components/AddSavingForm.jsx'
import './App.css';
import {useState, useEffect} from 'react'
import { AddGoalForm } from './components/AddGoalForm.jsx';


  export function App() {
    const [savings, setSavings] = useState(() => {
      const savedSavings = localStorage.getItem('savvy-savings');
      // Nếu có dữ liệu trong Local Storage thì dùng, nếu không thì bắt đầu với mảng rỗng
      return savedSavings ? JSON.parse(savedSavings) : [];
    });
    const [goals, setGoals] = useState(() => {
      const savedGoals = localStorage.getItem('savvy-goals');
      // Tương tự, ưu tiên Local Storage, nếu không thì bắt đầu với mảng rỗng
      return savedGoals ? JSON.parse(savedGoals) : [];
    });
    const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false)
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
    const [currentTargetGoalId, setCurrentTargetGoalId] = useState(null)

    //Local storage
    useEffect(() => {
      localStorage.setItem('savvy-savings', JSON.stringify(savings));
      localStorage.setItem('savvy-goals', JSON.stringify(goals));
      console.log('Dữ liệu đã được lưu vào Local Storage')
    }, [savings, goals])

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
      //cập nhật state đặt các khoản tiết kiệm lên đầu danh sách
      setSavings([newCompleteSaving,...savings])
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
    
    return (
      <div className='app-container'>
        <header className='app-header'>
          <h1>Savvy</h1>
        </header>
        <main>
          <section className='goals-section'>
          <div className="section-header">
              <h2>Mục Tiêu Của Bạn</h2>
              <AddButton onClick={handleOpenGoalModal}>
                Thêm Mục Tiêu
              </AddButton>
            </div>
            <div className='goals-list'>
              {goals.map((goal) => 
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  savings={savings}
                  onAddSavingClick={handleOpenAddSavingModal}
                  onDelete={handleDeleteGoal}
                  
                />
              )}
            </div>
          </section>


          <section className="history-section">
            <div className="section-header">
              <h2>Lịch sử giao dịch</h2>
            </div>
            <div className="history-list"> 
              {savings.map((transaction) => (
                <SavingHistoryItem
                  key={transaction.id}
                  id={transaction.id}
                  amount={transaction.amount}
                  description={transaction.description}
                  date={transaction.date}
                  onDelete={handleDeleteSaving}
                />
              ))}
            </div>
          </section>
          <AddSavingForm
            isOpen={isAddSavingModalOpen}
            onClose={handleCloseAddSavingModal}
            onAddSaving={handleAddSaving}
          />
          <AddGoalForm
            isOpen={isAddGoalModalOpen}
            onClose={handleCloseAddGoalModal}
            onAddGoal={handleAddGoal}
          />
        </main>
      </div> 
    );
  }

