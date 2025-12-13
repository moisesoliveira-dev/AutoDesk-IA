import React from 'react';
import { Ticket, TicketStatus, Priority } from '../../types';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface QueueTableProps {
  tickets: Ticket[];
}

const QueueTable: React.FC<QueueTableProps> = ({ tickets }) => {
  const getPriorityColor = (p: Priority) => {
      switch(p) {
          case Priority.CRITICAL: return 'bg-red-100 text-red-700 border-red-200';
          case Priority.HIGH: return 'bg-orange-100 text-orange-700 border-orange-200';
          case Priority.MEDIUM: return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          default: return 'bg-blue-50 text-blue-700 border-blue-100';
      }
  };

  const getStatusColor = (s: TicketStatus) => {
    switch(s) {
        case TicketStatus.RESOLVED: return 'bg-green-100 text-green-700';
        case TicketStatus.CLOSED: return 'bg-gray-100 text-gray-600';
        case TicketStatus.WAITING_USER: return 'bg-yellow-100 text-yellow-700';
        default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-bold border-b border-gray-100">
                        <th className="px-6 py-4">Prioridade</th>
                        <th className="px-6 py-4">Chamado</th>
                        <th className="px-6 py-4">Origem (Setor)</th>
                        <th className="px-6 py-4">Solicitante</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {tickets.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-slate-500 italic">
                                Nenhum chamado encontrado.
                            </td>
                        </tr>
                    ) : (
                        tickets.map((ticket, index) => (
                            <motion.tr 
                                key={ticket.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="hover:bg-slate-50 transition-colors group"
                            >
                                <td className="px-6 py-4 align-middle">
                                    <span className={`px-2 py-1 rounded text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    <div className="flex flex-col">
                                        <Link to={`/ticket/${ticket.id}`} className="font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                                            {ticket.title}
                                        </Link>
                                        <span className="text-xs text-slate-400">#{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                                        {ticket.assignedSector}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    <div className="text-sm text-slate-700 font-medium">{ticket.requesterName}</div>
                                </td>
                                <td className="px-6 py-4 align-middle">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${ticket.status === TicketStatus.RESOLVED ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 align-middle text-right">
                                    <Link 
                                        to={`/ticket/${ticket.id}`} 
                                        className="inline-flex items-center justify-center p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                                        title="Abrir Chamado"
                                    >
                                        <ArrowUpRight size={18} />
                                    </Link>
                                </td>
                            </motion.tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default QueueTable;