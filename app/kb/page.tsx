import React, { useState } from 'react';
import { Plus, X, Folder, ChevronLeft, FileText, ChevronRight, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { KnowledgeBaseItem, Ticket, User, Sector } from '../../types';
import KBForm from '../../components/kb/KBForm';
import KBItem from '../../components/kb/KBItem';
import ReviewModal from '../../components/kb/ReviewModal';
import Pagination from '../../components/common/Pagination';

interface KBPageProps {
  items: KnowledgeBaseItem[];
  onUpdateKb: (items: KnowledgeBaseItem[]) => void;
  user: User;
  tickets: Ticket[];
  availableSectors: string[];
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

const ITEMS_PER_PAGE = 6;

const KBPage: React.FC<KBPageProps> = ({ items, onUpdateKb, user, tickets, availableSectors }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeBaseItem | null>(null);
  const [reviewItem, setReviewItem] = useState<KnowledgeBaseItem | null>(null);
  const [activeSector, setActiveSector] = useState<Sector | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const handleSubmit = (itemData: Omit<KnowledgeBaseItem, 'id'>) => {
    if (editingItem) {
      const updatedItems = items.map(item => 
        item.id === editingItem.id ? { ...item, ...itemData, reviewRequested: false, reviewNote: undefined } : item
      );
      onUpdateKb(updatedItems);
      setEditingItem(null);
    } else {
      const newItem: KnowledgeBaseItem = {
        id: Math.random().toString(36).substr(2, 9),
        ...itemData
      };
      onUpdateKb([newItem, ...items]);
      if (!searchTerm) {
        setActiveSector(newItem.sector);
      }
    }
    setIsAdding(false);
  };

  const handleEditClick = (item: KnowledgeBaseItem) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja remover este item?')) {
      const filtered = items.filter(i => i.id !== id);
      onUpdateKb(filtered);
    }
  };

  const toggleApproval = (id: string) => {
    if (user.role !== 'ADMIN') return;
    const updated = items.map(item => 
      item.id === id ? { ...item, approved: !item.approved } : item
    );
    onUpdateKb(updated);
  };

  // Abre o modal
  const openReviewModal = (item: KnowledgeBaseItem) => {
    if (user.role === 'ADMIN' && item.reviewRequested) {
        handleReviewSubmit(item.id, '', item.content, false); // Valida e limpa
    } else {
        setReviewItem(item);
    }
  };

  // Callback do Modal
  const handleReviewSubmit = (id: string, note: string, updatedContent: string, isRequest = true) => {
    const updated = items.map(item => {
      if (item.id === id) {
        const contentChanged = item.content !== updatedContent;
        if (!isRequest) {
            return { 
                ...item, 
                reviewRequested: false, 
                reviewNote: undefined, 
                content: updatedContent,
                approved: true 
            };
        }
        return { 
            ...item, 
            content: updatedContent,
            reviewRequested: true,
            reviewNote: note,
            approved: contentChanged ? false : item.approved 
        };
      }
      return item;
    });
    onUpdateKb(updated);
    setReviewItem(null);
  };

  const handleCancelForm = () => {
    setIsAdding(false);
    setEditingItem(null);
  };

  const sectorCounts = items.reduce((acc, item) => {
    const s = item.sector || 'Desconhecido';
    acc[s] = (acc[s] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // Logic to determine displayed items
  let displayedItems: KnowledgeBaseItem[] = [];
  
  if (searchTerm) {
    const lowerTerm = searchTerm.toLowerCase();
    displayedItems = items.filter(item => 
      item.title.toLowerCase().includes(lowerTerm) ||
      item.content.toLowerCase().includes(lowerTerm) ||
      item.tags.some(tag => tag.toLowerCase().includes(lowerTerm))
    );
  } else if (activeSector) {
    displayedItems = items.filter(item => item.sector === activeSector);
  }

  // Reset page logic
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeSector]);

  // Pagination Logic
  const totalPages = Math.ceil(displayedItems.length / ITEMS_PER_PAGE);
  const currentItems = displayedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2">
            {!searchTerm && activeSector && (
              <motion.button 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setActiveSector(null)}
                className="text-slate-400 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
            <h1 className="text-2xl font-bold text-slate-800">
              {searchTerm 
                ? 'Resultados da Busca' 
                : (activeSector ? activeSector : 'Base de Conhecimento')}
            </h1>
          </div>
          <p className="text-slate-500 mt-1">
            {searchTerm
               ? `Encontrados ${displayedItems.length} artigos.`
               : (activeSector 
                  ? `Visualizando artigos do setor ${activeSector}` 
                  : 'Documentação técnica e procedimentos padrão.')}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
             {!isAdding && (
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar em toda a base..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white text-slate-800"
                    />
                    {searchTerm && (
                        <button 
                            onClick={() => setSearchTerm('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>
             )}

            <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
                if(isAdding) handleCancelForm();
                else setIsAdding(true);
            }}
            className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
            {isAdding ? <X size={18} /> : <Plus size={18} />}
            {isAdding ? 'Cancelar' : user.role === 'ADMIN' ? 'Adicionar Item' : 'Sugerir Solução'}
            </motion.button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Modal de Revisão */}
        {reviewItem && (
            <ReviewModal 
                item={reviewItem} 
                onClose={() => setReviewItem(null)} 
                onSubmit={(id, note, content) => handleReviewSubmit(id, note, content, true)} 
            />
        )}

        {isAdding && (
          <motion.div
            key="form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <KBForm 
              user={user} 
              tickets={tickets} 
              initialData={editingItem}
              onSubmit={handleSubmit} 
              onCancel={handleCancelForm}
              availableSectors={availableSectors}
            />
          </motion.div>
        )}

        {!isAdding && !activeSector && !searchTerm && (
          <motion.div 
            key="folders"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, x: -50 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {availableSectors.map(sector => (
              <motion.button
                key={sector}
                variants={itemVariants}
                whileHover={{ scale: 1.02, borderColor: '#60a5fa' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSector(sector)}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm transition-all text-left group flex items-start justify-between"
              >
                <div>
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Folder size={24} />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-lg">{sector}</h3>
                  <p className="text-slate-500 text-sm mt-1">{sectorCounts[sector] || 0} artigos</p>
                </div>
                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
              </motion.button>
            ))}
          </motion.div>
        )}

        {(activeSector || searchTerm) && !isAdding && (
          <motion.div 
            key="list"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="space-y-4"
          >
            {displayedItems.length === 0 ? (
              <div className="col-span-full text-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">
                    {searchTerm 
                        ? `Nenhum resultado para "${searchTerm}"` 
                        : 'Nenhum artigo encontrado neste setor.'}
                </p>
                {searchTerm && (
                    <button 
                        onClick={() => setSearchTerm('')} 
                        className="mt-2 text-blue-600 hover:underline"
                    >
                        Limpar busca
                    </button>
                )}
              </div>
            ) : (
              <>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <KBItem 
                          item={item} 
                          user={user} 
                          onToggleApproval={toggleApproval}
                          onEdit={handleEditClick}
                          onDelete={handleDelete}
                          onRequestReview={(i) => {
                              if (user.role === 'ADMIN' && i.reviewRequested) {
                                  handleReviewSubmit(i.id, '', i.content, false);
                              } else {
                                  openReviewModal(i);
                              }
                          }}
                        />
                      </motion.div>
                    ))}
                 </div>
                 
                 <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={displayedItems.length}
                    itemsName="artigos"
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

export default KBPage;