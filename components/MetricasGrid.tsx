'use client'

import { MetricLabels, DEFAULT_METRIC_LABELS } from '@/types'

const inputStyle = {
  width: '100%', fontSize: 13,
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '7px 10px', color: 'var(--text-primary)',
  outline: 'none', transition: 'border-color 0.15s',
}

const labelInputStyle = {
  width: '100%', fontSize: 13,
  background: 'transparent', border: '1px solid transparent',
  borderRadius: 6, padding: '4px 6px', color: 'var(--text-muted)',
  outline: 'none', transition: 'border-color 0.15s, background 0.15s',
  cursor: 'text',
}

interface MetricaRowProps {
  label: string
  valorMeta: string
  valorGoogle: string
  onChangeMeta: (v: string) => void
  onChangeGoogle: (v: string) => void
  onChangeLabel?: (v: string) => void
  readOnly?: boolean
}

function MetricaRow({ label, valorMeta, valorGoogle, onChangeMeta, onChangeGoogle, onChangeLabel, readOnly }: MetricaRowProps) {
  if (readOnly) {
    if (!valorMeta && !valorGoogle) return null
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', gap: 10, padding: '8px 0', borderBottom: '1px solid #1a1a1a' }}>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{valorMeta || '—'}</span>
        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{valorGoogle || '—'}</span>
      </div>
    )
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', gap: 10, alignItems: 'center', marginBottom: 8 }}>
      <input
        type="text" value={label}
        onChange={e => onChangeLabel?.(e.target.value)}
        style={labelInputStyle}
        title="Clique para renomear"
        onFocus={e => { e.target.style.borderColor = '#333'; e.target.style.background = 'var(--bg-input)' }}
        onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'transparent' }}
        onMouseOver={e => { const t = e.target as HTMLInputElement; if (document.activeElement !== t) t.style.borderColor = '#2a2a2a' }}
        onMouseOut={e => { const t = e.target as HTMLInputElement; if (document.activeElement !== t) t.style.borderColor = 'transparent' }}
      />
      <input type="text" value={valorMeta} onChange={e => onChangeMeta(e.target.value)}
        placeholder="Meta (M)" style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'var(--red)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
      <input type="text" value={valorGoogle} onChange={e => onChangeGoogle(e.target.value)}
        placeholder="Google (G)" style={inputStyle}
        onFocus={e => (e.target.style.borderColor = 'var(--red)')}
        onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
    </div>
  )
}

interface Props {
  investimento_meta: string; investimento_google: string
  leads_meta: string; leads_google: string
  cpl_meta: string; cpl_google: string
  roas: string
  labels?: MetricLabels
  onChange?: (campo: string, valor: string) => void
  onChangeLabels?: (labels: MetricLabels) => void
  readOnly?: boolean
}

export default function MetricasGrid({ investimento_meta, investimento_google, leads_meta, leads_google, cpl_meta, cpl_google, roas, labels, onChange, onChangeLabels, readOnly = false }: Props) {
  const l = labels ?? DEFAULT_METRIC_LABELS
  const noop = () => {}
  const headerStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.07em',
  }
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', gap: 10, marginBottom: readOnly ? 8 : 10, paddingBottom: 8, borderBottom: '1px solid #1e1e1e' }}>
        <span style={headerStyle}>Métrica</span>
        <span style={headerStyle}>Meta (M)</span>
        <span style={headerStyle}>Google (G)</span>
      </div>
      <MetricaRow
        label={l.label1} valorMeta={investimento_meta} valorGoogle={investimento_google}
        onChangeMeta={onChange ? v => onChange('investimento_meta', v) : noop}
        onChangeGoogle={onChange ? v => onChange('investimento_google', v) : noop}
        onChangeLabel={onChangeLabels ? v => onChangeLabels({ ...l, label1: v }) : undefined}
        readOnly={readOnly} />
      <MetricaRow
        label={l.label2} valorMeta={leads_meta} valorGoogle={leads_google}
        onChangeMeta={onChange ? v => onChange('leads_meta', v) : noop}
        onChangeGoogle={onChange ? v => onChange('leads_google', v) : noop}
        onChangeLabel={onChangeLabels ? v => onChangeLabels({ ...l, label2: v }) : undefined}
        readOnly={readOnly} />
      <MetricaRow
        label={l.label3} valorMeta={cpl_meta} valorGoogle={cpl_google}
        onChangeMeta={onChange ? v => onChange('cpl_meta', v) : noop}
        onChangeGoogle={onChange ? v => onChange('cpl_google', v) : noop}
        onChangeLabel={onChangeLabels ? v => onChangeLabels({ ...l, label3: v }) : undefined}
        readOnly={readOnly} />
      {/* ROAS */}
      {readOnly ? (
        roas ? (
          <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', gap: 10, padding: '8px 0' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{l.label4}</span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', gridColumn: 'span 2' }}>{roas}</span>
          </div>
        ) : null
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '130px 1fr 1fr', gap: 10, alignItems: 'center' }}>
          <input
            type="text" value={l.label4}
            onChange={e => onChangeLabels?.({ ...l, label4: e.target.value })}
            style={labelInputStyle}
            title="Clique para renomear"
            onFocus={e => { e.target.style.borderColor = '#333'; e.target.style.background = 'var(--bg-input)' }}
            onBlur={e => { e.target.style.borderColor = 'transparent'; e.target.style.background = 'transparent' }}
            onMouseOver={e => { const t = e.target as HTMLInputElement; if (document.activeElement !== t) t.style.borderColor = '#2a2a2a' }}
            onMouseOut={e => { const t = e.target as HTMLInputElement; if (document.activeElement !== t) t.style.borderColor = 'transparent' }}
          />
          <input type="text" value={roas} onChange={e => onChange?.('roas', e.target.value)}
            placeholder="Valor" style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--red)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
        </div>
      )}
    </div>
  )
}
