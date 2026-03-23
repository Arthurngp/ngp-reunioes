'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { slugParaDataFormatada, calcularStatus } from '@/lib/utils'
import { getSemanas, getClientes, getDadosCliente } from '@/lib/storage'

export default function HistoricoPage() {
  const [semanas, setSemanas] = useState<string[]>([])
  const [clientes, setClientes] = useState<string[]>([])

  useEffect(() => {
    setSemanas(getSemanas())
    setClientes(getClientes())
  }, [])

  if (semanas.length === 0) {
    return (
      <div style={{ textAlign: 'center', paddingTop: 80 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhuma semana registrada ainda.</p>
        <Link href="/" style={{ color: 'var(--red)', fontSize: 13, marginTop: 8, display: 'inline-block', textDecoration: 'none' }}>
          Voltar ao dashboard →
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Link href="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          ← Dashboard
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: '6px 0 2px' }}>
          Histórico de Reuniões
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{semanas.length} semanas registradas</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {semanas.map(slug => {
          const completos = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'completo').length
          const parciais = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'parcial').length
          const total = clientes.length
          const progresso = total > 0 ? Math.round(((completos + parciais * 0.5) / total) * 100) : 0

          return (
            <Link key={slug} href={`/semana/${slug}`} style={{
              display: 'block', background: 'var(--bg-card)',
              border: '1px solid var(--border)', borderRadius: 12,
              padding: '16px 20px', textDecoration: 'none', transition: 'all 0.15s',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#2a2a2a'; e.currentTarget.style.background = 'var(--bg-card-hover)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)', margin: 0 }}>
                    Semana de {slugParaDataFormatada(slug)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                    {completos} completos · {parciais} parciais · {total - completos - parciais} vazios
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Mini progress */}
                  <div style={{ width: 80, height: 2, background: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', background: 'var(--red)', borderRadius: 2,
                      width: `${progresso}%`,
                      boxShadow: progresso > 0 ? '0 0 6px var(--red-glow)' : 'none',
                    }} />
                  </div>
                  <span style={{ fontSize: 12, color: 'var(--red)' }}>Ver →</span>
                </div>
              </div>

              {/* Pontos de status dos clientes */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 12 }}>
                {clientes.map(cliente => {
                  const status = calcularStatus(getDadosCliente(slug, cliente))
                  return (
                    <span key={cliente} title={`${cliente}: ${status}`} style={{
                      width: 8, height: 8, borderRadius: '50%', display: 'inline-block',
                      background: status === 'completo' ? 'var(--red)' : status === 'parcial' ? 'rgba(230,48,48,0.35)' : '#2a2a2a',
                      boxShadow: status === 'completo' ? '0 0 4px var(--red-glow)' : 'none',
                    }} />
                  )
                })}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
