import React, { useState } from 'react';
import { User, Role } from '../../types';
import Pagination from '../../components/common/Pagination';
import UserFilters from '../../components/users/UserFilters';
import UserListItem from '../../components/users/UserListItem';
import PendingUserItem from '../../components/users/PendingUserItem';
import { UserCheck, Users, AlertCircle, Settings, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MASTER_ADMIN_ID } from '../../constants';

interface UsersPageProps {
  users: User[];
  currentUser: User;
  allowedDomain: string; // Novo
  onUpdateAllowedDomain: (domain: string) => void; // Novo
  onUpdateRole: (userId: string, newRole: Role) => void;
  onApproveUser?: (userId: string, role: Role) => void;
  onDeleteUser?: (userId: string) => void;
}

const ITEMS_PER_PAGE = 8;

const UsersPage: React.FC<UsersPageProps> = ({ 
  users, 
  currentUser, 
  allowedDomain,
  onUpdateAllowedDomain,
  onUpdateRole, 
  onApproveUser, 
  onDeleteUser 
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PENDING'>('ACTIVE');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Settings State
  const [tempDomain, setTempDomain] = useState(allowedDomain);
  const [isDomainSaved, setIsDomainSaved] = useState(false);

  const handleSaveDomain = () => {
    onUpdateAllowedDomain(tempDomain);
    setIsDomainSaved(true);
    setTimeout(() => setIsDomainSaved(false), 2000);
  };

  // Split users
  const pendingUsers = users.filter(u => !u.approved);
  const activeUsers = users.filter(u => u.approved);

  const filteredUsers = (activeTab === 'ACTIVE' ? activeUsers : pendingUsers).filter(user => {
    const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.registrationNumber && user.registrationNumber.includes(searchTerm));
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Reset page logic
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, activeTab]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const isMasterAdmin = currentUser.id === MASTER_ADMIN_ID;

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
          <p className="text-slate-500">Controle de acesso, aprovações e permissões do sistema.</p>
        </div>
      </div>

      {/* Área de Configuração do Master Admin */}
      {isMasterAdmin && (
        <div className="bg-slate-800 rounded-xl p-6 text-white mb-8 shadow-lg">
            <div className="flex items-center gap-2 mb-4 text-blue-300 font-semibold border-b border-slate-700 pb-2">
                <Settings size={20} />
                <h2>Configurações Globais de Acesso (Master Admin)</h2>
            </div>
            <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                    <label className="block text-sm text-slate-400 mb-1">Domínio de E-mail Corporativo Permitido</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">@</span>
                        <input 
                            type="text" 
                            value={tempDomain}
                            onChange={(e) => setTempDomain(e.target.value)}
                            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg py-2 pl-8 pr-4 focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="empresa.com"
                        />
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Apenas usuários com este domínio poderão se cadastrar.</p>
                </div>
                <button 
                    onClick={handleSaveDomain}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all
                        ${isDomainSaved ? 'bg-green-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
                    `}
                >
                    {isDomainSaved ? 'Salvo!' : 'Salvar Domínio'}
                    {!isDomainSaved && <Save size={18} />}
                </button>
            </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
         <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'ACTIVE' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <Users size={18} />
            Usuários Ativos
            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs ml-1">{activeUsers.length}</span>
            {activeTab === 'ACTIVE' && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
         </button>
         <button 
            onClick={() => setActiveTab('PENDING')}
            className={`pb-3 px-4 flex items-center gap-2 font-medium transition-colors relative ${activeTab === 'PENDING' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
         >
            <UserCheck size={18} />
            Aprovações Pendentes
            {pendingUsers.length > 0 && (
                <span className="bg-red-500 text-white px-2 py-0.5 rounded-full text-xs ml-1 animate-pulse">{pendingUsers.length}</span>
            )}
            {activeTab === 'PENDING' && <motion.div layoutId="tab-line" className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600" />}
         </button>
      </div>

      <UserFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        roleFilter={roleFilter}
        onRoleFilterChange={setRoleFilter}
      />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <AlertCircle size={48} className="text-slate-200 mb-4" />
                <p className="text-lg font-medium">Nenhum usuário encontrado.</p>
                <p className="text-sm text-slate-400">Tente ajustar os filtros ou verificar outra aba.</p>
            </div>
        ) : (
            <div className={`grid grid-cols-1 ${activeTab === 'ACTIVE' ? 'divide-y divide-gray-100' : 'gap-4 p-4'}`}>
                {activeTab === 'ACTIVE' ? (
                     currentUsers.map(user => (
                        <UserListItem 
                            key={user.id} 
                            user={user} 
                            isCurrentUser={user.id === currentUser.id} 
                            onUpdateRole={onUpdateRole}
                            onDeleteUser={onDeleteUser}
                        />
                    ))
                ) : (
                    currentUsers.map(user => (
                        <PendingUserItem 
                            key={user.id}
                            user={user}
                            onApprove={(id, role) => onApproveUser && onApproveUser(id, role)}
                            onReject={(id) => onDeleteUser && onDeleteUser(id)}
                        />
                    ))
                )}
            </div>
        )}
      </div>
      
      {filteredUsers.length > 0 && (
         <div className="mt-4">
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredUsers.length}
                itemsName="usuários"
                onPageChange={setCurrentPage}
             />
         </div>
      )}
    </div>
  );
};

export default UsersPage;