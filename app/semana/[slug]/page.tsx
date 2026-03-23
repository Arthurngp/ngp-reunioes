'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { slugParaDataFormatada, getSlugSemanaAtual, calcularStatus } from '@/lib/utils'
import { getClientes, getDadosCliente, criarSemana } from '@/lib/storage'
import ClienteCard from '@/components/ClienteCard'
import ClienteManager from '@/components/ClienteManager'

interface Props {
  params: Promise<{ slug: string }>
}

type Filtro = 'todos' | 'vazio' | 'parcial' | 'completo'

export default function SemanaPage({ params }: Props) {
  const { slug } = use(params)
  const isAtual = slug === getSlugSemanaAtual()
  const readOnly = !isAtual

  const [clientes, setClientes] = useState<string[]>([])
  const [showManager, setShowManager] = useState(false)
  const [filtro, setFiltro] = useState<Filtro>('todos')

  useEffect(() => {
    criarSemana(slug)
    setClientes(getClientes())
  }, [slug])

  const total = clientes.length
  const completos = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'completo').length
  const parciais = clientes.filter(c => calcularStatus(getDadosCliente(slug, c)) === 'parcial').length
  const progresso = total > 0 ? Math.round(((completos + parciais * 0.5) / total) * 100) : 0

  const clientesFiltrados = clientes.filter(c => {
    if (filtro === 'todos') return true
    return calcularStatus(getDadosCliente(slug, c)) === filtro
  })

  const filtros: { key: Filtro; label: string }[] = [
    { key: 'todos', label: `Todos (${total})` },
    { key: 'vazio', label: 'Vazio' },
    { key: 'parcial', label: 'Parcial' },
    { key: 'completo', label: 'Completo' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <Link href="/" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
                onMouseOver={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
                ← Dashboard
              </Link>
              {readOnly && (
                <span style={{
                  fontSize: 11, background: '#1e1e1e', color: 'var(--text-muted)',
                  padding: '2px 8px', borderRadius: 20, border: '1px solid var(--border)',
                }}>Somente leitura</span>
              )}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
              Reunião — {slugParaDataFormatada(slug)}
            </h1>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              {completos} completos · {parciais} parciais · {total - completos - parciais} vazios
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href={`/semana/${slug}/imprimir`} target="_blank" style={{
              background: 'transparent', border: '1px solid var(--border)',
              color: 'var(--text-secondary)', fontSize: 12, padding: '8px 14px',
              borderRadius: 10, textDecoration: 'none', transition: 'all 0.15s',
              display: 'inline-block',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              ⬇ Exportar PDF
            </Link>
            {!readOnly && (
              <button onClick={() => setShowManager(true)} style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 12, padding: '8px 14px',
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                Gerenciar clientes
              </button>
            )}
          </div>
        </div>

        {/* Barra de progresso */}
        <div style={{ marginTop: 14, height: 2, background: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: 'var(--red)', borderRadius: 2,
            width: `${progresso}%`, transition: 'width 0.5s ease',
            boxShadow: progresso > 0 ? '0 0 8px var(--red-glow)' : 'none',
          }} />
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {filtros.map(({ key, label }) => (
          <button key={key} onClick={() => setFiltro(key)} style={{
            fontSize: 12, padding: '6px 14px', borderRadius: 20,
            border: `1px solid ${filtro === key ? 'var(--red)' : 'var(--border)'}`,
            background: filtro === key ? 'var(--red-dim)' : 'transparent',
            color: filtro === key ? 'var(--red)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s', fontWeight: filtro === key ? 600 : 400,
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Lista de clientes */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {clientesFiltrados.map(cliente => (
          <div key={cliente} id={encodeURIComponent(cliente)}>
            <ClienteCard slug={slug} cliente={cliente} readOnly={readOnly} />
          </div>
        ))}
        {clientesFiltrados.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            Nenhum cliente com esse filtro.
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Link href="/historico" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 0.15s' }}
          onMouseOver={e => (e.currentTarget.style.color = 'var(--red)')}
          onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
          Ver histórico completo →
        </Link>
        {isAtual && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 6px var(--red)', display: 'inline-block' }} />
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Auto-save ativo</span>
          </div>
        )}
      </div>

      {showManager && <ClienteManager onClose={() => setShowManager(false)} onUpdate={() => setClientes(getClientes())} />}
    </div>
  )
}
