import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Brain } from 'lucide-react';
import { Ticket, KnowledgeBaseItem, User, Message, TicketStatus } from '../../types';
import { analyzeTicketWithGemini } from '../../services/geminiService';
import { MOCK_AGENTS } from '../../constants';

interface NewTicketPageProps {
  onAddTicket: (t: Ticket) => void;
  kb: KnowledgeBaseItem[];
  user: User;
  availableSectors: string[];
}

const NewTicketPage: React.FC<NewTicketPageProps> = ({ onAddTicket, kb, user, availableSectors }) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsAnalyzing(true);

    const approvedKb = kb.filter(item => item.approved);
    const aiResult = await analyzeTicketWithGemini(title, description, MOCK_AGENTS, approvedKb, availableSectors);

    const ticketId = Math.random().toString(36).substr(2, 9);
    
    const initialMessages: Message[] = [
      {
        id: 'msg1',
        ticketId,
        senderId: user.id,
        senderName: user.name,
        content: description,
        createdAt: new Date().toISOString(),
        isAi: false
      },
      {
        id: 'msg2',
        ticketId,
        senderId: 'system',
        senderName: 'AutoDesk AI',
        content: aiResult.autoResponse,
        createdAt: new Date(Date.now() + 1000).toISOString(),
        isAi: true
      }
    ];

    const newTicket: Ticket = {
      id: ticketId,
      title,
      requesterId: user.id,
      requesterName: user.name,
      createdAt: new Date().toISOString(),
      status: TicketStatus.WAITING_USER,
      assignedSector: aiResult.sector,
      priority: aiResult.priority,
      assignedAgentId: aiResult.suggestedAgentId,
      aiAnalysis: aiResult,
      messages: initialMessages
    };

    onAddTicket(newTicket);
    setIsAnalyzing(false);
    navigate(`/ticket/${ticketId}`);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-2">Novo Chamado</h1>
      <p className="text-slate-500 mb-6">Descreva o problema. Nossa IA tentará resolver imediatamente, ou conectará você a um agente.</p>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Título do Problema</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-white text-slate-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="Ex: Impressora do 2º andar parada"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Detalhada</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full px-4 py-2 bg-white text-slate-800 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            placeholder="Descreva o que aconteceu..."
          />
        </div>

        <button
          type="submit"
          disabled={isAnalyzing}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white flex items-center justify-center gap-2 transition-all
            ${isAnalyzing ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'}
          `}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Analisando...
            </>
          ) : (
            <>
              <Brain size={20} />
              Iniciar Atendimento
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default NewTicketPage;