'use client'

import { useState, useEffect } from 'react'
import { BlocoGestores as TBlocoGestores } from '@/types'
import { MetricLabels } from '@/types'
import { getMetricLabels, saveMetricLabels } from '@/lib/storage'
import MetricasGrid from './MetricasGrid'
import ListaEditavel from './ListaEditavel'

interface Props {
  dados: TBlocoGestores
  onChange?: (dados: TBlocoGestores) => void
  readOnly?: boolean
}

const sectionLabel: React.CSSProperties = {
  fontSize: 12, fontWeight: 600, color: 'var(--text-muted)',
  textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8,
}

const textareaStyle: React.CSSProperties = {
  width: '100%', fontSize: 13, background: 'var(--bg-input)',
  border: '1px solid var(--border)', borderRadius: 8, padding: '8px 10px',
  color: 'var(--text-primary)', outline: 'none', resize: 'none',
  transition: 'border-color 0.15s', minHeight: 60,
  fontFamily: 'inherit',
}

export default function BlocoGestores({ dados, onChange, readOnly = false }: Props) {
  const [metricLabels, setMetricLabels] = useState<MetricLabels>(getMetricLabels())

  useEffect(() => {
    setMetricLabels(getMetricLabels())
  }, [])

  function updateCampo(campo: keyof TBlocoGestores, valor: string | string[]) {
    onChange?.({ ...dados, [campo]: valor })
  }

  function handleChangeLabels(labels: MetricLabels) {
    setMetricLabels(labels)
    saveMetricLabels(labels)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={sectionLabel}>1. Métricas</p>
        <MetricasGrid
          investimento_meta={dados.investimento_meta} investimento_google={dados.investimento_google}
          leads_meta={dados.leads_meta} leads_google={dados.leads_google}
          cpl_meta={dados.cpl_meta} cpl_google={dados.cpl_google}
          roas={dados.roas}
          labels={metricLabels}
          onChange={readOnly ? undefined : (campo, valor) => updateCampo(campo as keyof TBlocoGestores, valor)}
          onChangeLabels={readOnly ? undefined : handleChangeLabels}
          readOnly={readOnly}
        />
      </div>
      <div>
        <p style={sectionLabel}>2. O que foi testado ou ajustado?</p>
        <ListaEditavel itens={dados.testado_ajustado} onChange={v => updateCampo('testado_ajustado', v)} placeholder="Descreva o que foi testado..." readOnly={readOnly} />
      </div>
      <div>
        <p style={sectionLabel}>3. Diagnóstico do momento</p>
        {readOnly ? (
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{dados.diagnostico || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>—</span>}</p>
        ) : (
          <textarea
            value={dados.diagnostico}
            onChange={e => updateCampo('diagnostico', e.target.value)}
            placeholder="Como está o momento atual..."
            rows={2} style={textareaStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--red)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        )}
      </div>
      <div>
        <p style={sectionLabel}>4. Próxima alavanca — o que muda nos próximos 7 dias?</p>
        <ListaEditavel itens={dados.proxima_alavanca} onChange={v => updateCampo('proxima_alavanca', v)} placeholder="Qual a próxima ação estratégica..." readOnly={readOnly} />
      </div>
    </div>
  )
}
