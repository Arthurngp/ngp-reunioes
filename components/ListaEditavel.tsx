'use client'

interface Props {
  itens: string[]
  onChange: (itens: string[]) => void
  placeholder?: string
  readOnly?: boolean
}

const inputStyle = {
  flex: 1, fontSize: 13,
  background: 'var(--bg-input)', border: '1px solid var(--border)',
  borderRadius: 8, padding: '7px 10px', color: 'var(--text-primary)',
  outline: 'none', transition: 'border-color 0.15s',
}

export default function ListaEditavel({ itens, onChange, placeholder = 'Digite aqui...', readOnly = false }: Props) {
  const lista = itens.length > 0 ? itens : ['']

  function atualizar(index: number, valor: string) {
    const nova = [...lista]; nova[index] = valor; onChange(nova)
  }
  function adicionar() { onChange([...lista, '']) }
  function remover(index: number) {
    const nova = lista.filter((_, i) => i !== index)
    onChange(nova.length > 0 ? nova : [''])
  }

  if (readOnly) {
    const preenchidos = lista.filter(i => i.trim() !== '')
    if (preenchidos.length === 0) return <p style={{ fontSize: 13, color: 'var(--text-muted)', fontStyle: 'italic' }}>—</p>
    return (
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {preenchidos.map((item, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
            <span style={{ marginTop: 6, width: 4, height: 4, borderRadius: '50%', background: 'var(--red)', flexShrink: 0 }} />
            {item}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {lista.map((item, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)', flexShrink: 0 }} />
          <input
            type="text"
            value={item}
            onChange={e => atualizar(index, e.target.value)}
            placeholder={placeholder}
            style={inputStyle}
            onFocus={e => (e.target.style.borderColor = 'var(--border-focus)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
          {lista.length > 1 && (
            <button onClick={() => remover(index)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: 18, lineHeight: 1, padding: '0 2px',
              transition: 'color 0.15s', flexShrink: 0,
            }}
              onMouseOver={e => (e.currentTarget.style.color = 'var(--red)')}
              onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
            >×</button>
          )}
        </div>
      ))}
      <button onClick={adicionar} style={{
        background: 'none', border: 'none', cursor: 'pointer',
        color: 'var(--text-muted)', fontSize: 12, textAlign: 'left',
        padding: '2px 0', transition: 'color 0.15s', marginLeft: 12,
      }}
        onMouseOver={e => (e.currentTarget.style.color = 'var(--red)')}
        onMouseOut={e => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        + Adicionar item
      </button>
    </div>
  )
}
