import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SEVERITY_COLORS = {
    CRITICAL: { bg: '#FEE2E2', text: '#DC2626', border: '#DC2626' },
    HIGH: { bg: '#FEF3C7', text: '#D97706', border: '#D97706' },
    MEDIUM: { bg: '#FEF9E7', text: '#D4A017', border: '#D4A017' },
    LOW: { bg: '#EBFAF5', text: '#06D6A0', border: '#06D6A0' },
}

function getSeverity(score) {
    if (score >= 9) return 'CRITICAL'
    if (score >= 7) return 'HIGH'
    if (score >= 4) return 'MEDIUM'
    return 'LOW'
}

function ScoreBadge({ score }) {
    const severity = getSeverity(score)
    const c = SEVERITY_COLORS[severity]
    return (
        <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md"
                style={{ background: c.bg, color: c.text }}>
                CVSS {score}
            </span>
            <span className="text-[9px] font-mono" style={{ color: c.text }}>{severity}</span>
        </div>
    )
}

export default function VulnManager() {
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [filter, setFilter] = useState('ALL')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [searched, setSearched] = useState(false)

    async function handleSearch() {
        if (!query.trim()) return
        setLoading(true)
        setError(null)
        setSearched(true)

        try {
            const url = query.trim().toUpperCase().startsWith('CVE-')
                ? `https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=${query.trim().toUpperCase()}`
                : `https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=${encodeURIComponent(query.trim())}&resultsPerPage=10`

            const res = await fetch(url)
            const data = await res.json()

            const mapped = (data.vulnerabilities || []).map(v => {
                const cve = v.cve
                const metrics = cve.metrics?.cvssMetricV31?.[0] || cve.metrics?.cvssMetricV30?.[0] || cve.metrics?.cvssMetricV2?.[0]
                const score = metrics?.cvssData?.baseScore || 0
                const vector = metrics?.cvssData?.vectorString || 'N/A'
                const desc = cve.descriptions?.find(d => d.lang === 'en')?.value || 'Sin descripción'
                const published = new Date(cve.published).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
                const cwes = cve.weaknesses?.flatMap(w => w.description.map(d => d.value)).slice(0, 2) || []
                const cpes = cve.configurations?.flatMap(c => c.nodes?.flatMap(n => n.cpeMatch?.map(m => m.criteria?.split(':')[4]) || []) || []).filter(Boolean).slice(0, 2) || []

                return { id: cve.id, score, severity: getSeverity(score), vector, desc, published, cwes, cpes }
            })

            setResults(mapped)
        } catch (e) {
            setError('Error al conectar con la API de NIST. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const filtered = filter === 'ALL' ? results : results.filter(r => r.severity === filter)

    const counts = {
        CRITICAL: results.filter(r => r.severity === 'CRITICAL').length,
        HIGH: results.filter(r => r.severity === 'HIGH').length,
        MEDIUM: results.filter(r => r.severity === 'MEDIUM').length,
        LOW: results.filter(r => r.severity === 'LOW').length,
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate('/')} className="text-sm text-text-muted hover:text-text-primary transition-colors">
                        ← Volver
                    </button>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#D4A017' }}></div>
                        <h1 className="text-lg font-bold text-text-primary">Vuln Manager</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: '#D4A01715', color: '#D4A017', border: '1px solid #D4A01730' }}>
                            NIST
                        </span>
                    </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">nvd.nist.gov</div>
            </div>

            {/* Buscador */}
            <div className="bg-white rounded-xl border border-border p-3 flex gap-2 mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                    placeholder="Buscar por software, CVE-ID o keyword... (ej: apache, CVE-2024-3094)"
                    className="flex-1 text-sm font-mono text-text-primary bg-transparent outline-none placeholder-text-faint"
                />
                <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="text-xs font-semibold text-white px-4 py-2 rounded-lg transition-opacity disabled:opacity-50"
                    style={{ background: '#D4A017' }}
                >
                    {loading ? 'Buscando...' : 'Buscar'}
                </button>
            </div>

            {/* Filtros */}
            {searched && results.length > 0 && (
                <>
                    <div className="flex gap-2 mb-4 flex-wrap">
                        {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className="text-[10px] font-mono px-3 py-1.5 rounded-full border transition-colors"
                                style={filter === f
                                    ? { background: '#D4A01720', color: '#D4A017', borderColor: '#D4A01740' }
                                    : { background: '#fff', color: '#A07850', borderColor: '#E8D5C0' }
                                }
                            >
                                {f === 'ALL' ? 'Todos' : f}
                            </button>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                            { label: 'Critical', count: counts.CRITICAL, color: '#DC2626' },
                            { label: 'High', count: counts.HIGH, color: '#D97706' },
                            { label: 'Medium', count: counts.MEDIUM, color: '#D4A017' },
                            { label: 'Low', count: counts.LOW, color: '#06D6A0' },
                        ].map(s => (
                            <div key={s.label} className="bg-white rounded-xl border border-border p-3 text-center">
                                <div className="text-xl font-extrabold font-mono" style={{ color: s.color }}>{s.count}</div>
                                <div className="text-[10px] text-text-muted mt-1">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Error */}
            {error && (
                <div className="bg-[#FEE2E2] text-[#DC2626] text-sm px-4 py-3 rounded-xl mb-4 border border-[#FECACA]">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="text-center py-16 text-text-muted text-sm font-mono">
                    Consultando nvd.nist.gov...
                </div>
            )}

            {/* Sin resultados */}
            {searched && !loading && results.length === 0 && !error && (
                <div className="text-center py-16 text-text-muted text-sm">
                    No se encontraron vulnerabilidades para <span className="font-mono">"{query}"</span>
                </div>
            )}

            {/* Estado inicial */}
            {!searched && (
                <div className="text-center py-16 text-text-muted text-sm">
                    <div className="text-3xl mb-3">🔍</div>
                    <p>Busca un software, librería o CVE-ID para ver sus vulnerabilidades</p>
                    <p className="text-xs mt-2 font-mono text-text-faint">Ej: apache · log4j · CVE-2021-44228 · nginx</p>
                </div>
            )}

            {/* Resultados */}
            {!loading && filtered.length > 0 && (
                <div className="flex flex-col gap-3">
                    {filtered.map(cve => {
                        const c = SEVERITY_COLORS[cve.severity]
                        return (
                            <div key={cve.id} className="bg-white rounded-xl border border-border p-4"
                                style={{ borderLeft: `3px solid ${c.border}` }}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-mono font-bold text-text-primary">{cve.id}</span>
                                    <ScoreBadge score={cve.score} />
                                </div>
                                <p className="text-xs text-text-secondary leading-relaxed mb-3">{cve.desc}</p>
                                <div className="flex gap-2 flex-wrap">
                                    {cve.cpes.map((c, i) => <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-bg text-text-muted">{c}</span>)}
                                    {cve.cwes.map((c, i) => <span key={i} className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-bg text-text-muted">{c}</span>)}
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-bg text-text-muted">{cve.vector}</span>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-surface-bg text-text-muted">{cve.published}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}