'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getSlugSemanaAtual, slugParaDataFormatada, calcularStatus } from '@/lib/utils'
import { getClientes, getDadosCliente, criarSemana, getSemanas } from '@/lib/storage'
import StatusBadge from '@/components/StatusBadge'
import ClienteManager from '@/components/ClienteManager'

export default function Dashboard() {
  const slug = getSlugSemanaAtual()
  const [clientes, setClientes] = useState<string[]>([])
  const [showManager, setShowManager] = useState(false)
  const [tick, setTick] = useState(0)
  void tick

  useEffect(() => {
    setClientes(getClientes())
    criarSemana(slug)
  }, [slug])

  function handleUpdate() {
    setClientes(getClientes())
    setTick(n => n + 1)
  }

  const semanas = getSemanas()
  const total = clientes.length
  const completos = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'completo').length
  const parciais = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'parcial').length
  const progresso = total > 0 ? Math.round(((completos + parciais * 0.5) / total) * 100) : 0

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
              Semana de {slugParaDataFormatada(slug)}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              {completos} completos · {parciais} parciais · {total - completos - parciais} vazios
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setShowManager(true)}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 13, padding: '8px 14px',
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = 'var(--text-primary)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              Gerenciar clientes
            </button>
            <Link href={`/semana/${slug}`} style={{
              background: 'var(--red)', color: '#fff', fontSize: 13, fontWeight: 600,
              padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 0 20px var(--red-glow)',
              transition: 'box-shadow 0.15s',
            }}>
              Abrir reunião →
            </Link>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 16, height: 3, background: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--red)', borderRadius: 2,
            width: `${progresso}%`, transition: 'width 0.5s ease',
            boxShadow: '0 0 8px var(--red-glow)',
          }} />
        </div>
      </div>

      {/* Grid clientes */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
        gap: 10, marginBottom: 32,
      }}>
        {clientes.map(cliente => {
          const status = calcularStatus(getDadosCliente(slug, cliente))
          return (
            <Link key={cliente} href={`/semana/${slug}#${encodeURIComponent(cliente)}`} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px 14px', textDecoration: 'none',
              transition: 'all 0.15s', display: 'block',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = status === 'completo' ? '#e63030' : '#333'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
            >
              <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cliente}
              </div>
              <StatusBadge status={status} />
            </Link>
          )
        })}
      </div>

      {/* Semanas anteriores */}
      {semanas.filter(s => s !== slug).length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
            Semanas anteriores
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {semanas.filter(s => s !== slug).slice(0, 5).map(s => (
              <Link key={s} href={`/semana/${s}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '12px 16px', textDecoration: 'none',
                transition: 'all 0.15s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#333' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Semana de {slugParaDataFormatada(s)}</span>
                <span style={{ color: 'var(--red)', fontSize: 12 }}>Ver →</span>
              </Link>
            ))}
            {semanas.length > 6 && (
              <Link href="/historico" style={{ textAlign: 'center', color: 'var(--red)', fontSize: 13, padding: '8px', textDecoration: 'none' }}>
                Ver todo o histórico →
              </Link>
            )}
          </div>
        </div>
      )}

      {showManager && <ClienteManager onClose={() => setShowManager(false)} onUpdate={handleUpdate} />}
    </div>
  )
}
