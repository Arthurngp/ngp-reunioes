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

export interface StorageData {
  clientes: string[]
  semanas: {
    [slug: string]: DadosSemana
  }
}

export type StatusPreenchimento = 'completo' | 'parcial' | 'vazio'
