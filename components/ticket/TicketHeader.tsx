import React from 'react';
import { Check, UserPlus, RefreshCw, Star } from 'lucide-react';
import { Ticket, TicketStatus, User } from '../../types';

interface TicketHeaderProps {
  ticket: Ticket;
  user: User;
  onResolve: () => void;
  onAssignToMe: () => void;
  onReopen: () => void;
}

const TicketHeader: React.FC<TicketHeaderProps> = ({ ticket, user, onResolve, onAssignToMe, onReopen }) => {
  const canResolve = (user.role === 'SUPPORT' || user.role === 'ADMIN') && ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED;
  const canAssign = (user.role === 'SUPPORT' || user.role === 'ADMIN') && ticket.assignedAgentId !== user.id && ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED;
  const canReopen = user.role === 'REQUESTER' && ticket.status === TicketStatus.RESOLVED;

  return (
    <div className="bg-white p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-sm z-10">
      <div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h1 className="text-xl font-bold text-slate-800">{ticket.title}</h1>
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-full">#{ticket.id}</span>
          {ticket.rating && (
            <div className="flex items-center gap-0.5 bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">
              <Star size={12} className="fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-yellow-700">{ticket.rating}.0</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
          <span className={`px-2 py-0.5 rounded text-xs font-semibold 
            ${ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700' : 
              ticket.status === TicketStatus.WAITING_USER ? 'bg-yellow-100 text-yellow-700' : 
              'bg-blue-100 text-blue-700'}`}>
            {ticket.status}
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span>
            {ticket.assignedSector}
          </span>
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${ticket.priority === 'Crítica' ? 'bg-red-500' : 'bg-slate-300'}`}></span>
            {ticket.priority}
          </span>
        </div>
      </div>
      
      <div className="flex gap-2 w-full sm:w-auto">
        {canAssign && (
          <button onClick={onAssignToMe} className="flex-1 sm:flex-none bg-slate-100 text-slate-700 px-3 py-2 rounded-lg hover:bg-slate-200 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <UserPlus size={16} /> Atribuir a mim
          </button>
        )}
        {canResolve && (
          <button onClick={onResolve} className="flex-1 sm:flex-none bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 text-sm font-medium transition-colors shadow-sm">
            <Check size={16} /> Resolver
          </button>
        )}
        {canReopen && (
           <button onClick={onReopen} className="flex-1 sm:flex-none bg-orange-100 text-orange-700 px-3 py-2 rounded-lg hover:bg-orange-200 flex items-center justify-center gap-2 text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Reabrir Chamado
          </button>
        )}
      </div>
    </div>
  );
};

export default TicketHeader;