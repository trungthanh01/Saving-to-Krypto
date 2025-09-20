import { GoalCard } from './components/GoalCard.jsx';
import { SavingHistoryItem } from './components/SavingHistoryItem.jsx';
import { AddButton } from './components/AddButton.jsx';
import {AddSavingForm} from './components/AddSavingForm.jsx'
import './App.css';
import {useState} from 'react'
import { AddGoalForm } from './components/AddGoalForm.jsx';

  // --- DỮ LIỆU GIẢ (MOCK DATA) ---
   
 const initialSavings = [
  {
    id: 's1',
    amount: 50,
    description: 'Tiền thưởng dự án',
    date: '2025-09-18',
    category: 'Thu nhập',
    goalId: 'g1'
  },
  {
    id: 's2',
    amount: 25,
    description: 'Bán sách cũ',
    date: '2025-09-15',
    category: 'Bán đồ',
    goalId: 'g1'
  },
  {
    id: 's3',
    amount: 10,
    description: 'Được tặng',
    date: '2025-09-12',
    category: 'Quà tặng',
    goalId: 'g2'
  },
];

const initialGoals = [
  {
    id: 'g1',
    title: 'Mua tai nghe mới',
    targetAmount: 300,
  },
  {
    id: 'g2',
    title: 'Đi du lịch Đà Lạt',
    targetAmount: 1000,
  },
];

  // --------------------------------
  export function App() {
    const [savings, setSavings] = useState(initialSavings)
    const [goals, setGoals] = useState(initialGoals)
    const [isAddSavingModalOpen, setIsAddSavingModalOpen] = useState(false)
    const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false)
    const [currentTargetGoalId, setCurrentTargetGoalId] = useState(null)

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
                  amount={transaction.amount}
                  description={transaction.description}
                  date={transaction.date}
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

