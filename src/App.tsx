import React, { useState, useEffect } from 'react';
import { TabType, BudgetItem, Transaction, NotificationItem, UserProfile } from './types';
import {
  INITIAL_USER,
  INITIAL_BUDGETS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
} from './data/initialData';
import { Navigation } from './components/Navigation';
import { HomeTab } from './components/HomeTab';
import { BudgetTab } from './components/BudgetTab';
import { HistoryTab } from './components/HistoryTab';
import { AnalysisTab } from './components/AnalysisTab';
import { AddBudgetModal } from './components/Modals/AddBudgetModal';
import { AddExpenseModal } from './components/Modals/AddExpenseModal';
import { EditBudgetModal } from './components/Modals/EditBudgetModal';
import { ProfileModal } from './components/Modals/ProfileModal';
import { NotificationsPopover } from './components/Modals/NotificationsPopover';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  // State initialization with localStorage fallback
  const [activeTab, setActiveTab] = useState<TabType>('budget'); // Default to Budget tab as in user screenshot

  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('wt_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [budgets, setBudgets] = useState<BudgetItem[]>(() => {
    try {
      const saved = localStorage.getItem('wt_budgets');
      return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
    } catch {
      return INITIAL_BUDGETS;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem('wt_transactions');
      return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('wt_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Modal visibility states
  const [showCreateBudgetModal, setShowCreateBudgetModal] = useState(false);
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [preselectedBudget, setPreselectedBudget] = useState<BudgetItem | null>(null);
  const [editingBudget, setEditingBudget] = useState<BudgetItem | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync state to local storage
  useEffect(() => {
    try {
      localStorage.setItem('wt_user', JSON.stringify(user));
      localStorage.setItem('wt_budgets', JSON.stringify(budgets));
      localStorage.setItem('wt_transactions', JSON.stringify(transactions));
      localStorage.setItem('wt_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  }, [user, budgets, transactions, notifications]);

  // Handlers
  const handleCreateBudget = (newBudget: Omit<BudgetItem, 'id' | 'createdAt'>) => {
    const item: BudgetItem = {
      ...newBudget,
      id: `b-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setBudgets((prev) => [...prev, item]);
  };

  const handleEditBudget = (updated: BudgetItem) => {
    setBudgets((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
  };

  const handleDeleteBudget = (id: string) => {
    if (window.confirm('Are you sure you want to delete this budget category?')) {
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleSaveTransaction = (
    txData: Omit<Transaction, 'id'>,
    budgetId?: string
  ) => {
    const newTx: Transaction = {
      ...txData,
      id: `t-${Date.now()}`,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update budget spent amount if linked to a budget category
    if (budgetId && txData.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) => {
          if (b.id === budgetId) {
            const updatedSpent = b.spent + txData.amount;

            // Trigger notification if going over budget limit
            if (updatedSpent > b.limit) {
              const overAmount = updatedSpent - b.limit;
              const alertNotification: NotificationItem = {
                id: `n-${Date.now()}`,
                title: `Budget Exceeded: ${b.title}`,
                message: `${txData.title} of ${user.currency}${txData.amount} exceeded ${b.title} limit by ${user.currency}${overAmount}.`,
                date: new Date().toISOString(),
                type: 'warning',
                read: false,
              };
              setNotifications((n) => [alertNotification, ...n]);
            }

            return { ...b, spent: updatedSpent };
          }
          return b;
        })
      );
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx && tx.budgetId && tx.type === 'expense') {
      setBudgets((prev) =>
        prev.map((b) =>
          b.id === tx.budgetId ? { ...b, spent: Math.max(0, b.spent - tx.amount) } : b
        )
      );
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleResetData = () => {
    setUser(INITIAL_USER);
    setBudgets(INITIAL_BUDGETS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] font-sans antialiased pb-20 md:pb-0">
        <Navigation
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          user={user}
          notifications={notifications}
          showNotifications={showNotifications}
          setShowNotifications={setShowNotifications}
          onOpenProfile={() => setShowProfileModal(true)}
        />

        {/* Notifications Popover Dropdown */}
        <NotificationsPopover
          isOpen={showNotifications}
          onClose={() => setShowNotifications(false)}
          notifications={notifications}
          onMarkAllRead={handleMarkAllRead}
          onClearAll={handleClearAllNotifications}
        />

        {/* Main Canvas Container */}
        <main className="md:ml-64 p-4 md:p-10 max-w-7xl mx-auto pt-20 md:pt-8">
          {activeTab === 'home' && (
            <HomeTab
              user={user}
              budgets={budgets}
              transactions={transactions}
              currency={user.currency}
              onOpenAddExpense={() => {
                setPreselectedBudget(null);
                setShowAddExpenseModal(true);
              }}
              onGoToTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'budget' && (
            <BudgetTab
              budgets={budgets}
              totalMonthlyBudget={user.monthlyGoal}
              currency={user.currency}
              onOpenCreateBudget={() => setShowCreateBudgetModal(true)}
              onAddExpense={(budget) => {
                setPreselectedBudget(budget);
                setShowAddExpenseModal(true);
              }}
              onEditBudget={(budget) => setEditingBudget(budget)}
              onDeleteBudget={handleDeleteBudget}
            />
          )}

          {activeTab === 'history' && (
            <HistoryTab
              transactions={transactions}
              budgets={budgets}
              currency={user.currency}
              onOpenAddExpense={() => {
                setPreselectedBudget(null);
                setShowAddExpenseModal(true);
              }}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}

          {activeTab === 'analysis' && (
            <AnalysisTab
              budgets={budgets}
              transactions={transactions}
              currency={user.currency}
            />
          )}
        </main>

        {/* Modals */}
        <AddBudgetModal
          isOpen={showCreateBudgetModal}
          onClose={() => setShowCreateBudgetModal(false)}
          onSave={handleCreateBudget}
          currency={user.currency}
        />

        <AddExpenseModal
          isOpen={showAddExpenseModal}
          onClose={() => {
            setShowAddExpenseModal(false);
            setPreselectedBudget(null);
          }}
          budgets={budgets}
          preselectedBudget={preselectedBudget}
          onSaveTransaction={handleSaveTransaction}
          currency={user.currency}
        />

        <EditBudgetModal
          isOpen={!!editingBudget}
          onClose={() => setEditingBudget(null)}
          budget={editingBudget}
          onSave={handleEditBudget}
          currency={user.currency}
        />

        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          user={user}
          onUpdateUser={setUser}
          onResetData={handleResetData}
        />
      </div>
    </ErrorBoundary>
  );
}
