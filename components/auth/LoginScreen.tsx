import React, { useState } from 'react';
import { Brain, Mail, Lock, User as UserIcon, ArrowRight, Loader2, BadgeCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { User } from '../../types';

interface LoginScreenProps {
  users: User[];
  allowedDomain: string;
  onLogin: (user: User) => void;
  onRegister: (name: string, email: string, password: string, registrationNumber: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ users, allowedDomain, onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 800));

    if (isLogin) {
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      
      if (user) {
        if (!user.approved) {
            setError('Sua conta ainda está pendente de aprovação pelo administrador.');
        } else {
            onLogin(user);
        }
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } else {
      // Validações de Registro
      if (password.length < 8) {
        setError('A senha deve ter no mínimo 8 caracteres.');
        setLoading(false);
        return;
      }

      if (!email.toLowerCase().endsWith(`@${allowedDomain.toLowerCase()}`)) {
        setError(`O e-mail deve pertencer ao domínio da empresa (@${allowedDomain}).`);
        setLoading(false);
        return;
      }

      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        setError('Este e-mail já está cadastrado.');
        setLoading(false);
        return;
      }

      if (users.find(u => u.registrationNumber === registrationNumber)) {
        setError('Esta matrícula já está sendo usada por outro usuário.');
        setLoading(false);
        return;
      }

      onRegister(name, email, password, registrationNumber);
      setSuccessMsg('Cadastro realizado com sucesso! Aguarde a aprovação do administrador para acessar.');
      setIsLogin(true); // Voltar para login
      setPassword('');
      setRegistrationNumber('');
    }
    setLoading(false);
  };

  const inputClass = "w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <motion.div 
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="flex justify-center mb-4"
          >
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Brain size={32} />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800">AutoDesk AI</h1>
          <p className="text-slate-500 mt-2">Sistema Inteligente de Gestão</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                >
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            required={!isLogin}
                            placeholder="Nome Completo"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div className="relative">
                        <BadgeCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            required={!isLogin}
                            placeholder="Nº Matrícula"
                            value={registrationNumber}
                            onChange={e => setRegistrationNumber(e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="email" 
                required
                placeholder={!isLogin ? `E-mail corporativo (@${allowedDomain})` : "E-mail"}
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
                type="password" 
                required
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
            />
             {!isLogin && password.length > 0 && password.length < 8 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-500 font-medium">
                    Mín 8 caracteres
                </div>
            )}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-100">
                {error}
            </motion.div>
          )}

          {successMsg && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-600 text-sm text-center bg-green-50 p-2 rounded-lg border border-green-100">
                {successMsg}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                <>
                    {isLogin ? 'Entrar no Sistema' : 'Criar Conta'}
                    {!loading && <ArrowRight size={18} />}
                </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
                {isLogin ? 'Não tem uma conta?' : 'Já possui cadastro?'}
                <button 
                    onClick={() => {
                        setIsLogin(!isLogin);
                        setError('');
                        setSuccessMsg('');
                    }}
                    className="ml-2 text-blue-600 font-semibold hover:underline outline-none"
                >
                    {isLogin ? 'Cadastre-se' : 'Fazer Login'}
                </button>
            </p>
        </div>

        {/* Demo Credentials Tip */}
        <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 text-center">
            <p className="font-semibold mb-1">Credenciais de Demonstração:</p>
            <p>Admin: admin@empresa.com / admin</p>
            <p>Suporte: carlos@empresa.com / 123</p>
            <p>Solicitante: joao@empresa.com / 123</p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;