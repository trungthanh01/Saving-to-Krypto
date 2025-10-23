import React from 'react';
import {useContext} from 'react'
import { GoalCard } from './GoalCard.jsx';
import { SavingHistoryItem } from './SavingHistoryItem.jsx';
import { AddButton } from './AddButton.jsx';
import {AddSavingForm} from './AddSavingForm.jsx'
import { AddGoalForm } from './AddGoalForm.jsx';
import { SavvyContext } from '../../context/SavvyContext.jsx';
import { GoalHistory } from './GoalHistory.jsx';

export function Savvy() {
    const {
        savings,
        goals,
        isAddSavingModalOpen,
        isAddGoalModalOpen,
        goalMessage,
        handleOpenAddSavingModal,
        handleCloseAddSavingModal,
        handleAddSaving,
        handleOpenGoalModal,
        handleCloseAddGoalModal,
        handleAddGoal,
        handleDeleteSaving,
        handleDeleteGoal,
      } = useContext(SavvyContext);

    return(
        <>
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
          <GoalHistory />
        </>
    )
}