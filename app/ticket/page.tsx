import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Send, Lock, Unlock, Star } from 'lucide-react';
import { Ticket, User, Message, TicketStatus } from '../../types';
import TicketHeader from '../../components/ticket/TicketHeader';
import MessageBubble from '../../components/ticket/MessageBubble';
import { motion, AnimatePresence } from 'framer-motion';

interface TicketPageProps {
  tickets: Ticket[];
  user: User;
  onUpdateTicket: (t: Ticket) => void;
}

const TicketPage: React.FC<TicketPageProps> = ({ tickets, user, onUpdateTicket }) => {
  const { id } = useParams();
  const ticket = tickets.find(t => t.id === id);
  const [newMessage, setNewMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages]);

  if (!ticket) return <div>Chamado não encontrado</div>;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Math.random().toString(36).substr(2, 9),
      ticketId: ticket.id,
      senderId: user.id,
      senderName: user.name,
      content: newMessage,
      createdAt: new Date().toISOString(),
      isAi: false,
      isInternal: isInternal
    };

    let newStatus = ticket.status;
    
    // Se for nota interna, não muda status
    if (!isInternal) {
        if (user.role === 'REQUESTER') {
        newStatus = TicketStatus.IN_PROGRESS; 
        } else {
        newStatus = TicketStatus.WAITING_USER;
        }
    }

    const updatedTicket = {
      ...ticket,
      messages: [...ticket.messages, message],
      status: newStatus
    };

    onUpdateTicket(updatedTicket);
    setNewMessage('');
    // Mantém o modo interno se estiver ativo para facilitar múltiplas notas
  };

  const handleResolve = () => {
    onUpdateTicket({ ...ticket, status: TicketStatus.RESOLVED });
  };

  const handleReopen = () => {
    onUpdateTicket({ 
        ...ticket, 
        status: TicketStatus.IN_PROGRESS,
        messages: [...ticket.messages, {
            id: Math.random().toString(36).substr(2, 9),
            ticketId: ticket.id,
            senderId: 'system',
            senderName: 'Sistema',
            content: `Chamado reaberto pelo usuário ${user.name}.`,
            createdAt: new Date().toISOString(),
            isAi: false
        }]
    });
  };

  const handleAssignToMe = () => {
      onUpdateTicket({ 
          ...ticket, 
          assignedAgentId: user.id,
          status: TicketStatus.IN_PROGRESS,
          messages: [...ticket.messages, {
            id: Math.random().toString(36).substr(2, 9),
            ticketId: ticket.id,
            senderId: 'system',
            senderName: 'Sistema',
            content: `${user.name} assumiu este chamado.`,
            createdAt: new Date().toISOString(),
            isAi: false,
            isInternal: true // Aviso interno
        }]
      });
  };

  const handleRate = (score: number) => {
      onUpdateTicket({
          ...ticket,
          rating: score,
          // Opcionalmente poderia fechar o ticket aqui, mas vamos manter como resolvido
      });
      setRating(score);
  };

  const showRating = ticket.status === TicketStatus.RESOLVED && !ticket.rating && user.role === 'REQUESTER';
  const canInternalNote = user.role === 'SUPPORT' || user.role === 'ADMIN';

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      <TicketHeader 
        ticket={ticket} 
        user={user} 
        onResolve={handleResolve} 
        onAssignToMe={handleAssignToMe}
        onReopen={handleReopen}
      />

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {ticket.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isMe={msg.senderId === user.id} userRole={user.role} />
        ))}
        
        {/* Rating Section */}
        <AnimatePresence>
            {showRating && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mx-auto max-w-md bg-white p-6 rounded-xl shadow-md border border-gray-200 text-center my-4"
                >
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Como foi seu atendimento?</h3>
                    <p className="text-slate-500 text-sm mb-4">Sua avaliação nos ajuda a melhorar.</p>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleRate(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                className="p-1 transition-transform hover:scale-110 focus:outline-none"
                            >
                                <Star 
                                    size={32} 
                                    className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
        
        <div ref={chatEndRef} />
      </div>

      {ticket.status !== TicketStatus.RESOLVED && ticket.status !== TicketStatus.CLOSED ? (
        <div className={`p-4 border-t transition-colors ${isInternal ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'} shrink-0`}>
          <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
            {canInternalNote && (
                 <div className="flex items-center gap-2 mb-1">
                    <button
                        type="button"
                        onClick={() => setIsInternal(!isInternal)}
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition-colors
                            ${isInternal ? 'bg-amber-200 text-amber-800' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                    >
                        {isInternal ? <Lock size={12} /> : <Unlock size={12} />}
                        {isInternal ? 'Nota Interna (Privada)' : 'Resposta Pública'}
                    </button>
                 </div>
            )}
            <div className="flex gap-2">
                <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className={`flex-1 px-4 py-2 rounded-full outline-none focus:ring-2 transition-all
                    ${isInternal 
                        ? 'bg-white text-slate-800 border-amber-300 focus:ring-amber-500 placeholder:text-amber-300' 
                        : 'bg-slate-50 text-slate-800 border-gray-300 focus:ring-blue-500'}`}
                placeholder={isInternal ? "Digite uma nota visível apenas para a equipe..." : "Digite sua mensagem..."}
                />
                <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className={`p-2.5 rounded-full text-white transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed
                    ${isInternal ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                <Send size={20} />
                </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 text-center text-gray-500 text-sm border-t flex flex-col items-center gap-2">
          <span>Este chamado foi encerrado.</span>
          {ticket.rating && (
              <div className="flex items-center gap-1 text-yellow-600 font-medium">
                  <Star size={16} className="fill-yellow-500" />
                  Avaliação: {ticket.rating}/5
              </div>
          )}
          {user.role === 'REQUESTER' && (
              <button onClick={handleReopen} className="text-blue-600 hover:underline text-xs">
                  O problema persiste? Reabrir chamado
              </button>
          )}
        </div>
      )}
    </div>
  );
};

export default TicketPage;