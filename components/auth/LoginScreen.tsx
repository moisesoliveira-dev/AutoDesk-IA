import React from 'react';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { User } from '../../types';

interface LoginScreenProps {
  users: User[];
  onLogin: (user: User) => void;
}

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const LoginScreen: React.FC<LoginScreenProps> = ({ users, onLogin }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white p-8 rounded-2xl shadow-xl max-w-4xl w-full"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white">
              <Brain size={32} />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-slate-800">AutoDesk AI</motion.h1>
          <motion.p variants={itemVariants} className="text-slate-500 mt-2">Selecione um perfil para acessar o sistema</motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {users.map(user => (
            <motion.button
              key={user.id}
              variants={itemVariants}
              whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLogin(user)}
              className="flex flex-col items-center p-6 rounded-xl border-2 border-slate-100 bg-white transition-colors group"
            >
              <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full mb-4 shadow-sm" />
              <h3 className="font-bold text-lg text-slate-800 group-hover:text-blue-700">{user.name}</h3>
              <span className={`mt-2 px-3 py-1 rounded-full text-xs font-semibold
                ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'SUPPORT' ? 'bg-orange-100 text-orange-700' :
                  'bg-green-100 text-green-700'
                }`}>
                {user.role === 'REQUESTER' ? 'Solicitante' : user.role === 'SUPPORT' ? 'Suporte' : 'Administrador'}
              </span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;