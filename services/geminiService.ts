import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Priority, Agent, KnowledgeBaseItem, AITicketAnalysis, Ticket, KBAnalysisResult, Sector } from '../types';

const apiKey = process.env.API_KEY;
// Initialize with fail-safe check in component, but define here
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Helper to format KB for prompt
const formatKBForPrompt = (kb: KnowledgeBaseItem[]): string => {
  return kb.map(item => `- [${item.title}]: ${item.content} (Tags: ${item.tags.join(', ')})`).join('\n');
};

// Helper to format Agents for prompt
const formatAgentsForPrompt = (agents: Agent[]): string => {
  return agents.map(a => `- ID: ${a.id}, Nome: ${a.name}, Setor: ${a.sector}`).join('\n');
};

const getAnalysisSchema = (availableSectors: string[]): Schema => ({
  type: Type.OBJECT,
  properties: {
    sector: {
      type: Type.STRING,
      enum: availableSectors,
      description: "O setor mais apropriado para resolver o problema."
    },
    priority: {
      type: Type.STRING,
      enum: Object.values(Priority),
      description: "O nível de prioridade baseado na urgência e impacto."
    },
    suggestedAgentId: {
      type: Type.STRING,
      description: "O ID do agente mais indicado para resolver (escolha da lista fornecida)."
    },
    reasoning: {
      type: Type.STRING,
      description: "Uma explicação breve de porque este setor e prioridade foram escolhidos."
    },
    autoResponse: {
      type: Type.STRING,
      description: "Uma sugestão de resposta amigável e técnica baseada na base de conhecimento fornecida."
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: "Nível de confiança na classificação de 0 a 1."
    }
  },
  required: ["sector", "priority", "suggestedAgentId", "reasoning", "autoResponse", "confidenceScore"]
});

const kbGenerationSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    problemDescription: {
      type: Type.STRING,
      description: "Um resumo claro e técnico de qual foi o problema relatado no chamado."
    },
    suggestedTitle: {
      type: Type.STRING,
      description: "Um título curto e padronizado para o artigo da base de conhecimento."
    },
    suggestedTags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Tags relevantes para busca (ex: hardware, impressora, rede)."
    },
    sufficientInformation: {
      type: Type.BOOLEAN,
      description: "True se foi possível identificar um problema técnico claro no histórico. False se as mensagens são vagas ou insuficientes."
    }
  },
  required: ["problemDescription", "suggestedTitle", "suggestedTags", "sufficientInformation"]
};

export const analyzeTicketWithGemini = async (
  title: string,
  description: string,
  agents: Agent[],
  kb: KnowledgeBaseItem[],
  availableSectors: string[]
): Promise<AITicketAnalysis> => {
  if (!ai) {
    throw new Error("API Key not configured");
  }

  const model = "gemini-2.5-flash";
  
  const prompt = `
    Você é um despachante de suporte técnico especialista e sistema de triagem com IA.
    
    Analise o seguinte chamado:
    Título: "${title}"
    Descrição: "${description}"

    Use os seguintes dados para tomar sua decisão:

    1. **Agentes Disponíveis:**
    ${formatAgentsForPrompt(agents)}

    2. **Base de Conhecimento (Regras e Soluções Passadas):**
    ${formatKBForPrompt(kb)}

    3. **Setores Disponíveis:** ${availableSectors.join(', ')}

    **Instruções:**
    - Classifique o setor corretamente usando APENAS um dos setores disponíveis.
    - Defina a prioridade (Crítica se parar a empresa/faturamento, Alta se parar um usuário, Média se for parcial, Baixa se for dúvida/solicitação simples).
    - Escolha o ID do agente cujo setor corresponde ao problema.
    - Gere uma resposta automática (autoResponse) que seja empática e tente resolver o problema usando a Base de Conhecimento se possível, ou informe que o técnico foi acionado.
    - Se a Base de Conhecimento tiver uma solução direta, inclua-a na resposta.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: getAnalysisSchema(availableSectors),
        temperature: 0.2 // Low temperature for consistent classification
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AITicketAnalysis;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback in case of error
    return {
      sector: "Triagem Manual",
      priority: Priority.MEDIUM,
      suggestedAgentId: "",
      reasoning: "Falha na análise automática. Por favor, classifique manualmente.",
      autoResponse: "Recebemos sua solicitação e ela será analisada manualmente em breve.",
      confidenceScore: 0
    };
  }
};

export const generateKBEntryFromTicket = async (ticket: Ticket): Promise<KBAnalysisResult> => {
  if (!ai) throw new Error("API Key not configured");

  const model = "gemini-2.5-flash";
  
  // Format message history
  const history = ticket.messages
    .map(m => `${m.senderName} (${m.senderId === 'system' ? 'IA' : 'User'}): ${m.content}`)
    .join('\n');

  const prompt = `
    Você é um especialista em documentação técnica. Seu objetivo é criar um rascunho de artigo para Base de Conhecimento a partir de um chamado resolvido.
    
    **Dados do Chamado:**
    Título Original: "${ticket.title}"
    Setor: ${ticket.assignedSector}
    Histórico da Conversa:
    ${history}

    **Instruções:**
    1. Analise a conversa para entender qual foi o problema real. Ignore cumprimentos ou conversas irrelevantes.
    2. Escreva um "problemDescription" que explique o sintoma e a causa (se identificável) de forma impessoal e técnica.
    3. Gere um "suggestedTitle" padronizado (ex: "Falha no Login - Erro 500" em vez de "não consigo entrar").
    4. Gere tags relevantes.
    5. IMPORTANTE: Se o histórico for vago, não tiver detalhes técnicos ou não for possível entender o problema (ex: apenas "oi", "testando", "resolvido"), defina "sufficientInformation" como false.
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: kbGenerationSchema,
        temperature: 0.2
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as KBAnalysisResult;
  } catch (error) {
    console.error("KB Generation Error:", error);
    return {
      problemDescription: "",
      suggestedTitle: ticket.title,
      suggestedTags: [],
      sufficientInformation: false
    };
  }
};