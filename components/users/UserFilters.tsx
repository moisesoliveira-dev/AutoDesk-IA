import React from 'react';
import { Filter } from 'lucide-react';
import { Role } from '../../types';
import SearchBar from '../common/SearchBar';

interface UserFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  roleFilter: Role | 'ALL';
  onRoleFilterChange: (val: Role | 'ALL') => void;
}

const UserFilters: React.FC<UserFiltersProps> = ({
  searchTerm,
  onSearchChange,
  roleFilter,
  onRoleFilterChange
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchBar 
            value={searchTerm}
            onChange={onSearchChange}
            placeholder="Buscar usuário por nome..."
        />
      </div>
      <div className="w-full md:w-64 relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <select
            value={roleFilter}
            onChange={e => onRoleFilterChange(e.target.value as Role | 'ALL')}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800 appearance-none"
            >
                <option value="ALL">Todas as Funções</option>
                <option value="REQUESTER">Solicitantes</option>
                <option value="SUPPORT">Suporte</option>
                <option value="ADMIN">Administradores</option>
            </select>
      </div>
    </div>
  );
};

export default UserFilters;