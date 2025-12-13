import React from 'react';
import { Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from '../common/SearchBar';

interface SectorListProps {
  sectors: string[];
  onRemoveSector: (name: string) => void;
}

const SectorList: React.FC<SectorListProps> = ({ sectors, onRemoveSector }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const filteredSectors = sectors.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4 gap-4">
         <h2 className="font-semibold text-lg text-slate-800">Setores Ativos ({filteredSectors.length})</h2>
         <div className="w-48">
            <SearchBar 
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Filtrar..."
                className=""
            />
         </div>
      </div>
      
      <div className="space-y-3">
        <AnimatePresence>
          {filteredSectors.length === 0 ? (
              <p className="text-slate-400 italic text-center py-4">Nenhum setor encontrado.</p>
          ) : (
            filteredSectors.map(sector => (
                <motion.div
                key={sector}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 group hover:border-blue-200 transition-colors"
                >
                <span className="font-medium text-slate-700">{sector}</span>
                <button
                    onClick={() => {
                        if(confirm(`Tem certeza que deseja remover o setor "${sector}"? Isso não apaga os chamados existentes.`)) {
                            onRemoveSector(sector);
                        }
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Remover Setor"
                >
                    <Trash2 size={16} />
                </button>
                </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SectorList;