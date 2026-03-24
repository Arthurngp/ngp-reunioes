import { StorageData, DadosCliente, BlocoEquipe, BlocoGestores, MetricLabels, DEFAULT_METRIC_LABELS } from '@/types'
import { CLIENTES_INICIAIS } from './utils'

const STORAGE_KEY = 'ngp_reunioes'

function dadosClienteVazio(): DadosCliente {
  return {
    equipe: {
      feito_7dias: [''],
      proximo_7dias: [''],
      para_reuniao_cliente: [''],
    },
    gestores: {
      investimento_meta: '',
      investimento_google: '',
      leads_meta: '',
      leads_google: '',
      cpl_meta: '',
      cpl_google: '',
      roas: '',
      testado_ajustado: [''],
      diagnostico: '',
      proxima_alavanca: [''],
    },
  }
}

export function loadStorage(): StorageData {
  if (typeof window === 'undefined') return { clientes: CLIENTES_INICIAIS, semanas: {} }
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const inicial: StorageData = { clientes: CLIENTES_INICIAIS, semanas: {} }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(inicial))
    return inicial
  }
  return JSON.parse(raw) as StorageData
}

export function saveStorage(data: StorageData): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function getClientes(): string[] {
  return loadStorage().clientes
}

export function setClientes(clientes: string[]): void {
  const data = loadStorage()
  data.clientes = clientes
  saveStorage(data)
}

export function getSemanas(): string[] {
  const data = loadStorage()
  return Object.keys(data.semanas).sort((a, b) => b.localeCompare(a))
}

export function getDadosSemana(slug: string): { [cliente: string]: DadosCliente } {
  const data = loadStorage()
  return data.semanas[slug] ?? {}
}

export function getDadosCliente(slug: string, cliente: string): DadosCliente {
  const semana = getDadosSemana(slug)
  return semana[cliente] ?? dadosClienteVazio()
}

export function saveDadosCliente(slug: string, cliente: string, dados: DadosCliente): void {
  const data = loadStorage()
  if (!data.semanas[slug]) data.semanas[slug] = {}
  data.semanas[slug][cliente] = dados
  saveStorage(data)
}

export function saveEquipe(slug: string, cliente: string, equipe: BlocoEquipe): void {
  const dados = getDadosCliente(slug, cliente)
  dados.equipe = equipe
  saveDadosCliente(slug, cliente, dados)
}

export function saveGestores(slug: string, cliente: string, gestores: BlocoGestores): void {
  const dados = getDadosCliente(slug, cliente)
  dados.gestores = gestores
  saveDadosCliente(slug, cliente, dados)
}

export function getMetricLabels(): MetricLabels {
  const data = loadStorage()
  return data.metricLabels ?? DEFAULT_METRIC_LABELS
}

export function saveMetricLabels(labels: MetricLabels): void {
  const data = loadStorage()
  data.metricLabels = labels
  saveStorage(data)
}

export function criarSemana(slug: string): void {
  const data = loadStorage()
  if (!data.semanas[slug]) {
    data.semanas[slug] = {}
    saveStorage(data)
  }
}
