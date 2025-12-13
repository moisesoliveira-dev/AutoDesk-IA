import React from 'react';
import { Filter, ChevronDown } from 'lucide-react';
import { TicketStatus } from '../../types';
import SearchBar from '../common/SearchBar';

interface QueueFiltersProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  sectorFilter: string;
  onSectorFilterChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  availableSectors: string[];
}

const QueueFilters: React.FC<QueueFiltersProps> = ({
  searchTerm,
  onSearchChange,
  sectorFilter,
  onSectorFilterChange,
  statusFilter,
  onStatusFilterChange,
  availableSectors
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <SearchBar 
            value={searchTerm} 
            onChange={onSearchChange} 
            placeholder="Buscar por título, ID ou solicitante..." 
        />
      </div>
      <div className="flex gap-4 w-full md:w-auto">
        <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select
                value={sectorFilter}
                onChange={e => onSectorFilterChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-slate-700 cursor-pointer"
            >
                <option value="ALL">Todos os Setores</option>
                {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
        <div className="relative min-w-[180px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-slate-400"></div>
            <select
                value={statusFilter}
                onChange={e => onStatusFilterChange(e.target.value)}
                className="w-full pl-8 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white text-slate-700 cursor-pointer"
            >
                <option value="ALL">Todos os Status</option>
                {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
        </div>
      </div>
    </div>
  );
};

export default QueueFilters;