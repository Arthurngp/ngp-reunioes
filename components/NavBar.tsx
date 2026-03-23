'use client'

import Link from 'next/link'

export default function NavBar() {
  return (
    <nav style={{
      background: 'rgba(13,13,13,0.9)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid #1e1e1e',
      position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '0 20px',
        height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" className="nav-brand">
          <span style={{
            width: 28, height: 28, borderRadius: 8, background: 'var(--red)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0,
          }}>N</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: 15, letterSpacing: '-0.02em' }}>NGP</span>
          <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>reunião semanal</span>
        </Link>
        <div style={{ display: 'flex', gap: 4 }}>
          <Link href="/" className="nav-link">Dashboard</Link>
          <Link href="/historico" className="nav-link">Histórico</Link>
        </div>
      </div>
    </nav>
  )
}
