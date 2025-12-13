import React, { useState } from 'react';
import { Ticket, TicketStatus } from '../../types';
import Pagination from '../../components/common/Pagination';
import { Printer, Filter } from 'lucide-react';

interface ReportsPageProps {
  tickets: Ticket[];
  sectors: string[];
}

const ITEMS_PER_PAGE = 15;

const ReportsPage: React.FC<ReportsPageProps> = ({ tickets, sectors }) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sectorFilter, setSectorFilter] = useState<string>('ALL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredTickets = tickets.filter(t => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSector = sectorFilter === 'ALL' || t.assignedSector === sectorFilter;
    
    let matchesDate = true;
    if (startDate) {
        matchesDate = matchesDate && new Date(t.createdAt) >= new Date(startDate);
    }
    if (endDate) {
        // Adjust end date to end of day
        const end = new Date(endDate);
        end.setHours(23, 59, 59);
        matchesDate = matchesDate && new Date(t.createdAt) <= end;
    }

    return matchesStatus && matchesSector && matchesDate;
  });

  // Reset page logic
  React.useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sectorFilter, startDate, endDate]);

  const handlePrint = () => {
    window.print();
  };

  const totalPages = Math.ceil(filteredTickets.length / ITEMS_PER_PAGE);
  const currentTickets = filteredTickets.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6">
       <div className="no-print">
        <h1 className="text-2xl font-bold text-slate-800">Relatórios de Atendimento</h1>
        <p className="text-slate-500">Gere e imprima relatórios detalhados para análise.</p>
      </div>

      {/* Cabeçalho de Impressão (Só aparece ao imprimir) */}
      <div className="hidden print-only mb-6">
        <h1 className="text-3xl font-bold text-slate-800">AutoDesk AI - Relatório de Atendimentos</h1>
        <p className="text-slate-600 mt-2">
            Filtros: {statusFilter !== 'ALL' ? statusFilter : 'Todos os status'} • {sectorFilter !== 'ALL' ? sectorFilter : 'Todos os setores'}
        </p>
        <p className="text-slate-500 text-sm">Gerado em: {new Date().toLocaleString()}</p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 no-print">
        <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold">
            <Filter size={20} />
            <h2>Filtros</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                    value={statusFilter} 
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white text-slate-700"
                >
                    <option value="ALL">Todos</option>
                    {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Setor</label>
                <select 
                    value={sectorFilter} 
                    onChange={e => setSectorFilter(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white text-slate-700"
                >
                    <option value="ALL">Todos</option>
                    {sectors.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Início</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white text-slate-700" 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Data Fim</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 border bg-white text-slate-700" 
                />
            </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
         <div className="flex justify-between items-center mb-4 no-print">
            <h2 className="font-semibold text-slate-800">Resultados ({filteredTickets.length} registros)</h2>
            
            <button 
                onClick={handlePrint}
                disabled={filteredTickets.length === 0}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors
                    ${filteredTickets.length === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                <Printer size={18} />
                Imprimir Relatório
            </button>
         </div>

         <div className="overflow-x-auto">
            {/* 
               NOTA: Na visualização normal, usamos 'currentTickets' (paginado).
               Na impressão, queremos ver TODOS os itens. Como o CSS print não afeta a lógica JS de renderização,
               o ideal seria renderizar todos mas esconder os extras com CSS, ou remover a paginação na impressão.
               A abordagem mais simples aqui é manter a tabela paginada na tela.
               Se o usuário quiser imprimir TUDO, ele geralmente filtra ou exporta. 
               Para este exemplo, o 'print' imprimirá apenas a página atual.
               Para imprimir tudo, teríamos que renderizar uma tabela oculta com 'filteredTickets'.
            */}
            
            {/* Tabela Visível (Paginada) */}
            <div className="no-print">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th className="px-6 py-3">ID</th>
                            <th className="px-6 py-3">Título</th>
                            <th className="px-6 py-3">Setor</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Data</th>
                            <th className="px-6 py-3">Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentTickets.map(ticket => (
                            <tr key={ticket.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">#{ticket.id}</td>
                                <td className="px-6 py-4 truncate max-w-xs">{ticket.title}</td>
                                <td className="px-6 py-4">{ticket.assignedSector}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-xs font-semibold
                                        ${ticket.status === TicketStatus.RESOLVED ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{ticket.rating ? ticket.rating : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Tabela de Impressão (Completa - Hidden on Screen) */}
            <div className="hidden print-only">
                 <table className="w-full text-sm text-left text-black">
                    <thead className="text-xs uppercase bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                            <th className="px-2 py-2">ID</th>
                            <th className="px-2 py-2">Título</th>
                            <th className="px-2 py-2">Setor</th>
                            <th className="px-2 py-2">Status</th>
                            <th className="px-2 py-2">Data</th>
                            <th className="px-2 py-2">Nota</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTickets.map(ticket => (
                            <tr key={ticket.id} className="border-b border-gray-200">
                                <td className="px-2 py-2 font-bold">#{ticket.id}</td>
                                <td className="px-2 py-2">{ticket.title}</td>
                                <td className="px-2 py-2">{ticket.assignedSector}</td>
                                <td className="px-2 py-2">{ticket.status}</td>
                                <td className="px-2 py-2">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                                <td className="px-2 py-2">{ticket.rating ? ticket.rating : '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {/* Rodapé do relatório impresso */}
            <div className="hidden print-only mt-8 pt-4 border-t border-gray-300 text-sm">
                <p>Resumo:</p>
                <ul className="mt-2">
                    <li>Total de chamados: {filteredTickets.length}</li>
                    <li>Resolvidos: {filteredTickets.filter(t => t.status === TicketStatus.RESOLVED).length}</li>
                    <li>Média de Avaliação: {(filteredTickets.reduce((acc, t) => acc + (t.rating || 0), 0) / (filteredTickets.filter(t => t.rating).length || 1)).toFixed(1)}</li>
                </ul>
            </div>

            {filteredTickets.length === 0 && (
                <p className="text-center py-8">Nenhum chamado encontrado com os filtros selecionados.</p>
            )}
         </div>

         {filteredTickets.length > 0 && (
             <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={filteredTickets.length}
                itemsName="registros"
                onPageChange={setCurrentPage}
             />
         )}
      </div>
    </div>
  );
};

export default ReportsPage;