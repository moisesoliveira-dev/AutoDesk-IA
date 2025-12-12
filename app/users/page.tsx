import React, { useState } from 'react';
import { User, Role } from '../../types';
import { Shield, Headphones, User as UserIcon, Search, Filter } from 'lucide-react';

interface UsersPageProps {
  users: User[];
  currentUser: User;
  onUpdateRole: (userId: string, newRole: Role) => void;
}

const UsersPage: React.FC<UsersPageProps> = ({ users, currentUser, onUpdateRole }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'ALL'>('ALL');

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'ADMIN': return <Shield size={20} className="text-purple-600" />;
      case 'SUPPORT': return <Headphones size={20} className="text-orange-600" />;
      default: return <UserIcon size={20} className="text-green-600" />;
    }
  };

  const getRoleLabel = (role: Role) => {
    switch (role) {
      case 'ADMIN': return 'Administrador';
      case 'SUPPORT': return 'Suporte Técnico';
      default: return 'Solicitante';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Gerenciamento de Usuários</h1>
          <p className="text-slate-500">Controle de acesso e permissões do sistema.</p>
        </div>
      </div>

      {/* Toolbar de Filtros */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="text"
                placeholder="Buscar usuário por nome..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
            />
        </div>
        <div className="w-full md:w-64 relative">
             <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
             <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as Role | 'ALL')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800 appearance-none"
             >
                 <option value="ALL">Todas as Funções</option>
                 <option value="REQUESTER">Solicitantes</option>
                 <option value="SUPPORT">Suporte</option>
                 <option value="ADMIN">Administradores</option>
             </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-1 divide-y divide-gray-100">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
                Nenhum usuário encontrado com os filtros atuais.
            </div>
          ) : (
            filteredUsers.map(user => (
                <div key={user.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
                    <div>
                    <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
                        {user.name}
                        {user.id === currentUser.id && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                            Você
                        </span>
                        )}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        {getRoleIcon(user.role)}
                        <span>{getRoleLabel(user.role)}</span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex flex-col w-full md:w-auto">
                    <label className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Alterar Permissão</label>
                    <select
                        value={user.role}
                        onChange={(e) => onUpdateRole(user.id, e.target.value as Role)}
                        className={`
                        px-4 py-2 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer
                        ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-700 border-purple-200' : 
                            user.role === 'SUPPORT' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                            'bg-green-50 text-green-700 border-green-200'}
                        `}
                    >
                        <option value="REQUESTER">Solicitante</option>
                        <option value="SUPPORT">Suporte</option>
                        <option value="ADMIN">Administrador</option>
                    </select>
                    </div>
                </div>
                </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;