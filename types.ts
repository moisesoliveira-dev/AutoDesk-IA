// Removido Enum estático para permitir setores dinâmicos
export type Sector = string;

export enum Priority {
  LOW = 'Baixa',
  MEDIUM = 'Média',
  HIGH = 'Alta',
  CRITICAL = 'Crítica'
}

export enum TicketStatus {
  OPEN = 'Aberto',
  IN_PROGRESS = 'Em Atendimento',
  WAITING_USER = 'Aguardando Usuário',
  RESOLVED = 'Resolvido',
  CLOSED = 'Fechado'
}

export type Role = 'REQUESTER' | 'SUPPORT' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  role: Role;
  sector?: Sector;
  avatar: string;
}

export interface Message {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  isAi?: boolean;
  isInternal?: boolean; // Novo: Mensagens privadas da equipe
}

export interface Agent {
  id: string;
  name: string;
  sector: Sector;
  avatar: string;
}

export interface KnowledgeBaseItem {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sector: Sector;
  approved: boolean;
  authorId: string;
}

export interface AITicketAnalysis {
  sector: Sector;
  priority: Priority;
  suggestedAgentId: string;
  reasoning: string;
  autoResponse: string;
  confidenceScore: number;
}

export interface KBAnalysisResult {
  problemDescription: string;
  suggestedTitle: string;
  suggestedTags: string[];
  sufficientInformation: boolean;
}

export interface Ticket {
  id: string;
  title: string;
  requesterId: string;
  requesterName: string;
  createdAt: string;
  status: TicketStatus;
  
  // Chat History
  messages: Message[];
  
  // AI/Assignment Fields
  assignedSector: Sector;
  assignedAgentId?: string;
  priority: Priority;
  aiAnalysis?: AITicketAnalysis;

  // Feedback
  rating?: number; // 1-5
  feedback?: string;
}

export interface ReportFilter {
  startDate: string;
  endDate: string;
  status: TicketStatus | 'ALL';
  sector: Sector | 'ALL';
}

export type ReportFrequency = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'ONE_TIME';

export interface ReportSchedule {
  id: string;
  name: string; // Nome interno da automação (ex: "Relatório Mensal Diretoria")
  active: boolean;
  
  // Filtros Específicos deste relatório
  filters: {
    sector: Sector | 'ALL';
    status: TicketStatus | 'ALL';
  };

  // Configuração de Envio
  recipients: string[];
  frequency: ReportFrequency;
  
  // Template
  emailSubject: string;
  emailBody: string;
  
  nextRunDate?: string;
  lastRunDate?: string;
}