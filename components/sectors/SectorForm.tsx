import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface SectorFormProps {
  onAddSector: (name: string) => void;
}

const SectorForm: React.FC<SectorFormProps> = ({ onAddSector }) => {
  const [newSector, setNewSector] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSector.trim()) {
      onAddSector(newSector.trim());
      setNewSector('');
    }
  };

  return (
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
  );
};

export default SectorForm;