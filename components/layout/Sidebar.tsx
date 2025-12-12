import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Book, LogOut, Bot, X, Users, History, Layers, FileBarChart, Mails } from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  // Renderização condicional do label do link principal
  const homeLabel = user.role === 'REQUESTER' ? 'Meus Chamados' : 'Dashboard';
  const HomeIcon = user.role === 'REQUESTER' ? History : LayoutDashboard;

  return (
    <aside className={`
      fixed md:relative z-30 flex flex-col w-64 h-full bg-slate-900 text-white transition-transform duration-300 ease-in-out no-print
      ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
    `}>
      <div className="flex items-center justify-between p-6 border-b border-slate-700">
        <div className="flex items-center gap-2 font-bold text-xl">
          <Bot className="text-blue-400" />
          <span>AutoDesk AI</span>
        </div>
        <button onClick={onClose} className="md:hidden">
          <X size={24} />
        </button>
      </div>

      <div className="p-4 border-b border-slate-800 bg-slate-800/50">
        <div className="flex items-center gap-3">
          <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-slate-600" />
          <div className="overflow-hidden">
            <p className="font-medium text-sm truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">
              {user.role === 'REQUESTER' ? 'Solicitante' : user.role === 'SUPPORT' ? 'Suporte' : 'Admin'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link
          to="/"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <HomeIcon size={20} />
          <span className="font-medium">{homeLabel}</span>
        </Link>
        
        <Link
          to="/new"
          onClick={onClose}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/new') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <PlusCircle size={20} />
          <span className="font-medium">Novo Chamado</span>
        </Link>

        {(user.role === 'ADMIN' || user.role === 'SUPPORT') && (
          <Link
            to="/kb"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/kb') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Book size={20} />
            <span className="font-medium">Base de Conhecimento</span>
          </Link>
        )}

        {(user.role === 'ADMIN' || user.role === 'SUPPORT') && (
          <Link
            to="/reports"
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              isActive('/reports') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileBarChart size={20} />
            <span className="font-medium">Relatórios</span>
          </Link>
        )}

        {user.role === 'ADMIN' && (
          <>
            <div className="pt-4 pb-2 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Administração</div>
            <Link
              to="/users"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/users') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Users size={20} />
              <span className="font-medium">Usuários</span>
            </Link>
            <Link
              to="/sectors"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/sectors') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Layers size={20} />
              <span className="font-medium">Setores</span>
            </Link>
            <Link
              to="/report-settings"
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive('/report-settings') ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Mails size={20} />
              <span className="font-medium">Config. Relatórios</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button onClick={onLogout} className="flex items-center gap-2 text-slate-400 hover:text-white w-full px-4 py-2 hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;