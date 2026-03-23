import { DadosCliente, StatusPreenchimento } from '@/types'

export function getSlugSemanaAtual(): string {
  const hoje = new Date()
  const diaSemana = hoje.getDay() // 0=dom, 1=seg, ...
  const diasAteLundaMais1 = diaSemana === 0 ? -6 : 1 - diaSemana
  const segunda = new Date(hoje)
  segunda.setDate(hoje.getDate() + diasAteLundaMais1)
  return formatarSlug(segunda)
}

export function formatarSlug(data: Date): string {
  const ano = data.getFullYear()
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const dia = String(data.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function slugParaDataFormatada(slug: string): string {
  const [ano, mes, dia] = slug.split('-')
  return `${dia}/${mes}/${ano}`
}

export function calcularStatus(dados: DadosCliente | undefined): StatusPreenchimento {
  if (!dados) return 'vazio'

  const camposEquipe = [
    dados.equipe.feito_7dias,
    dados.equipe.proximo_7dias,
    dados.equipe.para_reuniao_cliente,
  ]
  const camposGestores = [
    dados.gestores.investimento_meta,
    dados.gestores.investimento_google,
    dados.gestores.leads_meta,
    dados.gestores.leads_google,
    dados.gestores.diagnostico,
  ]
  const listasGestores = [
    dados.gestores.testado_ajustado,
    dados.gestores.proxima_alavanca,
  ]

  const totalCampos =
    camposEquipe.filter((l) => l.some((i) => i.trim() !== '')).length +
    camposGestores.filter((v) => v.trim() !== '').length +
    listasGestores.filter((l) => l.some((i) => i.trim() !== '')).length

  if (totalCampos === 0) return 'vazio'
  const maxCampos = camposEquipe.length + camposGestores.length + listasGestores.length
  if (totalCampos >= maxCampos - 2) return 'completo'
  return 'parcial'
}

export const CLIENTES_INICIAIS = [
  'Monttari',
  'Bora',
  'Dr. Thiago',
  'Sarados',
  'Natuka',
  'CF',
  'Autên',
  'Dr André',
  "Sergio's",
  'Solucione',
  'Agreste',
  'Confirm',
  'Elice',
  'Unipeças',
  'Ferreiro',
  'Óticas',
  'Astúcia',
  'AK',
  'EEI',
  'Caruaru Online',
]
