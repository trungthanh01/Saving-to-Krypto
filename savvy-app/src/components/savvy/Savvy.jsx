import { useContext } from 'react';
import { SavvyContext } from '../../context/SavvyContext';
import { GoalCard } from './GoalCard';
import { GoalHistory } from './GoalHistory';
import { AddGoalForm } from './AddGoalForm';
import { AddSavingForm } from './AddSavingForm';
import { AddButton } from './AddButton';
import styles from './Savvy.module.css';

export function Savvy() {
  const {
    goals,
    completedGoals,
    isAddGoalModalOpen,
    isAddSavingModalOpen,
    handleOpenGoalModal,
    handleCloseAddGoalModal,
    handleCloseAddSavingModal,
    handleAddGoal,
    handleAddSaving,
    handleDeleteGoal,
    handleDeleteSaving,
    handleOpenAddSavingModal,
    savings,
  } = useContext(SavvyContext);

  return (
    <div className={styles.container}>
      {/* ===== ACTION BAR ===== */}
      <div className={styles.actionBar}>
        <p className={styles.goalCount}>
          {goals.length > 0 
            ? `${goals.length} mục tiêu đang thực hiện`
            : 'Chưa có mục tiêu nào'
          }
        </p>
        <AddButton onClick={handleOpenGoalModal} label="Thêm mục tiêu" />
      </div>

      {/* ===== GOALS LIST ===== */}
      <section className={styles.goalsSection}>
        {goals.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎯</div>
            <h3>Bắt đầu hành trình tiết kiệm!</h3>
            <p>Tạo mục tiêu đầu tiên để theo dõi tiến độ của bạn.</p>
          </div>
        ) : (
          <div className={styles.goalsList}>
            {goals.map((goal) => {
              const goalSavings = savings.filter((s) => s.goalId === goal.id);
              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  savings={goalSavings}
                  onDelete={() => handleDeleteGoal(goal.id)}
                  onAddSaving={() => handleOpenAddSavingModal(goal.id)}
                  onDeleteSaving={handleDeleteSaving}
                />
              );
            })}
          </div>
        )}
      </section>

      {/* ===== HISTORY SECTION ===== */}
      {completedGoals.length > 0 && (
        <section className={styles.historySection}>
          <GoalHistory />
        </section>
      )}

      {/* ===== MODALS ===== */}
      {isAddGoalModalOpen && (
        <AddGoalForm onClose={handleCloseAddGoalModal} onAddGoal={handleAddGoal} />
      )}

      {isAddSavingModalOpen && (
        <AddSavingForm onClose={handleCloseAddSavingModal} onAddSaving={handleAddSaving} />
      )}
    </div>
  );
}

