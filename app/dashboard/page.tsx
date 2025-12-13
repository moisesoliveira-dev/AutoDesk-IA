import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Ticket } from '../../types';
import Stats from '../../components/dashboard/Stats';
import TicketCard from '../../components/dashboard/TicketCard';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import { LayoutDashboard } from 'lucide-react';

interface DashboardPageProps {
  tickets: Ticket[];
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

const DashboardPage: React.FC<DashboardPageProps> = ({ tickets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // No Dashboard de Admin/Suporte, mostramos todos os tickets (ou filtrados pela busca)
  let filteredTickets = tickets;

  if (searchTerm) {
    const lower = searchTerm.toLowerCase();
    filteredTickets = tickets.filter(t => 
      t.title.toLowerCase().includes(lower) || 
      t.id.toLowerCase().includes(lower) ||
      t.assignedSector.toLowerCase().includes(lower) ||
      t.requesterName.toLowerCase().includes(lower)
    );
  }

  // Reset page when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="text-blue-600" />
            Painel de Controle
          </h1>
          <p className="text-slate-500">
            Visão geral de atendimentos e métricas do sistema.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-64">
           <SearchBar 
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Buscar em todo o sistema..."
           />
        </div>
      </div>

      {/* Stats Section - Always visible unless searching deeply (optional, but good to keep stats visible) */}
      {!searchTerm && <Stats tickets={tickets} />}

      <h2 className="text-xl font-semibold text-slate-800 mb-4 mt-8 flex items-center gap-2">
        {searchTerm ? 'Resultados da Busca Global' : 'Chamados Recentes'}
        {searchTerm && <span className="text-sm font-normal text-slate-500">({filteredTickets.length} encontrados)</span>}
      </h2>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredTickets.length === 0 ? (
          <div className="text-center p-8 bg-white rounded-xl border border-dashed border-gray-300 text-gray-500">
            Nenhum chamado encontrado.
          </div>
        ) : (
          <>
            {currentTickets.map(ticket => (
              <motion.div key={ticket.id} variants={itemVariants}>
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
            
            <Pagination 
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredTickets.length}
              itemsName="chamados"
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </motion.div>
    </div>
  );
};

export default DashboardPage;