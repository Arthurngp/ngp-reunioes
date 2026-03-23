'use client'

import { BlocoEquipe as TBlocoEquipe } from '@/types'
import ListaEditavel from './ListaEditavel'

interface Props {
  dados: TBlocoEquipe
  onChange?: (dados: TBlocoEquipe) => void
  readOnly?: boolean
}

const sectionLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8,
}

export default function BlocoEquipe({ dados, onChange, readOnly = false }: Props) {
  function update(campo: keyof TBlocoEquipe, valor: string[]) {
    onChange?.({ ...dados, [campo]: valor })
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={sectionLabel}>1. O que foi feito nos últimos 7 dias</p>
        <ListaEditavel itens={dados.feito_7dias} onChange={v => update('feito_7dias', v)} placeholder="Descreva o que foi feito..." readOnly={readOnly} />
      </div>
      <div>
        <p style={sectionLabel}>2. O que vai ser feito nos próximos 7 dias</p>
        <ListaEditavel itens={dados.proximo_7dias} onChange={v => update('proximo_7dias', v)} placeholder="Descreva o que será feito..." readOnly={readOnly} />
      </div>
      <div>
        <p style={sectionLabel}>3. O que vai para a reunião com o cliente</p>
        <ListaEditavel itens={dados.para_reuniao_cliente} onChange={v => update('para_reuniao_cliente', v)} placeholder="Pautas para o cliente..." readOnly={readOnly} />
      </div>
    </div>
  )
}
