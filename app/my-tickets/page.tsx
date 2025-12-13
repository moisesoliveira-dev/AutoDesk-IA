import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ticket, User } from '../../types';
import TicketCard from '../../components/dashboard/TicketCard';
import Pagination from '../../components/common/Pagination';
import { Layers, ChevronRight, ChevronLeft, FolderOpen, Search, History } from 'lucide-react';

interface MyTicketsPageProps {
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

const ITEMS_PER_PAGE = 5;

const MyTicketsPage: React.FC<MyTicketsPageProps> = ({ tickets, user }) => {
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // 1. Filtrar apenas os chamados do usuário logado
  let userTickets = tickets.filter(t => t.requesterId === user.id);

  // 2. Filtrar por busca (se houver termo)
  let filteredTickets = userTickets;
  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filteredTickets = userTickets.filter(t => 
      t.title.toLowerCase().includes(lower) || 
      t.id.toLowerCase().includes(lower) ||
      t.assignedSector.toLowerCase().includes(lower)
    );
  }

  // 3. Agrupamento por setor para exibição em pastas
  const ticketsBySector = userTickets.reduce((acc, ticket) => {
    const sector = ticket.assignedSector || 'Outros';
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(ticket);
    return acc;
  }, {} as Record<string, Ticket[]>);

  // Tickets to display when a folder is selected
  const folderTickets = selectedSector 
    ? ticketsBySector[selectedSector] || []
    : [];

  // Decide qual lista renderizar: Busca Global ou Pasta Selecionada
  const ticketsToRender = searchTerm ? filteredTickets : folderTickets;

  // Reset page logic
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedSector, searchTerm]);

  // Pagination Logic
  const totalPages = Math.ceil(ticketsToRender.length / ITEMS_PER_PAGE);
  const currentTickets = ticketsToRender.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div className="flex-1">
          {selectedSector && !searchTerm && (
             <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 mb-2"
            >
                <button 
                  onClick={() => setSelectedSector(null)}
                  className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <ChevronLeft size={16} /> Voltar para pastas
                </button>
             </motion.div>
          )}
          
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="text-blue-600" />
            {searchTerm 
              ? 'Resultados da Busca' 
              : selectedSector 
                ? selectedSector 
                : 'Meus Chamados'}
          </h1>
          <p className="text-slate-500">
            {searchTerm 
              ? `Encontrados ${filteredTickets.length} chamados.` 
              : selectedSector 
                ? `Visualizando histórico de chamados em ${selectedSector}` 
                : 'Navegue pelos setores para ver seu histórico de solicitações.'}
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
           <input 
             type="text" 
             placeholder="Buscar nos meus chamados..." 
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
           />
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* Caso 1: Navegação por Pastas (Sem busca e sem setor selecionado) */}
        {!selectedSector && !searchTerm && (
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
                          {(sectorTickets as Ticket[]).length} chamados
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
        {(selectedSector || searchTerm) && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            {ticketsToRender.length === 0 ? (
               <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-dashed border-gray-200">
                  Nenhum chamado encontrado.
               </div>
            ) : (
              <>
                {currentTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <TicketCard ticket={ticket} />
                  </motion.div>
                ))}

                <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={ticketsToRender.length}
                  itemsName="chamados"
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyTicketsPage;