import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const CONTROLS = [
    {
        section: 'A.5 — Políticas de seguridad',
        items: [
            { id: 'A.5.1', label: 'Políticas de seguridad de la información', status: 'done' },
            { id: 'A.5.2', label: 'Revisión de las políticas de seguridad', status: 'progress' },
        ]
    },
    {
        section: 'A.6 — Organización de la seguridad',
        items: [
            { id: 'A.6.1', label: 'Roles y responsabilidades de seguridad', status: 'done' },
            { id: 'A.6.2', label: 'Segregación de funciones', status: 'done' },
            { id: 'A.6.3', label: 'Contacto con autoridades', status: 'pending' },
        ]
    },
    {
        section: 'A.8 — Gestión de activos',
        items: [
            { id: 'A.8.1', label: 'Inventario de activos de información', status: 'done' },
            { id: 'A.8.2', label: 'Clasificación de la información', status: 'fail' },
            { id: 'A.8.3', label: 'Manejo de los soportes de almacenamiento', status: 'progress' },
        ]
    },
    {
        section: 'A.9 — Control de acceso',
        items: [
            { id: 'A.9.1', label: 'Política de control de acceso', status: 'done' },
            { id: 'A.9.2', label: 'Gestión de acceso de usuarios', status: 'done' },
            { id: 'A.9.3', label: 'Responsabilidades del usuario', status: 'progress' },
            { id: 'A.9.4', label: 'Control de acceso a sistemas y aplicaciones', status: 'pending' },
        ]
    },
    {
        section: 'A.12 — Seguridad en las operaciones',
        items: [
            { id: 'A.12.1', label: 'Procedimientos operacionales y responsabilidades', status: 'done' },
            { id: 'A.12.2', label: 'Protección contra el malware', status: 'done' },
            { id: 'A.12.3', label: 'Copias de seguridad', status: 'done' },
            { id: 'A.12.4', label: 'Registro y supervisión', status: 'progress' },
        ]
    },
    {
        section: 'A.16 — Gestión de incidentes',
        items: [
            { id: 'A.16.1', label: 'Gestión de incidentes de seguridad', status: 'done' },
            { id: 'A.16.2', label: 'Notificación de eventos de seguridad', status: 'pending' },
        ]
    },
]

const RISKS = [
    { id: 'R-01', name: 'Acceso no autorizado a sistemas críticos', prob: 3, impact: 4, owner: 'IT Security', treatment: 'Mitigar' },
    { id: 'R-02', name: 'Pérdida de datos por ransomware', prob: 2, impact: 5, owner: 'CISO', treatment: 'Mitigar' },
    { id: 'R-03', name: 'Fallo del proveedor cloud principal', prob: 2, impact: 4, owner: 'IT Ops', treatment: 'Transferir' },
    { id: 'R-04', name: 'Phishing a empleados', prob: 4, impact: 3, owner: 'IT Security', treatment: 'Mitigar' },
    { id: 'R-05', name: 'Exposición de datos personales', prob: 2, impact: 5, owner: 'DPO', treatment: 'Mitigar' },
    { id: 'R-06', name: 'Acceso físico no autorizado al CPD', prob: 1, impact: 4, owner: 'Facilities', treatment: 'Aceptar' },
]

const STATUS_CONFIG = {
    done: { label: 'Implementado', bg: '#06D6A020', text: '#06D6A0', icon: '✓', checkBg: '#06D6A020' },
    progress: { label: 'En progreso', bg: '#FEF3C7', text: '#D97706', icon: '~', checkBg: '#FEF3C7' },
    fail: { label: 'No conforme', bg: '#FEE2E2', text: '#DC2626', icon: '✕', checkBg: '#FEE2E2' },
    pending: { label: 'Pendiente', bg: '#F5ECD8', text: '#A07850', icon: '·', checkBg: '#F5ECD8' },
}

const RISK_LEVEL = (p, i) => {
    const score = p * i
    if (score >= 15) return { label: 'C', bg: '#FEE2E2', text: '#DC2626' }
    if (score >= 9) return { label: 'A', bg: '#FEF3C7', text: '#D97706' }
    if (score >= 4) return { label: 'M', bg: '#FEF9E7', text: '#D4A017' }
    return { label: 'B', bg: '#EBFAF5', text: '#06D6A0' }
}

const MATRIX_ROWS = [5, 4, 3, 2, 1]
const MATRIX_COLS = [1, 2, 3, 4, 5]
const ROW_LABELS = { 5: 'Muy alto', 4: 'Alto', 3: 'Medio', 2: 'Bajo', 1: 'Muy bajo' }
const COL_LABELS = { 1: 'Muy bajo', 2: 'Bajo', 3: 'Medio', 4: 'Alto', 5: 'Muy alto' }

export default function GrcManager() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('iso')
    const [controls, setControls] = useState(CONTROLS)

    function cycleStatus(sectionIdx, itemIdx) {
        const order = ['pending', 'progress', 'done', 'fail']
        setControls(prev => prev.map((section, si) =>
            si !== sectionIdx ? section : {
                ...section,
                items: section.items.map((item, ii) => {
                    if (ii !== itemIdx) return item
                    const next = order[(order.indexOf(item.status) + 1) % order.length]
                    return { ...item, status: next }
                })
            }
        ))
    }

    const allItems = controls.flatMap(s => s.items)
    const counts = {
        done: allItems.filter(i => i.status === 'done').length,
        progress: allItems.filter(i => i.status === 'progress').length,
        fail: allItems.filter(i => i.status === 'fail').length,
        pending: allItems.filter(i => i.status === 'pending').length,
    }
    const pct = Math.round((counts.done / allItems.length) * 100)

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
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#06D6A0' }}></div>
                        <h1 className="text-lg font-bold text-text-primary">GRC Manager</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: '#06D6A015', color: '#06D6A0', border: '1px solid #06D6A030' }}>
                            GRC
                        </span>
                    </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">ISO 27001:2022</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-white border border-border rounded-xl p-1">
                {[
                    { id: 'iso', label: 'ISO 27001' },
                    { id: 'matrix', label: 'Matriz de riesgos' },
                    { id: 'audit', label: 'Auditoría' },
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id)}
                        className="flex-1 text-xs font-semibold py-2 rounded-lg transition-colors"
                        style={activeTab === t.id
                            ? { background: '#06D6A020', color: '#06D6A0' }
                            : { color: '#A07850' }
                        }
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* TAB ISO 27001 */}
            {activeTab === 'iso' && (
                <div>
                    {/* Progreso */}
                    <div className="bg-white rounded-xl border border-border p-4 mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-bold text-text-primary">Cumplimiento general</span>
                            <span className="text-xl font-extrabold font-mono" style={{ color: '#06D6A0' }}>{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-surface-bg rounded-full overflow-hidden mb-3">
                            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: '#06D6A0' }}></div>
                        </div>
                        <div className="flex gap-6">
                            {[
                                { label: 'Implementados', count: counts.done, color: '#06D6A0' },
                                { label: 'En progreso', count: counts.progress, color: '#D97706' },
                                { label: 'No conformes', count: counts.fail, color: '#DC2626' },
                                { label: 'Pendientes', count: counts.pending, color: '#C4A882' },
                            ].map(s => (
                                <div key={s.label} className="text-center">
                                    <div className="text-base font-extrabold font-mono" style={{ color: s.color }}>{s.count}</div>
                                    <div className="text-[10px] text-text-muted">{s.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="flex flex-col gap-4">
                        {controls.map((section, si) => (
                            <div key={section.section}>
                                <p className="text-xs font-bold text-text-primary mb-2">{section.section}</p>
                                <div className="flex flex-col gap-1.5">
                                    {section.items.map((item, ii) => {
                                        const s = STATUS_CONFIG[item.status]
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 bg-white rounded-lg px-3 py-2.5 border border-border cursor-pointer hover:border-text-muted transition-colors"
                                                onClick={() => cycleStatus(si, ii)}
                                            >
                                                <div className="w-5 h-5 rounded flex items-center justify-center text-xs flex-shrink-0"
                                                    style={{ background: s.checkBg, color: s.text }}>
                                                    {s.icon}
                                                </div>
                                                <span className="text-xs font-mono text-text-muted flex-shrink-0">{item.id}</span>
                                                <span className="flex-1 text-xs text-text-primary">{item.label}</span>
                                                <span className="text-[9px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                                                    style={{ background: s.bg, color: s.text }}>
                                                    {s.label}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB MATRIZ */}
            {activeTab === 'matrix' && (
                <div className="flex flex-col gap-4">
                    {/* Matriz visual */}
                    <div className="bg-white rounded-xl border border-border p-4">
                        <p className="text-sm font-bold text-text-primary mb-4">Probabilidad × Impacto</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '70px repeat(5, 1fr)', gap: '4px' }}>
                            <div></div>
                            {MATRIX_COLS.map(c => (
                                <div key={c} className="text-[9px] font-mono text-text-muted text-center pb-1">{COL_LABELS[c]}</div>
                            ))}
                            {MATRIX_ROWS.map(row => (
                                <>
                                    <div key={`label-${row}`} className="text-[9px] font-mono text-text-muted flex items-center justify-end pr-2">{ROW_LABELS[row]}</div>
                                    {MATRIX_COLS.map(col => {
                                        const level = RISK_LEVEL(row, col)
                                        const risksHere = RISKS.filter(r => r.prob === row && r.impact === col)
                                        return (
                                            <div key={`${row}-${col}`}
                                                className="h-10 rounded flex items-center justify-center text-xs font-mono font-bold relative"
                                                style={{ background: level.bg, color: level.text }}>
                                                {level.label}
                                                {risksHere.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-text-primary text-white flex items-center justify-center text-[8px] font-bold">
                                                        {risksHere.length}
                                                    </span>
                                                )}
                                            </div>
                                        )
                                    })}
                                </>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-3">
                            {[
                                { label: 'Crítico', bg: '#FEE2E2', text: '#DC2626' },
                                { label: 'Alto', bg: '#FEF3C7', text: '#D97706' },
                                { label: 'Medio', bg: '#FEF9E7', text: '#D4A017' },
                                { label: 'Bajo', bg: '#EBFAF5', text: '#06D6A0' },
                            ].map(l => (
                                <div key={l.label} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded" style={{ background: l.bg, border: `1px solid ${l.text}30` }}></div>
                                    <span className="text-[10px] text-text-muted">{l.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Lista de riesgos */}
                    <div className="bg-white rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="text-sm font-bold text-text-primary">Registro de riesgos</span>
                            <span className="text-[10px] font-mono text-text-muted bg-surface-bg px-2 py-0.5 rounded-full">{RISKS.length} riesgos</span>
                        </div>
                        {RISKS.map(r => {
                            const level = RISK_LEVEL(r.prob, r.impact)
                            return (
                                <div key={r.id} className="flex items-center gap-3 px-4 py-3 border-b border-surface-bg last:border-0">
                                    <span className="text-[9px] font-mono text-text-muted w-10 flex-shrink-0">{r.id}</span>
                                    <span className="flex-1 text-xs text-text-primary">{r.name}</span>
                                    <span className="text-[9px] font-mono text-text-muted flex-shrink-0">{r.owner}</span>
                                    <span className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0"
                                        style={{ background: level.bg, color: level.text }}>{level.label}</span>
                                    <span className="text-[9px] font-mono text-text-muted flex-shrink-0">{r.treatment}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {/* TAB AUDITORÍA */}
            {activeTab === 'audit' && (
                <div className="bg-white rounded-xl border border-border p-6 text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-sm font-bold text-text-primary mb-1">Informe de auditoría</p>
                    <p className="text-xs text-text-muted mb-4">Genera un informe de cumplimiento basado en el estado actual de los controles ISO 27001</p>
                    <div className="bg-surface-bg rounded-lg p-4 text-left mb-4">
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-text-muted">Controles evaluados</span>
                            <span className="font-mono font-bold text-text-primary">{allItems.length}</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-text-muted">Nivel de cumplimiento</span>
                            <span className="font-mono font-bold" style={{ color: '#06D6A0' }}>{pct}%</span>
                        </div>
                        <div className="flex justify-between text-xs mb-2">
                            <span className="text-text-muted">No conformidades</span>
                            <span className="font-mono font-bold" style={{ color: '#DC2626' }}>{counts.fail}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-text-muted">Fecha del informe</span>
                            <span className="font-mono text-text-primary">{new Date().toLocaleDateString('es-ES')}</span>
                        </div>
                    </div>
                    <button
                        className="text-xs font-semibold text-white px-6 py-2.5 rounded-lg"
                        style={{ background: '#06D6A0' }}
                        onClick={() => {
                            import('jspdf').then(({ jsPDF }) => {
                                const doc = new jsPDF()
                                const lineHeight = 7
                                let y = 20

                                doc.setFontSize(16)
                                doc.setFont('helvetica', 'bold')
                                doc.text('INFORME DE AUDITORIA ISO 27001', 20, y)
                                y += 10

                                doc.setFontSize(10)
                                doc.setFont('helvetica', 'normal')
                                doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), 20, y); y += lineHeight
                                doc.text('Cumplimiento: ' + pct + '%', 20, y); y += lineHeight
                                doc.text('Implementados: ' + counts.done, 20, y); y += lineHeight
                                doc.text('En progreso: ' + counts.progress, 20, y); y += lineHeight
                                doc.text('No conformes: ' + counts.fail, 20, y); y += lineHeight
                                doc.text('Pendientes: ' + counts.pending, 20, y); y += lineHeight * 2

                                controls.forEach(section => {
                                    if (y > 270) { doc.addPage(); y = 20 }
                                    doc.setFont('helvetica', 'bold')
                                    doc.text(section.section, 20, y); y += lineHeight
                                    doc.setFont('helvetica', 'normal')
                                    section.items.forEach(item => {
                                        if (y > 270) { doc.addPage(); y = 20 }
                                        doc.text('  ' + item.id + ': ' + item.label + ' - ' + STATUS_CONFIG[item.status].label, 20, y)
                                        y += lineHeight
                                    })
                                    y += 3
                                })

                                const pdfBlob = doc.output('blob')
                                const url = URL.createObjectURL(pdfBlob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = 'auditoria_iso27001_' + new Date().toISOString().slice(0, 10) + '.pdf'
                                document.body.appendChild(a)
                                a.click()
                                document.body.removeChild(a)
                                URL.revokeObjectURL(url)
                            })
                        }}
                    >
                        Exportar informe
                    </button>
                </div>
            )}

        </div>
    )
}