import React from 'react';
import { Layers } from 'lucide-react';
import SectorForm from '../../components/sectors/SectorForm';
import SectorList from '../../components/sectors/SectorList';

interface SectorsPageProps {
  sectors: string[];
  onAddSector: (name: string) => void;
  onRemoveSector: (name: string) => void;
}

const SectorsPage: React.FC<SectorsPageProps> = ({ sectors, onAddSector, onRemoveSector }) => {
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
        <SectorForm onAddSector={onAddSector} />
        <SectorList sectors={sectors} onRemoveSector={onRemoveSector} />
      </div>
    </div>
  );
};

export default SectorsPage;