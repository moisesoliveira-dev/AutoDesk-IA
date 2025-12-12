import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Ticket, KnowledgeBaseItem, User, ReportSchedule } from './types';
import { INITIAL_KB, INITIAL_TICKETS, MOCK_USERS, DEFAULT_SECTORS, DEFAULT_REPORT_SCHEDULES } from './constants';

// Layout & Auth
import AppLayout from './components/layout/AppLayout';
import LoginScreen from './components/auth/LoginScreen';

// Pages
import DashboardPage from './app/dashboard/page';
import TicketPage from './app/ticket/page';
import NewTicketPage from './app/new/page';
import KBPage from './app/kb/page';
import UsersPage from './app/users/page';
import SectorsPage from './app/sectors/page';
import ReportsPage from './app/reports/page';
import ReportSettingsPage from './app/report-settings/page';

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [kb, setKb] = useState<KnowledgeBaseItem[]>(INITIAL_KB);
  const [sectors, setSectors] = useState<string[]>(DEFAULT_SECTORS);
  const [reportSchedules, setReportSchedules] = useState<ReportSchedule[]>(DEFAULT_REPORT_SCHEDULES);

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const addTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleUpdateKb = (newKb: KnowledgeBaseItem[]) => {
    setKb(newKb);
  };

  const handleUpdateUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleAddSector = (newSector: string) => {
    if (!sectors.includes(newSector)) {
      setSectors([...sectors, newSector]);
    }
  };

  const handleRemoveSector = (sectorToRemove: string) => {
    setSectors(sectors.filter(s => s !== sectorToRemove));
  };

  const handleUpdateSchedules = (updatedSchedules: ReportSchedule[]) => {
    setReportSchedules(updatedSchedules);
  };

  if (!user) {
    return <LoginScreen users={users} onLogin={setUser} />;
  }

  return (
    <HashRouter>
      <AppLayout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<DashboardPage tickets={tickets} user={user} />} />
          <Route 
            path="/ticket/:id" 
            element={
              <TicketPage 
                tickets={tickets} 
                user={user} 
                onUpdateTicket={handleUpdateTicket} 
              />
            } 
          />
          <Route 
            path="/new" 
            element={
              <NewTicketPage 
                onAddTicket={addTicket} 
                kb={kb} 
                user={user}
                availableSectors={sectors}
              />
            } 
          />
          <Route 
            path="/kb" 
            element={
              user.role === 'REQUESTER' ? (
                <Navigate to="/" />
              ) : (
                <KBPage 
                  items={kb} 
                  onUpdateKb={handleUpdateKb} 
                  user={user} 
                  tickets={tickets}
                  availableSectors={sectors}
                />
              )
            } 
          />
          <Route 
            path="/users" 
            element={
              user.role !== 'ADMIN' ? (
                <Navigate to="/" />
              ) : (
                <UsersPage 
                  users={users} 
                  currentUser={user}
                  onUpdateRole={handleUpdateUserRole} 
                />
              )
            } 
          />
          <Route 
            path="/sectors" 
            element={
              user.role !== 'ADMIN' ? (
                <Navigate to="/" />
              ) : (
                <SectorsPage 
                  sectors={sectors}
                  onAddSector={handleAddSector}
                  onRemoveSector={handleRemoveSector}
                />
              )
            } 
          />
          <Route 
            path="/reports" 
            element={
              (user.role === 'ADMIN' || user.role === 'SUPPORT') ? (
                <ReportsPage 
                  tickets={tickets}
                  sectors={sectors}
                />
              ) : (
                <Navigate to="/" />
              )
            } 
          />
          <Route 
            path="/report-settings" 
            element={
              user.role !== 'ADMIN' ? (
                <Navigate to="/" />
              ) : (
                <ReportSettingsPage 
                  schedules={reportSchedules}
                  onUpdateSchedules={handleUpdateSchedules}
                  availableSectors={sectors}
                />
              )
            } 
          />
        </Routes>
      </AppLayout>
    </HashRouter>
  );
};

export default App;