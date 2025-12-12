import React from 'react';
import { Link } from 'react-router-dom';
import { User, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Ticket, Priority, TicketStatus } from '../../types';
import { MOCK_AGENTS } from '../../constants';

interface TicketCardProps {
  ticket: Ticket;
}

const MotionLink = motion(Link);

const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  return (
    <MotionLink 
      to={`/ticket/${ticket.id}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01, boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
      whileTap={{ scale: 0.99 }}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-colors hover:border-blue-300 group text-left"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold
              ${ticket.priority === Priority.CRITICAL ? 'bg-red-100 text-red-700' :
                ticket.priority === Priority.HIGH ? 'bg-orange-100 text-orange-700' :
                ticket.priority === Priority.MEDIUM ? 'bg-yellow-100 text-yellow-700' :
                'bg-blue-100 text-blue-700'}`}>
              {ticket.priority}
            </span>
            <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {ticket.assignedSector}
            </span>
            <span className="text-xs text-gray-400">
              #{ticket.id}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1 group-hover:text-blue-600 transition-colors">
            {ticket.title}
          </h3>
          <p className="text-slate-600 text-sm mb-3 line-clamp-2">
            {ticket.messages[0]?.content}
          </p>
        </div>
        
        <div className="flex flex-col gap-2 min-w-[150px] border-l border-gray-100 pl-0 md:pl-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User size={14} />
            <span>{MOCK_AGENTS.find(a => a.id === ticket.assignedAgentId)?.name || 'Sem Agente'}</span>
          </div>
           <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar size={14} />
            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className={`mt-2 text-center px-3 py-1 rounded-md text-sm font-medium
            ${ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700' : 
              ticket.status === TicketStatus.WAITING_USER ? 'bg-yellow-100 text-yellow-700' :
              'bg-blue-50 text-blue-700'}
          `}>
            {ticket.status}
          </div>
        </div>
      </div>
    </MotionLink>
  );
};

export default TicketCard;