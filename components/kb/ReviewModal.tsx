import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { KnowledgeBaseItem } from '../../types';

interface ReviewModalProps {
  item: KnowledgeBaseItem;
  onClose: () => void;
  onSubmit: (id: string, note: string, updatedContent: string) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ item, onClose, onSubmit }) => {
  const [note, setNote] = useState('');
  const [content, setContent] = useState(item.content);

  useEffect(() => {
    // Reset fields when item changes
    setNote(item.reviewNote || '');
    setContent(item.content);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(item.id, note, content);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
               <AlertTriangle size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">Solicitar Revisão</h2>
                <p className="text-sm text-slate-500">Artigo: {item.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                Você pode adicionar um comentário explicando o problema e, se desejar, editar o conteúdo abaixo para sugerir a correção imediata.
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Motivo da Revisão / Comentário <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ex: O procedimento de VPN mudou, o servidor agora é vpn2.empresa.com..."
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none text-slate-800"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Sugerir Correção no Conteúdo (Opcional)
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all font-mono text-sm text-slate-800"
                rows={10}
              />
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-slate-600 font-medium hover:bg-slate-200 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            form="review-form"
            className="px-5 py-2.5 rounded-lg bg-orange-600 text-white font-medium hover:bg-orange-700 transition-colors shadow-sm flex items-center gap-2"
          >
            <Save size={18} />
            Enviar Solicitação
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ReviewModal;