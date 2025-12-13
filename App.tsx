import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Ticket, KnowledgeBaseItem, User, ReportSchedule, Role } from './types';
import { INITIAL_KB, INITIAL_TICKETS, MOCK_USERS, DEFAULT_SECTORS, DEFAULT_REPORT_SCHEDULES } from './constants';

// Layout & Auth
import AppLayout from './components/layout/AppLayout';
import LoginScreen from './components/auth/LoginScreen';

// Pages
import DashboardPage from './app/dashboard/page';
import MyTicketsPage from './app/my-tickets/page';
import TicketsQueuePage from './app/tickets-queue/page'; 
import TicketPage from './app/ticket/page';
import NewTicketPage from './app/new/page';
import KBPage from './app/kb/page';
import UsersPage from './app/users/page';
import SectorsPage from './app/sectors/page';
import ReportsPage from './app/reports/page';
import ReportSettingsPage from './app/report-settings/page';

const App: React.FC = () => {
  // Load users from localStorage to persist registrations
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('app_users');
    return saved ? JSON.parse(saved) : MOCK_USERS;
  });

  const [allowedDomain, setAllowedDomain] = useState<string>(() => {
    return localStorage.getItem('app_domain') || 'empresa.com';
  });

  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);
  const [kb, setKb] = useState<KnowledgeBaseItem[]>(INITIAL_KB);
  const [sectors, setSectors] = useState<string[]>(DEFAULT_SECTORS);
  const [reportSchedules, setReportSchedules] = useState<ReportSchedule[]>(DEFAULT_REPORT_SCHEDULES);

  // Persist users and settings
  useEffect(() => {
    localStorage.setItem('app_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('app_domain', allowedDomain);
  }, [allowedDomain]);

  // Handlers
  const handleRegister = (name: string, email: string, password: string, registrationNumber: string) => {
    const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        registrationNumber,
        password,
        role: 'REQUESTER',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        approved: false // Requires admin approval
    };
    setUsers(prev => [...prev, newUser]);
  };

  const handleUpdateUserRole = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (user && user.id === userId) {
      setUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const handleApproveUser = (userId: string, role: Role) => {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role, approved: true } : u));
  };

  const handleDeleteUser = (userId: string) => {
      setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleUpdateTicket = (updatedTicket: Ticket) => {
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
  };

  const addTicket = (ticket: Ticket) => {
    setTickets(prev => [ticket, ...prev]);
  };

  const handleUpdateKb = (newKb: KnowledgeBaseItem[]) => {
    setKb(newKb);
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
    return (
      <LoginScreen 
        users={users} 
        allowedDomain={allowedDomain}
        onLogin={setUser} 
        onRegister={handleRegister} 
      />
    );
  }

  return (
    <HashRouter>
      <AppLayout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route 
            path="/" 
            element={
              user.role === 'REQUESTER' ? (
                <Navigate to="/my-tickets" />
              ) : (
                <DashboardPage tickets={tickets} />
              )
            } 
          />

          <Route 
            path="/my-tickets" 
            element={<MyTicketsPage tickets={tickets} user={user} />} 
          />

          <Route 
            path="/queue" 
            element={
              (user.role === 'ADMIN' || user.role === 'SUPPORT') ? (
                <TicketsQueuePage tickets={tickets} availableSectors={sectors} />
              ) : (
                <Navigate to="/" />
              )
            } 
          />

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
                  allowedDomain={allowedDomain}
                  onUpdateAllowedDomain={setAllowedDomain}
                  onUpdateRole={handleUpdateUserRole}
                  onApproveUser={handleApproveUser}
                  onDeleteUser={handleDeleteUser}
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