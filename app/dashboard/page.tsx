import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User } from '../../types';
import Stats from '../../components/dashboard/Stats';
import TicketCard from '../../components/dashboard/TicketCard';
import { Layers, ChevronRight, ChevronLeft, FolderOpen, Search } from 'lucide-react';

interface DashboardPageProps {
  tickets: Ticket[];
  user: User;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const DashboardPage: React.FC<DashboardPageProps> = ({ tickets, user }) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Filtrar por usuário/permissão
  let filteredTickets = tickets.filter(t => {
    if (user.role === 'ADMIN' || user.role === 'SUPPORT') return true;
    return t.requesterId === user.id;
  });

  // 2. Filtrar por busca (se houver termo)
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filteredTickets = filteredTickets.filter(t => 
      t.title.toLowerCase().includes(lower) || 
      t.id.toLowerCase().includes(lower) ||
      t.assignedSector.toLowerCase().includes(lower)
    );
  }

  const isRequester = user.role === 'REQUESTER';

  // Agrupamento por setor para o Solicitante (usando a lista já filtrada por permissão, mas antes da busca para manter as pastas se não houver busca)
  // Se houver busca, mostramos lista direta mesmo pro requester.
  const ticketsBySector = filteredTickets.reduce((acc, ticket) => {
    const sector = ticket.assignedSector || 'Desconhecido';
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  // Tickets to display based on selection
  const displayedRequesterTickets = selectedSector 
    ? ticketsBySector[selectedSector] || []
    : [];

  const showSearchResultsDirectly = searchTerm.length > 0 && isRequester;

  // Define tickets list for requester view to avoid TS inference issues in JSX
  const ticketsToRender = searchTerm ? filteredTickets : displayedRequesterTickets;

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div className="flex-1">
          {isRequester && selectedSector && !searchTerm ? (
             <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <ChevronLeft size={16} /> Voltar
                </button>
             </motion.div>
          ) : null}
          
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {isRequester 
              ? (searchTerm ? 'Resultados da Busca' : selectedSector ? selectedSector : 'Meus Chamados') 
              : 'Painel de Controle'}
          </h1>
          <p className="text-slate-500">
            {isRequester 
              ? (searchTerm ? `Encontrados ${filteredTickets.length} chamados.` : selectedSector ? `Visualizando histórico de chamados em ${selectedSector}` : 'Navegue pelos setores para ver seu histórico.') 
              : `Bem-vindo, ${user.name}.`}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Buscar chamado..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
           />
        </div>
      </div>

      {/* Renderização para Admin e Suporte: Stats + Lista Simples */}
      {!isRequester && (
        <>
          <Stats tickets={tickets} />
          <h2 className="text-xl font-semibold text-slate-800 mb-4 mt-8">
            {searchTerm ? 'Resultados da Busca' : 'Chamados Recentes'}
          </h2>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredTickets.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-lg border border-dashed border-gray-300 text-gray-500">
                Nenhum chamado encontrado.
              </div>
            ) : (
              filteredTickets.map(ticket => (
                <motion.div key={ticket.id} variants={itemVariants}>
                  <TicketCard ticket={ticket} />
                </motion.div>
              ))
            )}
          </motion.div>
        </>
      )}

      {/* Renderização para Solicitante */}
      <AnimatePresence mode="wait">
        
        {/* Caso 1: Navegação por Pastas (Sem busca e sem setor selecionado) */}
        {isRequester && !selectedSector && !searchTerm && (
          <motion.div 
            key="folders"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Object.keys(ticketsBySector).length === 0 ? (
              <div className="col-span-full text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Layers size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-800">Nenhum chamado registrado</h3>
                <p className="text-slate-500 mt-2">Você ainda não abriu nenhuma solicitação.</p>
              </div>
            ) : (
              Object.entries(ticketsBySector).map(([sector, sectorTickets]) => (
                <motion.button 
                  key={sector}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSector(sector)}
                  className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all text-left group flex items-start justify-between"
                >
                  <div>
                     <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FolderOpen size={24} />
                     </div>
                     <h3 className="font-semibold text-slate-800 text-lg">{sector}</h3>
                     <div className="flex items-center gap-2 mt-2">
                        <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {sectorTickets.length} chamados
                        </span>
                     </div>
                  </div>
                  <ChevronRight className="text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </motion.button>
              ))
            )}
          </motion.div>
        )}

        {/* Caso 2: Lista de Chamados (Setor Selecionado OU Busca Ativa) */}
        {isRequester && (selectedSector || searchTerm) && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {ticketsToRender.length === 0 ? (
               <div className="text-center p-8 text-gray-500">Nenhum chamado encontrado.</div>
            ) : (
              ticketsToRender.map((ticket, index) => (
                <motion.div
                  key={ticket.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <TicketCard ticket={ticket} />
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;