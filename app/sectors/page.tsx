import React, { useState } from 'react';
import { Plus, Trash2, Layers, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SectorsPageProps {
  sectors: string[];
  onAddSector: (name: string) => void;
  onRemoveSector: (name: string) => void;
}

const SectorsPage: React.FC<SectorsPageProps> = ({ sectors, onAddSector, onRemoveSector }) => {
  const [newSector, setNewSector] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSector.trim()) {
      onAddSector(newSector.trim());
      setNewSector('');
    }
  };

  const filteredSectors = sectors.filter(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Layers className="text-blue-600" />
          Gerenciamento de Setores
        </h1>
        <p className="text-slate-500">Adicione novos departamentos para organizar chamados e base de conhecimento.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-fit">
          <h2 className="font-semibold text-lg mb-4 text-slate-800">Novo Setor</h2>
          <form onSubmit={handleAdd}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Nome do Setor</label>
              <input
                type="text"
                value={newSector}
                onChange={(e) => setNewSector(e.target.value)}
                placeholder="Ex: Marketing"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={18} /> Adicionar
            </button>
          </form>
        </div>

        {/* List */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-4">
             <h2 className="font-semibold text-lg text-slate-800">Setores Ativos ({filteredSectors.length})</h2>
             <div className="relative w-48">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                    type="text"
                    placeholder="Filtrar..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-800"
                />
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')} 
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        <X size={12} />
                    </button>
                )}
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
      </div>
    </div>
  );
};

export default SectorsPage;