import React, { useState } from 'react';
import { Mails, Save, Trash2, Plus, Clock, FileText, ChevronRight, ArrowLeft, Filter, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { ReportSchedule, ReportFrequency, TicketStatus } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

interface ReportSettingsPageProps {
  schedules: ReportSchedule[];
  onUpdateSchedules: (schedules: ReportSchedule[]) => void;
  availableSectors: string[];
}

const ReportSettingsPage: React.FC<ReportSettingsPageProps> = ({ schedules, onUpdateSchedules, availableSectors }) => {
  const [editingSchedule, setEditingSchedule] = useState<ReportSchedule | null>(null);
  const [newEmail, setNewEmail] = useState('');

  // Estados para o formulário
  const isEditing = !!editingSchedule;

  const handleCreateNew = () => {
    setEditingSchedule({
      id: Math.random().toString(36).substr(2, 9),
      name: 'Nova Automação de Relatório',
      active: true,
      filters: { sector: 'ALL', status: 'ALL' },
      recipients: [],
      frequency: 'WEEKLY',
      emailSubject: 'Relatório Automático',
      emailBody: 'Segue em anexo o relatório solicitado.'
    });
  };

  const handleSave = () => {
    if (!editingSchedule) return;
    
    // Check if ID exists to update or add
    const exists = schedules.find(s => s.id === editingSchedule.id);
    let updatedList;
    
    if (exists) {
        updatedList = schedules.map(s => s.id === editingSchedule.id ? editingSchedule : s);
    } else {
        updatedList = [...schedules, editingSchedule];
    }
    
    onUpdateSchedules(updatedList);
    setEditingSchedule(null); // Voltar para lista
  };

  const handleDelete = (id: string) => {
    if(confirm("Tem certeza que deseja excluir esta automação?")) {
        onUpdateSchedules(schedules.filter(s => s.id !== id));
        if (editingSchedule?.id === id) setEditingSchedule(null);
    }
  };

  const handleToggleActive = (schedule: ReportSchedule) => {
    const updated = schedules.map(s => s.id === schedule.id ? { ...s, active: !s.active } : s);
    onUpdateSchedules(updated);
  };

  const handleAddEmail = () => {
    if (editingSchedule && newEmail && newEmail.includes('@') && !editingSchedule.recipients.includes(newEmail)) {
      setEditingSchedule({
        ...editingSchedule,
        recipients: [...editingSchedule.recipients, newEmail]
      });
      setNewEmail('');
    }
  };

  const handleRemoveEmail = (email: string) => {
    if (editingSchedule) {
      setEditingSchedule({
        ...editingSchedule,
        recipients: editingSchedule.recipients.filter(e => e !== email)
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Mails className="text-blue-600" />
            Automação de Relatórios
          </h1>
          <p className="text-slate-500">Crie regras para envio automático de relatórios por e-mail.</p>
        </div>
        {!isEditing && (
            <button 
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
            >
                <Plus size={20} /> Nova Automação
            </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        
        {/* LIST VIEW */}
        {!isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {schedules.length === 0 ? (
                <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                    <Mails className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">Nenhuma automação configurada.</p>
                </div>
            ) : (
                schedules.map(schedule => (
                    <div key={schedule.id} className={`bg-white p-6 rounded-xl border transition-all hover:shadow-md ${schedule.active ? 'border-gray-200' : 'border-gray-100 opacity-75'}`}>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{schedule.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${schedule.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {schedule.active ? 'Ativo' : 'Pausado'}
                                    </span>
                                    <span className="text-xs text-slate-400">• {schedule.frequency === 'DAILY' ? 'Diário' : schedule.frequency === 'WEEKLY' ? 'Semanal' : schedule.frequency === 'MONTHLY' ? 'Mensal' : 'Uma vez'}</span>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleToggleActive(schedule)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title={schedule.active ? "Pausar" : "Ativar"}>
                                    {schedule.active ? <CheckCircle size={18} /> : <XCircle size={18} />}
                                </button>
                                <button onClick={() => handleDelete(schedule.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Excluir">
                                    <Trash2 size={18} />
                                </button>
                                <button onClick={() => setEditingSchedule(schedule)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg" title="Editar">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Filter size={14} className="text-slate-400" />
                                <span>Filtro: {schedule.filters.sector === 'ALL' ? 'Todos os Setores' : schedule.filters.sector}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={14} className="text-slate-400" />
                                <span className="truncate">Para: {schedule.recipients.length} destinatários</span>
                            </div>
                        </div>
                    </div>
                ))
            )}
          </motion.div>
        )}

        {/* EDITOR VIEW */}
        {isEditing && (
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
            >
                <button onClick={() => setEditingSchedule(null)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors mb-4">
                    <ArrowLeft size={18} /> Voltar para lista
                </button>

                {/* Nome e Status */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Nome da Automação</label>
                            <input 
                                type="text"
                                value={editingSchedule.name}
                                onChange={e => setEditingSchedule({...editingSchedule, name: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                placeholder="Ex: Relatório Semanal de Vendas"
                            />
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                             <select
                                value={editingSchedule.active ? 'true' : 'false'}
                                onChange={e => setEditingSchedule({...editingSchedule, active: e.target.value === 'true'})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                             >
                                 <option value="true">Ativo</option>
                                 <option value="false">Pausado</option>
                             </select>
                        </div>
                     </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Filtros e Frequência */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b pb-2">
                                <Filter size={18} />
                                <h2>Regras e Filtros</h2>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Filtrar por Setor</label>
                                    <select 
                                        value={editingSchedule.filters.sector}
                                        onChange={e => setEditingSchedule({...editingSchedule, filters: {...editingSchedule.filters, sector: e.target.value}})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                    >
                                        <option value="ALL">Todos os Setores</option>
                                        {availableSectors.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Filtrar por Status</label>
                                    <select 
                                        value={editingSchedule.filters.status}
                                        onChange={e => setEditingSchedule({...editingSchedule, filters: {...editingSchedule.filters, status: e.target.value as TicketStatus | 'ALL'}})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                    >
                                        <option value="ALL">Todos os Status</option>
                                        {Object.values(TicketStatus).map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="pt-4 border-t">
                                     <label className="block text-sm font-medium text-slate-700 mb-1">Frequência de Envio</label>
                                    <div className="flex items-center gap-2">
                                        <Calendar size={18} className="text-slate-400" />
                                        <select 
                                            value={editingSchedule.frequency}
                                            onChange={e => setEditingSchedule({...editingSchedule, frequency: e.target.value as ReportFrequency})}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                        >
                                            <option value="DAILY">Diariamente (08:00)</option>
                                            <option value="WEEKLY">Semanalmente (Segunda)</option>
                                            <option value="MONTHLY">Mensalmente (Dia 1)</option>
                                            <option value="ONE_TIME">Apenas uma vez</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Destinatários e Template */}
                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                             <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b pb-2">
                                <Users size={18} />
                                <h2>Destinatários deste Relatório</h2>
                            </div>
                             <div className="flex gap-2 mb-4">
                                <input 
                                type="email" 
                                value={newEmail}
                                onChange={e => setNewEmail(e.target.value)}
                                placeholder="novo@email.com"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                />
                                <button 
                                type="button"
                                onClick={handleAddEmail}
                                disabled={!newEmail}
                                className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                >
                                <Plus size={18} />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {editingSchedule.recipients.map(email => (
                                    <span key={email} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm flex items-center gap-2 border border-slate-200">
                                        {email}
                                        <button onClick={() => handleRemoveEmail(email)} className="text-slate-400 hover:text-red-500"><XCircle size={14} /></button>
                                    </span>
                                ))}
                                {editingSchedule.recipients.length === 0 && <span className="text-slate-400 text-sm italic">Adicione pelo menos um e-mail.</span>}
                            </div>
                        </div>

                         <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <div className="flex items-center gap-2 mb-4 text-slate-700 font-semibold border-b pb-2">
                                <FileText size={18} />
                                <h2>Mensagem do E-mail</h2>
                            </div>
                            <div className="space-y-3">
                                 <div>
                                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Assunto</label>
                                    <input 
                                        type="text"
                                        value={editingSchedule.emailSubject}
                                        onChange={e => setEditingSchedule({...editingSchedule, emailSubject: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Corpo</label>
                                    <textarea 
                                        rows={3}
                                        value={editingSchedule.emailBody}
                                        onChange={e => setEditingSchedule({...editingSchedule, emailBody: e.target.value})}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-slate-700 resize-none text-sm"
                                    />
                                </div>
                            </div>
                         </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                    <button 
                        onClick={() => setEditingSchedule(null)}
                        className="px-6 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={!editingSchedule.name || editingSchedule.recipients.length === 0}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Save size={18} /> Salvar Automação
                    </button>
                </div>

            </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default ReportSettingsPage;