import React from 'react';
import { Book, Check, Tag, Pencil, Trash2, XCircle, AlertTriangle, Flag, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { KnowledgeBaseItem, User } from '../../types';

interface KBItemProps {
  item: KnowledgeBaseItem;
  user: User;
  onToggleApproval: (id: string) => void;
  onEdit: (item: KnowledgeBaseItem) => void;
  onDelete: (id: string) => void;
  onRequestReview: (item: KnowledgeBaseItem) => void;
}

const KBItem: React.FC<KBItemProps> = ({ item, user, onToggleApproval, onEdit, onDelete, onRequestReview }) => {
  const canEdit = (user.role === 'SUPPORT' && !item.approved) || user.role === 'ADMIN';
  const canDelete = user.role === 'ADMIN';
  
  // Alterado: Apenas SUPPORT pode pedir revisão. ADMIN edita diretamente ou valida revisões existentes.
  const canRequestReview = user.role === 'SUPPORT' && item.approved && !item.reviewRequested;
  
  // Define o estilo da borda/fundo baseado no estado
  let borderClass = 'border-gray-200 hover:border-blue-300';
  let bgClass = 'bg-white';

  if (!item.approved) {
    borderClass = 'border-yellow-300';
    bgClass = 'bg-yellow-50';
  } else if (item.reviewRequested) {
    borderClass = 'border-orange-300';
    bgClass = 'bg-orange-50';
  }

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`${bgClass} p-5 rounded-xl border transition-colors group relative flex flex-col h-full ${borderClass}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Book size={16} className={item.approved ? (item.reviewRequested ? "text-orange-500" : "text-blue-500") : "text-yellow-600"} />
          {item.title}
        </h3>
        <div className="flex flex-col items-end gap-1">
          {!item.approved && (
            <span className="text-[10px] uppercase font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
              Pendente
            </span>
          )}
          {item.approved && item.reviewRequested && (
            <span className="text-[10px] uppercase font-bold bg-orange-200 text-orange-800 px-2 py-0.5 rounded-full flex items-center gap-1">
              <AlertTriangle size={10} /> Revisão
            </span>
          )}
        </div>
      </div>
      
      <p className="text-slate-600 text-sm mb-4 whitespace-pre-line flex-grow">{item.content}</p>

      {/* Nota de Revisão */}
      {item.reviewRequested && item.reviewNote && (
        <div className="mb-4 bg-orange-100/50 p-3 rounded-lg border border-orange-100 text-sm text-slate-700">
            <div className="flex items-center gap-2 text-orange-700 font-semibold mb-1 text-xs uppercase">
                <MessageSquare size={12} />
                Nota de Revisão
            </div>
            <p className="italic">"{item.reviewNote}"</p>
        </div>
      )}
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100/50 mt-1 min-h-[32px]">
            <div className="flex gap-2">
              {canEdit && (
                <button 
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar"
                >
                  <Pencil size={16} />
                </button>
              )}
              {canDelete && (
                <button 
                  onClick={() => onDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title={item.approved ? "Excluir" : "Rejeitar"}
                >
                  {item.approved ? <Trash2 size={16} /> : <XCircle size={16} />}
                </button>
              )}
              {canRequestReview && (
                 <button 
                  onClick={() => onRequestReview(item)}
                  className={`p-1.5 rounded-lg transition-colors flex items-center gap-1 ${item.reviewRequested ? 'text-orange-600 bg-orange-100' : 'text-slate-400 hover:text-orange-600 hover:bg-orange-100'}`}
                  title={item.reviewRequested ? "Editar solicitação de revisão" : "Solicitar Revisão / Corrigir"}
                 >
                   <Flag size={16} />
                 </button>
              )}
            </div>

            {user.role === 'ADMIN' && (
              <div className="flex gap-2">
                {item.reviewRequested && (
                  <button 
                    onClick={() => {
                        // Admin valida: remove flag e mantém aprovado
                         onRequestReview({...item, reviewRequested: false, reviewNote: undefined}); 
                    }} 
                    className="text-xs bg-orange-100 text-orange-700 border border-orange-200 px-3 py-1.5 rounded-lg hover:bg-orange-200 flex items-center gap-1"
                    title="Marcar como resolvido"
                  >
                    <Check size={12} /> Validar
                  </button>
                )}
                {!item.approved && (
                  <button 
                    onClick={() => onToggleApproval(item.id)}
                    className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 flex items-center gap-1 shadow-sm"
                  >
                    <Check size={12} /> Aprovar
                  </button>
                )}
              </div>
            )}
        </div>
      </div>
    </motion.div>
  );
};

export default KBItem;