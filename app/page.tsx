'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getSlugSemanaAtual, slugParaDataFormatada, calcularStatus, formatarSlug } from '@/lib/utils'
import { getClientes, getDadosCliente, criarSemana, getSemanas } from '@/lib/storage'
import StatusBadge from '@/components/StatusBadge'
import ClienteManager from '@/components/ClienteManager'

export default function Dashboard() {
  const router = useRouter()
  const slugAtual = getSlugSemanaAtual()
  const [clientes, setClientes] = useState<string[]>([])
  const [semanas, setSemanas] = useState<string[]>([])
  const [showManager, setShowManager] = useState(false)
  const [showNovoRelatorio, setShowNovoRelatorio] = useState(false)
  const [dataNovoRelatorio, setDataNovoRelatorio] = useState(slugAtual)
  const [tick, setTick] = useState(0)
  void tick

  useEffect(() => {
    setClientes(getClientes())
    setSemanas(getSemanas())
    criarSemana(slugAtual)
  }, [slugAtual])

  function handleUpdate() {
    setClientes(getClientes())
    setSemanas(getSemanas())
    setTick(n => n + 1)
  }

  function criarNovoRelatorio() {
    const slug = dataNovoRelatorio
    criarSemana(slug)
    setShowNovoRelatorio(false)
    router.push(`/semana/${slug}`)
  }

  const total = clientes.length
  const completos = clientes.filter(c => calcularStatus(getDadosCliente(slugAtual, c)) === 'completo').length
  const parciais = clientes.filter(c => calcularStatus(getDadosCliente(slugAtual, c)) === 'parcial').length
  const progresso = total > 0 ? Math.round(((completos + parciais * 0.5) / total) * 100) : 0

  const semanasAnteriores = semanas.filter(s => s !== slugAtual)

  return (
    <div>
      {/* Header — semana atual */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
              Semana atual
            </p>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.03em', margin: 0 }}>
              {slugParaDataFormatada(slugAtual)}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
              {completos} completos · {parciais} parciais · {total - completos - parciais} vazios
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowNovoRelatorio(true)}
              style={{
                background: 'transparent', border: '1px solid var(--border)',
                color: 'var(--text-secondary)', fontSize: 13, padding: '8px 14px',
                borderRadius: 10, cursor: 'pointer', transition: 'all 0.15s',
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              + Novo relatório
            </button>
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
            <Link href={`/semana/${slugAtual}`} style={{
              background: 'var(--red)', color: '#fff', fontSize: 13, fontWeight: 600,
              padding: '8px 18px', borderRadius: 10, textDecoration: 'none',
              boxShadow: '0 0 20px var(--red-glow)', transition: 'box-shadow 0.15s',
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

      {/* Dots de status da semana atual */}
      {clientes.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 28 }}>
          {clientes.map(cliente => {
            const status = calcularStatus(getDadosCliente(slugAtual, cliente))
            return (
              <Link
                key={cliente}
                href={`/semana/${slugAtual}#${encodeURIComponent(cliente)}`}
                title={`${cliente}: ${status}`}
                style={{
                  width: 10, height: 10, borderRadius: '50%', display: 'inline-block',
                  background: status === 'completo' ? 'var(--red)' : status === 'parcial' ? 'rgba(230,48,48,0.35)' : '#2a2a2a',
                  boxShadow: status === 'completo' ? '0 0 5px var(--red-glow)' : 'none',
                  transition: 'transform 0.1s',
                }}
                onMouseOver={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1.4)' }}
                onMouseOut={e => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
              />
            )
          })}
        </div>
      )}

      {/* Histórico de reuniões */}
      {semanasAnteriores.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
            Reuniões anteriores
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {semanasAnteriores.map(slug => {
              const c = clientes.filter(cli => calcularStatus(getDadosCliente(slug, cli)) === 'completo').length
              const p = clientes.filter(cli => calcularStatus(getDadosCliente(slug, cli)) === 'parcial').length
              const prog = total > 0 ? Math.round(((c + p * 0.5) / total) * 100) : 0
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
                        {c} completos · {p} parciais · {total - c - p} vazios
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 80, height: 2, background: '#1e1e1e', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{
                          height: '100%', background: 'var(--red)', borderRadius: 2,
                          width: `${prog}%`,
                          boxShadow: prog > 0 ? '0 0 6px var(--red-glow)' : 'none',
                        }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'var(--red)' }}>Ver →</span>
                    </div>
                  </div>
                  {/* Dots dos clientes */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 10 }}>
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
      )}

      {semanasAnteriores.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)', fontSize: 13 }}>
          Nenhuma reunião anterior registrada.
        </div>
      )}

      {/* Modal: Novo relatório */}
      {showNovoRelatorio && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50, padding: 16,
        }}>
          <div style={{
            background: '#111', border: '1px solid #2a2a2a',
            borderRadius: 16, width: '100%', maxWidth: 380,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{ padding: '20px 20px 0', borderBottom: '1px solid #1e1e1e', paddingBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Criar novo relatório
                  </h2>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>
                    Escolha a data de início da semana
                  </p>
                </div>
                <button onClick={() => setShowNovoRelatorio(false)} style={{
                  background: '#1e1e1e', border: 'none', cursor: 'pointer',
                  color: 'var(--text-muted)', width: 28, height: 28, borderRadius: 8,
                  fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                  onMouseOver={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseOut={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = 'var(--text-muted)' }}
                >×</button>
              </div>
            </div>

            <div style={{ padding: 20 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 8 }}>
                Data da semana
              </label>
              <input
                type="date"
                value={dataNovoRelatorio}
                onChange={e => setDataNovoRelatorio(e.target.value)}
                style={{
                  width: '100%', fontSize: 14, fontWeight: 600,
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '10px 12px', color: 'var(--text-primary)',
                  outline: 'none', colorScheme: 'dark',
                }}
                onFocus={e => (e.target.style.borderColor = 'var(--red)')}
                onBlur={e => (e.target.style.borderColor = 'var(--border)')}
              />

              {dataNovoRelatorio && (
                <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  Será criado: <span style={{ color: 'var(--text-secondary)' }}>
                    Semana de {slugParaDataFormatada(dataNovoRelatorio)}
                  </span>
                  {semanas.includes(dataNovoRelatorio) && (
                    <span style={{ color: 'var(--red)', marginLeft: 6 }}>· já existe</span>
                  )}
                </p>
              )}

              <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                <button onClick={() => setShowNovoRelatorio(false)} style={{
                  flex: 1, background: 'none', border: '1px solid var(--border)',
                  borderRadius: 8, padding: '9px', fontSize: 13, color: 'var(--text-muted)',
                  cursor: 'pointer', transition: 'all 0.15s',
                }}>
                  Cancelar
                </button>
                <button onClick={criarNovoRelatorio} disabled={!dataNovoRelatorio} style={{
                  flex: 2, background: 'var(--red)', border: 'none',
                  borderRadius: 8, padding: '9px', fontSize: 13, fontWeight: 600,
                  color: '#fff', cursor: 'pointer', transition: 'opacity 0.15s',
                  opacity: dataNovoRelatorio ? 1 : 0.4,
                }}
                  onMouseOver={e => { if (dataNovoRelatorio) e.currentTarget.style.opacity = '0.85' }}
                  onMouseOut={e => { e.currentTarget.style.opacity = '1' }}
                >
                  {semanas.includes(dataNovoRelatorio) ? 'Abrir relatório' : 'Criar e abrir →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showManager && <ClienteManager onClose={() => setShowManager(false)} onUpdate={handleUpdate} />}
    </div>
  )
}
