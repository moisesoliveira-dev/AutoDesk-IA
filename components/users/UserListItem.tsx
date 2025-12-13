import React from 'react';
import { User, Role } from '../../types';
import { Shield, Headphones, User as UserIcon, Trash2, BadgeCheck } from 'lucide-react';
import { MASTER_ADMIN_ID } from '../../constants';

interface UserListItemProps {
  user: User;
  isCurrentUser: boolean;
  onUpdateRole: (id: string, role: Role) => void;
  onDeleteUser?: (id: string) => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, isCurrentUser, onUpdateRole, onDeleteUser }) => {
  const isMasterAdmin = user.id === MASTER_ADMIN_ID;

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

  return (
    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors border-b last:border-0 border-gray-100">
      <div className="flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" />
        <div>
          <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
            {user.name}
            {isCurrentUser && (
              <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide">
                Você
              </span>
            )}
            {isMasterAdmin && (
               <span className="bg-purple-100 text-purple-700 text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide flex items-center gap-1">
                 <Shield size={10} /> Mestre
               </span>
            )}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-slate-500 mt-1">
             <div className="flex items-center gap-2">
                {getRoleIcon(user.role)}
                <span>{getRoleLabel(user.role)}</span>
             </div>
             <span className="hidden sm:inline text-slate-300">|</span>
             <span>{user.email}</span>
             {user.registrationNumber && (
                 <>
                    <span className="hidden sm:inline text-slate-300">|</span>
                    <span className="flex items-center gap-1 text-slate-600">
                        <BadgeCheck size={14} className="text-slate-400"/>
                        Mat: {user.registrationNumber}
                    </span>
                 </>
             )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col w-full md:w-auto">
          <label className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Alterar Permissão</label>
          <select
            value={user.role}
            onChange={(e) => onUpdateRole(user.id, e.target.value as Role)}
            disabled={isMasterAdmin || isCurrentUser}
            className={`
              px-4 py-2 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
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
        
        {onDeleteUser && !isMasterAdmin && !isCurrentUser && (
            <button 
                onClick={() => {
                    if(confirm(`Tem certeza que deseja remover o usuário ${user.name}?`)) onDeleteUser(user.id);
                }}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors mt-5"
                title="Excluir Usuário"
            >
                <Trash2 size={20} />
            </button>
        )}
      </div>
    </div>
  );
};

export default UserListItem;