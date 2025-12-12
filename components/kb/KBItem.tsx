import React from 'react';
import { Book, Check, Tag, Pencil, Trash2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { KnowledgeBaseItem, User } from '../../types';

interface KBItemProps {
  item: KnowledgeBaseItem;
  user: User;
  onToggleApproval: (id: string) => void;
  onEdit: (item: KnowledgeBaseItem) => void;
  onDelete: (id: string) => void;
}

const KBItem: React.FC<KBItemProps> = ({ item, user, onToggleApproval, onEdit, onDelete }) => {
  const canEdit = (user.role === 'SUPPORT' && !item.approved) || user.role === 'ADMIN';
  const canDelete = user.role === 'ADMIN';

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white p-5 rounded-xl border transition-colors group relative flex flex-col h-full ${item.approved ? 'border-gray-200 hover:border-blue-300' : 'border-yellow-300 bg-yellow-50'}`}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Book size={16} className={item.approved ? "text-blue-500" : "text-yellow-600"} />
          {item.title}
        </h3>
        {!item.approved && (
          <span className="text-[10px] uppercase font-bold bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded-full">
            Pendente
          </span>
        )}
      </div>
      
      <p className="text-slate-600 text-sm mb-4 whitespace-pre-line flex-grow">{item.content}</p>
      
      <div className="flex flex-col gap-3 mt-auto">
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full flex items-center gap-1">
              <Tag size={10} />
              {tag}
            </span>
          ))}
        </div>
        
        {(canEdit || canDelete) && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100/50 mt-1">
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
             </div>

             {user.role === 'ADMIN' && !item.approved && (
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
    </motion.div>
  );
};

export default KBItem;