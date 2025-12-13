import React, { useState } from 'react';
import { Ticket } from '../../types';
import Pagination from '../../components/common/Pagination';
import QueueFilters from '../../components/queue/QueueFilters';
import QueueTable from '../../components/queue/QueueTable';
import { Inbox } from 'lucide-react';

interface TicketsQueuePageProps {
  tickets: Ticket[];
  availableSectors: string[];
}

const ITEMS_PER_PAGE = 10;

const TicketsQueuePage: React.FC<TicketsQueuePageProps> = ({ tickets, availableSectors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.requesterName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSector = sectorFilter === 'ALL' || t.assignedSector === sectorFilter;
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;

    return matchesSearch && matchesSector && matchesStatus;
  });

  // Reset page on filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sectorFilter, statusFilter]);

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Inbox className="text-blue-600" />
                Fila de Atendimento
            </h1>
            <p className="text-slate-500">Visualize e gerencie a entrada de chamados por setor.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm font-medium text-slate-600">
            Total na fila: <span className="text-blue-600 font-bold">{filteredTickets.length}</span>
        </div>
      </div>

      <QueueFilters 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sectorFilter={sectorFilter}
        onSectorFilterChange={setSectorFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        availableSectors={availableSectors}
      />

      <QueueTable tickets={currentTickets} />
        
      {filteredTickets.length > 0 && (
        <div className="px-6 pb-6 bg-white rounded-b-xl border-x border-b border-gray-200 -mt-2">
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTickets.length}
                itemsName="chamados"
                onPageChange={setCurrentPage}
            />
        </div>
      )}
    </div>
  );
};

export default TicketsQueuePage;