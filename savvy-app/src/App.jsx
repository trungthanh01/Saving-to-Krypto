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
  },
  {
    id: 's2',
    amount: 25,
    description: 'Bán sách cũ',
    date: '2025-09-15',
    category: 'Bán đồ',
  },
  {
    id: 's3',
    amount: 10,
    description: 'Được tặng',
    date: '2025-09-12',
    category: 'Quà tặng',
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
    function handleOpenSavingModal(){
      setIsAddSavingModalOpen(true)
      console.log('Mở modal thêm giao dịch')
    }
    
    function handleCloseSavingModal(){
      setIsAddSavingModalOpen(false)
      console.log('Đóng modal thêm giao dịch')
    }

    function handleAddSaving(newSavingData) {
      const newCompleteSaving = {
        ...newSavingData,
        id: `s_${new Date().getTime()}`,//tạo id
        date: new Date().toISOString().split('T')[0]//ngày
      }
      //cập nhật state đặt các khoản tiết kiệm lên đầu danh sách
      setSavings([
        newCompleteSaving,
        ...savings
      ])
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
      setGoals([
        newCompleteGoal,
        ...goals
      ])
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
              <AddButton >
                Thêm Giao Dịch
              </AddButton>
              <AddButton onClick={handleOpenGoalModal}>
                Thêm Mục Tiêu
              </AddButton>
            </div>
            <div className='goals-list'>
              {goals.map((goal) => 
                <GoalCard
                  key={goal.id}
                  title={goal.title}
                  targetAmount={goal.targetAmount}
                  currentsaving={totalSavings}
                />
              )}
            </div>
          </section>


          <section className="history-section">
            <div className="section-header">
              <h2>Lịch sử giao dịch</h2>
              <AddButton onClick={handleOpenSavingModal}>Thêm Giao Dịch</AddButton>
            </div>
            <div className="history-list"> 
              {savings.map((transaction) => (
                <SavingHistoryItem
                  key={transaction.id}
                  amount={transaction.amount}
                  description={transaction.description}
                  date={transaction.date}
                  category={transaction.category}
                />
              ))}
            </div>
          </section>
          <AddSavingForm
            isOpen={isAddSavingModalOpen}
            onClose={handleCloseSavingModal}
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

