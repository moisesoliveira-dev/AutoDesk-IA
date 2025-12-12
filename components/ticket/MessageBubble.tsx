import React from 'react';
import { Brain, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Message, Role } from '../../types';

interface MessageBubbleProps {
  message: Message;
  isMe: boolean;
  userRole: Role;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isMe, userRole }) => {
  const isAi = message.isAi;
  const isInternal = message.isInternal;

  // Se for mensagem interna e o usuário for solicitante, não renderiza nada
  if (isInternal && userRole === 'REQUESTER') {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          {isAi && <Brain size={12} className="text-purple-600" />}
          {isInternal && <Lock size={12} className="text-amber-600" />}
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            {message.senderName} 
            {isInternal && <span className="text-amber-600 font-bold text-[10px] uppercase bg-amber-100 px-1 rounded">Nota Interna</span>}
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>
        <div className={`p-4 rounded-2xl shadow-sm text-sm whitespace-pre-wrap relative
          ${isInternal 
            ? 'bg-amber-50 border border-amber-200 text-slate-800 rounded-tl-none' 
            : isMe 
              ? 'bg-blue-600 text-white rounded-tr-none' 
              : isAi 
                ? 'bg-purple-50 border border-purple-200 text-slate-800' 
                : 'bg-white border border-gray-200 text-slate-800 rounded-tl-none'}`}
        >
          {message.content}
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;