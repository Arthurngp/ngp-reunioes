export interface BlocoEquipe {
  feito_7dias: string[]
  proximo_7dias: string[]
  para_reuniao_cliente: string[]
}

export interface BlocoGestores {
  investimento_meta: string
  investimento_google: string
  leads_meta: string
  leads_google: string
  cpl_meta: string
  cpl_google: string
  roas: string
  testado_ajustado: string[]
  diagnostico: string
  proxima_alavanca: string[]
}

export interface DadosCliente {
  equipe: BlocoEquipe
  gestores: BlocoGestores
}

export interface DadosSemana {
  [cliente: string]: DadosCliente
}

export interface MetricLabels {
  label1: string
  label2: string
  label3: string
  label4: string
}

export const DEFAULT_METRIC_LABELS: MetricLabels = {
  label1: 'Investimento',
  label2: 'Leads/Vendas',
  label3: 'CPL/CPA',
  label4: 'ROAS/ROI',
}

export interface StorageData {
  clientes: string[]
  semanas: {
    [slug: string]: DadosSemana
  }
  metricLabels?: MetricLabels
}

export type StatusPreenchimento = 'completo' | 'parcial' | 'vazio'
