'use client'

import { useState } from 'react'
import { getClientes, setClientes } from '@/lib/storage'

interface Props {
  onClose: () => void
  onUpdate: () => void
}

export default function ClienteManager({ onClose, onUpdate }: Props) {
  const [clientes, setClientesState] = useState<string[]>(() => getClientes())
  const [novoCliente, setNovoCliente] = useState('')

  function adicionar() {
    const nome = novoCliente.trim()
    if (!nome || clientes.includes(nome)) return
    const novo = [...clientes, nome]
    setClientesState(novo)
    setClientes(novo)
    setNovoCliente('')
    onUpdate()
  }

  function remover(cliente: string) {
    const novo = clientes.filter(c => c !== cliente)
    setClientesState(novo)
    setClientes(novo)
    onUpdate()
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 50, padding: 16,
    }}>
      <div style={{
        background: '#111', border: '1px solid #2a2a2a',
        borderRadius: 16, width: '100%', maxWidth: 420,
        boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px', borderBottom: '1px solid #1e1e1e',
        }}>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Gerenciar Clientes</h2>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{clientes.length} clientes cadastrados</p>
          </div>
          <button onClick={onClose} style={{
            background: '#1e1e1e', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', width: 28, height: 28, borderRadius: 8,
            fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.15s',
          }}
            onMouseOver={e => { e.currentTarget.style.background = '#2a2a2a'; e.currentTarget.style.color = 'var(--text-primary)' }}
            onMouseOut={e => { e.currentTarget.style.background = '#1e1e1e'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >×</button>
        </div>

        {/* Input */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e1e1e' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={novoCliente}
              onChange={e => setNovoCliente(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && adicionar()}
              placeholder="Nome do novo cliente..."
              style={{
                flex: 1, fontSize: 13, background: 'var(--bg-input)',
                border: '1px solid var(--border)', borderRadius: 8,
                padding: '8px 12px', color: 'var(--text-primary)', outline: 'none',
                transition: 'border-color 0.15s',
              }}
              onFocus={e => (e.target.style.borderColor = 'var(--red)')}
              onBlur={e => (e.target.style.borderColor = 'var(--border)')}
            />
            <button onClick={adicionar} style={{
              background: 'var(--red)', border: 'none', cursor: 'pointer',
              color: '#fff', fontSize: 13, fontWeight: 600,
              padding: '8px 16px', borderRadius: 8,
              transition: 'opacity 0.15s',
            }}
              onMouseOver={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseOut={e => (e.currentTarget.style.opacity = '1')}
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Lista */}
        <ul style={{ listStyle: 'none', padding: '8px 12px', margin: 0, maxHeight: 280, overflowY: 'auto' }}>
          {clientes.map(cliente => (
            <li key={cliente} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px', borderRadius: 8, transition: 'background 0.1s',
            }}
              onMouseOver={e => (e.currentTarget.style.background = '#1a1a1a')}
              onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
            >
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{cliente}</span>
              <button onClick={() => remover(cliente)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 12, color: 'var(--text-muted)', padding: '2px 6px',
                borderRadius: 4, transition: 'all 0.15s',
              }}
                onMouseOver={e => { e.currentTarget.style.color = 'var(--red)'; e.currentTarget.style.background = 'rgba(230,48,48,0.08)' }}
                onMouseOut={e => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'none' }}
              >
                remover
              </button>
            </li>
          ))}
        </ul>

        <div style={{ padding: '12px 20px' }}>
          <button onClick={onClose} style={{
            width: '100%', background: 'none', border: '1px solid var(--border)',
            borderRadius: 8, padding: '9px', fontSize: 13, color: 'var(--text-muted)',
            cursor: 'pointer', transition: 'all 0.15s',
          }}
            onMouseOver={e => { e.currentTarget.style.borderColor = '#3a3a3a'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  )
}
