import React from 'react';
import { User, Role } from '../../types';
import { Check, X, BadgeCheck } from 'lucide-react';

interface PendingUserItemProps {
  user: User;
  onApprove: (id: string, role: Role) => void;
  onReject: (id: string) => void;
}

const PendingUserItem: React.FC<PendingUserItemProps> = ({ user, onApprove, onReject }) => {
  const [selectedRole, setSelectedRole] = React.useState<Role>('REQUESTER');

  return (
    <div className="p-6 bg-yellow-50/50 border border-yellow-100 rounded-lg flex flex-col md:flex-row justify-between gap-4 transition-all hover:bg-yellow-50 hover:border-yellow-200">
      <div className="flex items-center gap-4">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm grayscale" />
        <div>
          <h3 className="font-semibold text-slate-800 text-lg">{user.name}</h3>
          <p className="text-sm text-slate-500">{user.email}</p>
          {user.registrationNumber && (
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <BadgeCheck size={12} /> Matrícula: {user.registrationNumber}
            </p>
          )}
          <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded mt-2 inline-block uppercase tracking-wide">
            Aguardando Aprovação
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="w-full md:w-auto">
            <label className="text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider block">Definir Permissão</label>
            <div className="relative">
                <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as Role)}
                    className="w-full md:w-40 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white"
                >
                    <option value="REQUESTER">Solicitante</option>
                    <option value="SUPPORT">Suporte</option>
                    <option value="ADMIN">Administrador</option>
                </select>
            </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto mt-auto">
            <button 
                onClick={() => onApprove(user.id, selectedRole)}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 shadow-sm transition-colors text-sm font-medium"
            >
                <Check size={16} /> Aprovar
            </button>
            <button 
                onClick={() => {
                    if(confirm("Tem certeza que deseja rejeitar e excluir este cadastro?")) onReject(user.id);
                }}
                className="flex-1 bg-white border border-gray-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
                <X size={16} /> Rejeitar
            </button>
        </div>
      </div>
    </div>
  );
};

export default PendingUserItem;