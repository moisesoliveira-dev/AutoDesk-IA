import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Ticket, Priority } from '../types';
import { DEFAULT_SECTORS } from '../constants';

interface StatsProps {
  tickets: Ticket[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#64748b'];

const Stats: React.FC<StatsProps> = ({ tickets }) => {
  // Calc tickets per sector
  const sectorData = DEFAULT_SECTORS.map((sector, index) => {
    return {
      name: sector.split(' ')[0], // Shorten name for chart
      fullName: sector,
      count: tickets.filter(t => t.assignedSector === sector).length,
      color: COLORS[index % COLORS.length]
    };
  }).filter(d => d.count > 0);

  // Calc tickets per priority
  const priorityCounts = Object.values(Priority).reduce((acc, priority) => {
    acc[priority] = tickets.filter(t => t.priority === priority).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Total de Chamados</h3>
          <p className="text-3xl font-bold text-slate-800 mt-2">{tickets.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Prioridade Crítica</h3>
          <p className="text-3xl font-bold text-red-600 mt-2">{priorityCounts[Priority.CRITICAL] || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Em Aberto</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {tickets.filter(t => t.status === 'Aberto').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-gray-500 text-sm font-medium">Resolvidos</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {tickets.filter(t => t.status === 'Resolvido').length}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
        <h3 className="text-gray-700 font-semibold mb-4">Chamados por Setor (IA)</h3>
        <div className="flex-1 min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sectorData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f3f4f6' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {sectorData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Stats;