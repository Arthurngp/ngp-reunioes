'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DadosCliente } from '@/types'
import { calcularStatus } from '@/lib/utils'
import { getDadosCliente, saveEquipe, saveGestores } from '@/lib/storage'
import StatusBadge from './StatusBadge'
import BlocoEquipe from './BlocoEquipe'
import BlocoGestores from './BlocoGestores'

interface Props {
  slug: string
  cliente: string
  readOnly?: boolean
}

export default function ClienteCard({ slug, cliente, readOnly = false }: Props) {
  const [aberto, setAberto] = useState(false)
  const [dados, setDados] = useState<DadosCliente>(() => getDadosCliente(slug, cliente))
  const [abaAtiva, setAbaAtiva] = useState<'equipe' | 'gestores'>('equipe')
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const status = calcularStatus(dados)

  const salvar = useCallback((novosDados: DadosCliente) => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      saveEquipe(slug, cliente, novosDados.equipe)
      saveGestores(slug, cliente, novosDados.gestores)
    }, 500)
  }, [slug, cliente])

  useEffect(() => {
    setDados(getDadosCliente(slug, cliente))
  }, [slug, cliente])

  const isCompleto = status === 'completo'

  return (
    <div style={{
      border: `1px solid ${aberto ? (isCompleto ? 'rgba(230,48,48,0.3)' : '#2a2a2a') : 'var(--border)'}`,
      borderRadius: 12, overflow: 'hidden',
      transition: 'border-color 0.2s',
      boxShadow: aberto && isCompleto ? '0 0 0 1px rgba(230,48,48,0.1)' : 'none',
    }}>
      {/* Header */}
      <button
        onClick={() => setAberto(!aberto)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '13px 16px', background: aberto ? 'var(--bg-card)' : 'var(--bg-card)',
          border: 'none', cursor: 'pointer', textAlign: 'left', transition: 'background 0.15s',
        }}
        onMouseOver={e => { if (!aberto) e.currentTarget.style.background = 'var(--bg-card-hover)' }}
        onMouseOut={e => { if (!aberto) e.currentTarget.style.background = 'var(--bg-card)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{
            color: aberto ? 'var(--red)' : 'var(--text-muted)',
            fontSize: 10, transition: 'transform 0.2s, color 0.15s',
            transform: aberto ? 'rotate(90deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}>▶</span>
          <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{cliente}</span>
          {!readOnly && <StatusBadge status={status} />}
        </div>
      </button>

      {/* Conteúdo */}
      {aberto && (
        <div style={{ borderTop: '1px solid #1a1a1a' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: '#111', borderBottom: '1px solid #1a1a1a' }}>
            {(['equipe', 'gestores'] as const).map(aba => (
              <button key={aba} onClick={() => setAbaAtiva(aba)} style={{
                flex: 1, padding: '10px 0', fontSize: 12, fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: abaAtiva === aba ? '2px solid var(--red)' : '2px solid transparent',
                color: abaAtiva === aba ? 'var(--red)' : 'var(--text-muted)',
                transition: 'all 0.15s',
                textTransform: 'uppercase', letterSpacing: '0.06em',
              }}>
                {aba === 'equipe' ? 'Equipe preenche' : 'Gestores precisam'}
              </button>
            ))}
          </div>
          {/* Body */}
          <div style={{ padding: 20, background: 'var(--bg-card)' }}>
            {abaAtiva === 'equipe' ? (
              <BlocoEquipe dados={dados.equipe}
                onChange={readOnly ? undefined : equipe => { const n = { ...dados, equipe }; setDados(n); salvar(n) }}
                readOnly={readOnly} />
            ) : (
              <BlocoGestores dados={dados.gestores}
                onChange={readOnly ? undefined : gestores => { const n = { ...dados, gestores }; setDados(n); salvar(n) }}
                readOnly={readOnly} />
            )}
          </div>
        </div>
      )}
    </div>
  )
}
