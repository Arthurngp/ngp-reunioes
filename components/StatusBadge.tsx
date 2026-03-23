import { StatusPreenchimento } from '@/types'

interface Props {
  status: StatusPreenchimento
}

export default function StatusBadge({ status }: Props) {
  if (status === 'completo') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: 'rgba(230,48,48,0.12)', color: 'var(--red)',
        border: '1px solid rgba(230,48,48,0.25)',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--red)' }} />
        Completo
      </span>
    )
  }
  if (status === 'parcial') {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
        background: 'rgba(230,48,48,0.06)', color: '#c07070',
        border: '1px solid rgba(230,48,48,0.12)',
      }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c07070' }} />
        Parcial
      </span>
    )
  }
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
      background: '#1a1a1a', color: 'var(--text-muted)',
      border: '1px solid var(--border)',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)' }} />
      Vazio
    </span>
  )
}
