import { Agent, KnowledgeBaseItem, Ticket, TicketStatus, Priority, User, Role, ReportSchedule } from './types';

// ID do Administrador Mestre (Não pode ser deletado)
export const MASTER_ADMIN_ID = 'u3';

// Setores Padrão Iniciais
export const DEFAULT_SECTORS = [
  'TI e Suporte',
  'Recursos Humanos',
  'Vendas',
  'Financeiro',
  'Manutenção Predial',
  'Triagem Manual'
];

export const DEFAULT_REPORT_SCHEDULES: ReportSchedule[] = [
  {
    id: 'sched_1',
    name: 'Relatório Geral Semanal',
    active: true,
    filters: {
      sector: 'ALL',
      status: 'ALL'
    },
    recipients: ['diretoria@empresa.com'],
    frequency: 'WEEKLY',
    emailSubject: 'Resumo Semanal de Atendimentos',
    emailBody: 'Olá,\n\nSegue o resumo geral de todos os departamentos desta semana.\n\nAtt, AutoDesk AI',
    nextRunDate: new Date(Date.now() + 604800000).toISOString()
  },
  {
    id: 'sched_2',
    name: 'Alertas Diários TI',
    active: true,
    filters: {
      sector: 'TI e Suporte',
      status: TicketStatus.OPEN
    },
    recipients: ['suporte.ti@empresa.com', 'gestor.ti@empresa.com'],
    frequency: 'DAILY',
    emailSubject: '[TI] Chamados em Aberto - Diário',
    emailBody: 'Equipe,\n\nLista de chamados de TI que ainda precisam de atenção.\n\nFavor verificar.',
    nextRunDate: new Date(Date.now() + 86400000).toISOString()
  }
];

// Usuários do Sistema para Login (Agora com email/senha e aprovados)
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'João Solicitante',
    email: 'joao@empresa.com',
    registrationNumber: '1001',
    password: '123',
    role: 'REQUESTER',
    avatar: 'https://ui-avatars.com/api/?name=Joao+S&background=random',
    approved: true
  },
  {
    id: 'u2',
    name: 'Carlos Suporte (TI)',
    email: 'carlos@empresa.com',
    registrationNumber: '2002',
    password: '123',
    role: 'SUPPORT',
    sector: 'TI e Suporte',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+S&background=0D8ABC&color=fff',
    approved: true
  },
  {
    id: MASTER_ADMIN_ID,
    name: 'Ana Admin',
    email: 'admin@empresa.com',
    registrationNumber: '0001',
    password: 'admin',
    role: 'ADMIN',
    avatar: 'https://ui-avatars.com/api/?name=Ana+A&background=2e2e2e&color=fff',
    approved: true
  }
];

export const MOCK_AGENTS: Agent[] = [
  { id: 'u2', name: 'Carlos Suporte', sector: 'TI e Suporte', avatar: 'https://ui-avatars.com/api/?name=Carlos+S' },
  // Outros agentes virtuais para visualização
  { id: 'a2', name: 'Mariana HR', sector: 'Recursos Humanos', avatar: 'https://ui-avatars.com/api/?name=Mariana' },
];

export const INITIAL_KB: KnowledgeBaseItem[] = [
  {
    id: 'kb1',
    title: 'Problemas de Login',
    content: 'Se o usuário não conseguir logar, peça para verificar se o Caps Lock está ativado. Se persistir, resetar a senha no painel AD.',
    tags: ['login', 'senha', 'ti'],
    sector: 'TI e Suporte',
    approved: true,
    authorId: 'u3'
  },
  {
    id: 'kb2',
    title: 'Solicitação de Férias',
    content: 'Férias devem ser solicitadas com 30 dias de antecedência através do portal do colaborador.',
    tags: ['ferias', 'rh', 'processo'],
    sector: 'Recursos Humanos',
    approved: true,
    authorId: 'u3'
  },
  {
    id: 'kb3',
    title: 'Configuração VPN (Pendente)',
    content: 'Instalar cliente Cisco AnyConnect e usar servidor vpn.empresa.com.br',
    tags: ['vpn', 'rede'],
    sector: 'TI e Suporte',
    approved: false, // Pendente de aprovação
    authorId: 'u2'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 't1',
    title: 'Computador não liga',
    requesterId: 'u1',
    requesterName: 'João Solicitante',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: TicketStatus.WAITING_USER, // Aguardando resposta do user após IA
    assignedSector: 'TI e Suporte',
    assignedAgentId: 'u2',
    priority: Priority.HIGH,
    messages: [
      {
        id: 'm1',
        ticketId: 't1',
        senderId: 'u1',
        senderName: 'João Solicitante',
        content: 'Meu notebook dell não está ligando hoje de manhã. A luz do carregador acende mas a tela não.',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        isAi: false
      },
      {
        id: 'm2',
        ticketId: 't1',
        senderId: 'system',
        senderName: 'AutoDesk AI',
        content: 'Olá João, um técnico de TI foi notificado. Enquanto isso, tente segurar o botão de ligar por 30 segundos sem o carregador conectado.',
        createdAt: new Date(Date.now() - 86390000).toISOString(),
        isAi: true
      }
    ],
    aiAnalysis: {
      sector: 'TI e Suporte',
      priority: Priority.HIGH,
      suggestedAgentId: 'u2',
      reasoning: 'Problema de hardware impeditivo.',
      autoResponse: 'Olá João, um técnico de TI foi notificado...',
      confidenceScore: 0.95
    }
  }
];