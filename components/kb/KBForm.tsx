import React, { useState, useEffect } from 'react';
import { Loader2, Brain, ArrowRight, AlertTriangle, X } from 'lucide-react';
import { Ticket, KnowledgeBaseItem, User, TicketStatus, Sector } from '../../types';
import { generateKBEntryFromTicket } from '../../services/geminiService';

interface KBFormProps {
  user: User;
  tickets: Ticket[];
  initialData?: KnowledgeBaseItem | null;
  onSubmit: (item: Omit<KnowledgeBaseItem, 'id'>) => void;
  onCancel: () => void;
  availableSectors: string[];
}

const KBForm: React.FC<KBFormProps> = ({ user, tickets, initialData, onSubmit, onCancel, availableSectors }) => {
  const [importMode, setImportMode] = useState<'manual' | 'ticket'>('manual');
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newSector, setNewSector] = useState<Sector>(availableSectors[0] || '');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialData) {
      setNewTitle(initialData.title);
      setNewContent(initialData.content);
      setNewTags(initialData.tags.join(', '));
      setNewSector(initialData.sector);
      setImportMode('manual');
    } else if (availableSectors.length > 0) {
        setNewSector(availableSectors[0]);
    }
  }, [initialData, availableSectors]);

  const resolvedTickets = tickets.filter(t => t.status === TicketStatus.RESOLVED);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newTitle || !newContent) return;

    onSubmit({
      title: newTitle,
      content: newContent,
      tags: newTags.split(',').map(t => t.trim()).filter(t => t),
      sector: newSector,
      approved: initialData ? initialData.approved : user.role === 'ADMIN',
      authorId: initialData ? initialData.authorId : user.id
    });
  };

  const importFromTicket = async (ticket: Ticket) => {
    setIsProcessingAI(true);
    setErrorMsg('');

    try {
      const result = await generateKBEntryFromTicket(ticket);

      if (!result.sufficientInformation) {
        setErrorMsg(`A IA não conseguiu identificar um problema técnico claro no chamado "${ticket.title}". Por favor, descreva o problema e a solução manualmente.`);
        setNewTitle(ticket.title);
        setNewContent('');
        setImportMode('manual');
        setIsProcessingAI(false);
        return;
      }

      setNewTitle(result.suggestedTitle);
      setNewTags(result.suggestedTags.join(', '));
      setNewSector(ticket.assignedSector);
      
      const formattedContent = `**Problema:**\n${result.problemDescription}\n\n**Solução:**\n[Insira a solução técnica detalhada aqui]`;
      setNewContent(formattedContent);
      
      setImportMode('manual');
    } catch (e) {
      console.error(e);
      setErrorMsg("Erro ao processar com IA. Tente manualmente.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const isEditing = !!initialData;

  return (
    <>
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
          <AlertTriangle size={20} className="shrink-0" />
          <p>{errorMsg}</p>
          <button onClick={() => setErrorMsg('')} className="ml-auto hover:bg-red-100 p-1 rounded"><X size={16}/></button>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 mb-8 animate-in slide-in-from-top-4 relative">
        {isProcessingAI && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center rounded-xl backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="animate-spin text-blue-600" size={32} />
              <span className="font-semibold text-slate-700">A IA está analisando o chamado...</span>
            </div>
          </div>
        )}

        {!isEditing && (
          <div className="flex gap-4 mb-6 border-b pb-4">
             <button 
                onClick={() => setImportMode('manual')}
                className={`pb-2 px-2 font-medium transition-colors relative ${importMode === 'manual' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Criar Manualmente
                {importMode === 'manual' && <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-blue-600" />}
             </button>
             <button 
                onClick={() => setImportMode('ticket')}
                className={`pb-2 px-2 font-medium transition-colors relative ${importMode === 'ticket' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
             >
                Importar de Resolvido
                {importMode === 'ticket' && <div className="absolute bottom-[-17px] left-0 w-full h-0.5 bg-blue-600" />}
             </button>
          </div>
        )}

        {importMode === 'ticket' && !isEditing ? (
           <div className="space-y-4">
             <h3 className="font-semibold text-slate-800">Selecione um chamado resolvido para análise da IA:</h3>
             <div className="grid gap-3 max-h-80 overflow-y-auto pr-2">
               {resolvedTickets.length === 0 ? (
                 <p className="text-slate-500 text-sm italic">Nenhum chamado resolvido disponível para importação.</p>
               ) : (
                 resolvedTickets.map(t => (
                   <div 
                      key={t.id} 
                      onClick={() => importFromTicket(t)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all flex justify-between items-center group"
                   >
                      <div>
                        <p className="font-semibold text-slate-800 text-sm">{t.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                          {t.assignedSector} • {new Date(t.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs font-medium">Analisar</span>
                        <Brain size={16} />
                      </div>
                   </div>
                 ))
               )}
             </div>
           </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="font-semibold text-lg mb-4 text-slate-800">
              {isEditing ? 'Editar Solução' : (user.role === 'ADMIN' ? 'Nova Entrada' : 'Sugerir Nova Solução')}
            </h3>
            {!isEditing && (
              <div className="bg-blue-50 p-3 rounded-lg text-blue-800 text-sm mb-4 flex gap-2">
                <Brain size={16} className="mt-0.5 shrink-0" />
                <p>Revise o problema gerado pela IA e <strong>preencha a solução técnica</strong> manualmente.</p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
                <select
                  value={newSector}
                  onChange={(e) => setNewSector(e.target.value as Sector)}
                  className="w-full px-4 py-2 bg-white text-slate-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {availableSectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
                <input
                  className="w-full px-4 py-2 bg-white text-slate-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Título (ex: Configuração de VPN)"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Solução Detalhada</label>
                <textarea
                  className="w-full px-4 py-2 bg-white text-slate-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                  placeholder="Conteúdo / Solução..."
                  rows={10}
                  value={newContent}
                  onChange={e => setNewContent(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags</label>
                <input
                  className="w-full px-4 py-2 bg-white text-slate-800 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Tags separadas por vírgula (ex: rede, vpn, remoto)"
                  value={newTags}
                  onChange={e => setNewTags(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                  <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
                    {isEditing ? 'Salvar Alterações' : (user.role === 'ADMIN' ? 'Salvar e Publicar' : 'Enviar para Aprovação')}
                  </button>
                  <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 w-full sm:w-auto">
                    Cancelar
                  </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </>
  );
};

export default KBForm;