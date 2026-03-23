'use client'

import { use, useEffect, useState } from 'react'
import { slugParaDataFormatada, calcularStatus } from '@/lib/utils'
import { getClientes, getDadosCliente } from '@/lib/storage'

interface Props {
  params: Promise<{ slug: string }>
}

export default function ImprimirPage({ params }: Props) {
  const { slug } = use(params)
  const [clientes, setClientes] = useState<string[]>([])

  useEffect(() => {
    setClientes(getClientes())
  }, [])

  function renderLista(itens: string[]) {
    const preenchidos = itens.filter(i => i.trim() !== '')
    if (preenchidos.length === 0) return <span className="vazio">—</span>
    return (
      <ul>
        {preenchidos.map((item, i) => <li key={i}>{item}</li>)}
      </ul>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'Inter', Arial, sans-serif;
          background: #fff;
          color: #1a1a1a;
          font-size: 11px;
          line-height: 1.5;
        }

        .no-print {
          background: #1a1a1a;
          color: #fff;
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .no-print h2 { font-size: 14px; font-weight: 600; }
        .no-print p { font-size: 12px; color: #888; }

        .btn-print {
          background: #e63030;
          color: #fff;
          border: none;
          padding: 9px 20px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          white-space: nowrap;
        }

        .btn-print:hover { opacity: 0.85; }

        .documento {
          max-width: 820px;
          margin: 0 auto;
          padding: 24px;
        }

        .cabecalho {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 2px solid #e63030;
        }

        .cabecalho h1 {
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
        }

        .cabecalho .meta {
          font-size: 11px;
          color: #888;
          margin-top: 4px;
        }

        .cabecalho .logo {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .cabecalho .logo-square {
          width: 28px; height: 28px;
          background: #e63030;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 800; font-size: 14px;
        }

        .cabecalho .logo-text {
          font-weight: 700; font-size: 15px; color: #1a1a1a;
        }

        .cliente-bloco {
          margin-bottom: 20px;
          border: 1px solid #e8e8e8;
          border-radius: 8px;
          overflow: hidden;
          page-break-inside: avoid;
        }

        .cliente-titulo {
          background: #1a1a1a;
          color: #fff;
          padding: 8px 14px;
          font-size: 12px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .status-badge {
          font-size: 10px;
          padding: 2px 8px;
          border-radius: 20px;
          font-weight: 600;
        }

        .status-completo { background: rgba(230,48,48,0.15); color: #e63030; border: 1px solid rgba(230,48,48,0.3); }
        .status-parcial  { background: rgba(230,48,48,0.07); color: #c07070; border: 1px solid rgba(230,48,48,0.15); }
        .status-vazio    { background: #f5f5f5; color: #999; border: 1px solid #e0e0e0; }

        .cliente-corpo {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0;
        }

        .secao {
          padding: 12px 14px;
          border-right: 1px solid #f0f0f0;
        }

        .secao:last-child { border-right: none; }

        .secao-titulo {
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.07em;
          color: #e63030;
          margin-bottom: 10px;
          padding-bottom: 6px;
          border-bottom: 1px solid #f5f5f5;
        }

        .campo {
          margin-bottom: 10px;
        }

        .campo-label {
          font-size: 9px;
          font-weight: 600;
          color: #888;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin-bottom: 4px;
        }

        .campo-valor {
          font-size: 11px;
          color: #333;
        }

        ul {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        li {
          display: flex;
          align-items: flex-start;
          gap: 6px;
          color: #333;
        }

        li::before {
          content: '';
          width: 4px; height: 4px;
          background: #e63030;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 5px;
        }

        .vazio { color: #bbb; font-style: italic; }

        .metricas-grid {
          display: grid;
          grid-template-columns: 80px 1fr 1fr;
          gap: 4px 8px;
        }

        .metricas-header {
          font-size: 8px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #aaa;
          padding-bottom: 4px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 2px;
        }

        .metrica-label { font-size: 10px; color: #888; }
        .metrica-valor { font-size: 11px; color: #333; }

        .rodape {
          margin-top: 24px;
          padding-top: 12px;
          border-top: 1px solid #e8e8e8;
          display: flex;
          justify-content: space-between;
          font-size: 10px;
          color: #aaa;
        }

        @media print {
          .no-print { display: none !important; }
          body { font-size: 10px; }
          .documento { padding: 12px; max-width: 100%; }
          .cabecalho { margin-bottom: 16px; }
          .cliente-bloco { margin-bottom: 14px; }
        }
      `}</style>

      {/* Barra superior (não imprime) */}
      <div className="no-print">
        <div>
          <h2>Exportar Reunião como PDF</h2>
          <p>Use Ctrl+P (ou ⌘P) e salve como PDF, ou clique no botão →</p>
        </div>
        <button className="btn-print" onClick={() => window.print()}>
          ⬇ Baixar PDF
        </button>
      </div>

      <div className="documento">
        {/* Cabeçalho */}
        <div className="cabecalho">
          <div>
            <h1>Reunião Semanal NGP</h1>
            <p className="meta">Semana de {slugParaDataFormatada(slug)} · {clientes.length} clientes</p>
          </div>
          <div className="logo">
            <div className="logo-square">N</div>
            <span className="logo-text">NGP</span>
          </div>
        </div>

        {/* Clientes */}
        {clientes.map(cliente => {
          const dados = getDadosCliente(slug, cliente)
          const status = calcularStatus(dados)
          const statusClass = `status-${status}`
          const statusLabel = status === 'completo' ? 'Completo' : status === 'parcial' ? 'Parcial' : 'Vazio'

          return (
            <div key={cliente} className="cliente-bloco">
              <div className="cliente-titulo">
                <span>{cliente}</span>
                <span className={`status-badge ${statusClass}`}>{statusLabel}</span>
              </div>
              <div className="cliente-corpo">
                {/* Coluna Equipe */}
                <div className="secao">
                  <p className="secao-titulo">Equipe preenche</p>
                  <div className="campo">
                    <p className="campo-label">O que foi feito nos últimos 7 dias</p>
                    <div className="campo-valor">{renderLista(dados.equipe.feito_7dias)}</div>
                  </div>
                  <div className="campo">
                    <p className="campo-label">O que vai ser feito nos próximos 7 dias</p>
                    <div className="campo-valor">{renderLista(dados.equipe.proximo_7dias)}</div>
                  </div>
                  <div className="campo">
                    <p className="campo-label">O que vai para a reunião com o cliente</p>
                    <div className="campo-valor">{renderLista(dados.equipe.para_reuniao_cliente)}</div>
                  </div>
                </div>

                {/* Coluna Gestores */}
                <div className="secao">
                  <p className="secao-titulo">Gestores precisam</p>
                  <div className="campo">
                    <p className="campo-label">Métricas</p>
                    <div className="metricas-grid">
                      <span className="metricas-header">Métrica</span>
                      <span className="metricas-header">Meta (M)</span>
                      <span className="metricas-header">Google (G)</span>
                      {[
                        ['Investimento', dados.gestores.investimento_meta, dados.gestores.investimento_google],
                        ['Leads/Vendas', dados.gestores.leads_meta, dados.gestores.leads_google],
                        ['CPL/CPA', dados.gestores.cpl_meta, dados.gestores.cpl_google],
                        ['ROAS/ROI', dados.gestores.roas, ''],
                      ].map(([label, m, g]) => (
                        (m || g) ? (
                          <>
                            <span key={`l-${label}`} className="metrica-label">{label}</span>
                            <span key={`m-${label}`} className="metrica-valor">{m || '—'}</span>
                            <span key={`g-${label}`} className="metrica-valor">{g || '—'}</span>
                          </>
                        ) : null
                      ))}
                    </div>
                  </div>
                  <div className="campo">
                    <p className="campo-label">Testado / Ajustado</p>
                    <div className="campo-valor">{renderLista(dados.gestores.testado_ajustado)}</div>
                  </div>
                  <div className="campo">
                    <p className="campo-label">Diagnóstico</p>
                    <div className="campo-valor">{dados.gestores.diagnostico || <span className="vazio">—</span>}</div>
                  </div>
                  <div className="campo">
                    <p className="campo-label">Próxima alavanca</p>
                    <div className="campo-valor">{renderLista(dados.gestores.proxima_alavanca)}</div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        <div className="rodape">
          <span>NGP — Reunião Semanal · {slugParaDataFormatada(slug)}</span>
          <span>Exportado em {new Date().toLocaleDateString('pt-BR')}</span>
        </div>
      </div>
    </>
  )
}
