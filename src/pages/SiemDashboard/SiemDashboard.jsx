import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const SEVERITY_COLORS = {
    CRITICAL: { bg: '#FEE2E2', text: '#DC2626' },
    HIGH: { bg: '#FEF3C7', text: '#D97706' },
    MEDIUM: { bg: '#EBF5FA', text: '#00B4D8' },
    LOW: { bg: '#EBFAF5', text: '#06D6A0' },
    INFO: { bg: '#F5ECD8', text: '#A07850' },
}

const INITIAL_EVENTS = [
    { id: 1, severity: 'CRITICAL', desc: 'Intento de acceso root fallido múltiple — 192.168.1.45', source: 'Firewall', time: '00:02' },
    { id: 2, severity: 'HIGH', desc: 'Escaneo de puertos detectado desde IP externa', source: 'IDS/IPS', time: '00:05' },
    { id: 3, severity: 'HIGH', desc: 'Token JWT expirado reutilizado en endpoint /api/admin', source: 'Auth logs', time: '00:11' },
    { id: 4, severity: 'MEDIUM', desc: 'Conexión saliente a dominio sospechoso bloqueada', source: 'DNS', time: '00:18' },
    { id: 5, severity: 'LOW', desc: 'Usuario inactivo detectado con sesión abierta +8h', source: 'Auth logs', time: '00:24' },
    { id: 6, severity: 'INFO', desc: 'Backup automático completado correctamente', source: 'Sistema', time: '00:30' },
    { id: 7, severity: 'MEDIUM', desc: 'Múltiples intentos de login fallidos — usuario admin', source: 'Auth logs', time: '00:35' },
    { id: 8, severity: 'HIGH', desc: 'Tráfico inusual detectado en puerto 4444', source: 'Firewall', time: '00:41' },
]

const NEW_EVENTS = [
    { severity: 'CRITICAL', desc: 'Acceso no autorizado a /etc/passwd detectado', source: 'IDS/IPS' },
    { severity: 'HIGH', desc: 'Certificado SSL expirado en servidor de producción', source: 'Monitor' },
    { severity: 'MEDIUM', desc: 'Pico de tráfico DNS inusual detectado', source: 'DNS' },
    { severity: 'LOW', desc: 'Actualización de firmware disponible para router', source: 'Sistema' },
    { severity: 'INFO', desc: 'Escaneo de vulnerabilidades programado iniciado', source: 'Scanner' },
]

const CHART_DATA = [30, 45, 25, 60, 40, 80, 55, 90, 70, 50, 35, 20]
const CHART_COLORS = ['#00B4D830', '#00B4D840', '#00B4D830', '#00B4D850', '#00B4D840', '#00B4D860', '#D9770650', '#DC262650', '#D9770640', '#00B4D850', '#00B4D840', '#00B4D830']

function SeverityBadge({ severity }) {
    const s = SEVERITY_COLORS[severity]
    return (
        <span
            className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded flex-shrink-0 w-14 text-center"
            style={{ background: s.bg, color: s.text }}
        >
            {severity}
        </span>
    )
}

function StatCard({ label, value, color, sub, subColor }) {
    return (
        <div className="bg-white rounded-xl p-3 border border-border">
            <div className="text-xs text-text-muted mb-1">{label}</div>
            <div className="text-2xl font-extrabold font-mono" style={{ color }}>{value}</div>
            <div className="text-[10px] mt-1" style={{ color: subColor }}>{sub}</div>
        </div>
    )
}

export default function SiemDashboard() {
    const navigate = useNavigate()
    const [events, setEvents] = useState(INITIAL_EVENTS)
    const [count, setCount] = useState(1247)
    const [lastUpdate, setLastUpdate] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            const newEvent = {
                ...NEW_EVENTS[Math.floor(Math.random() * NEW_EVENTS.length)],
                id: Date.now(),
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            }
            setEvents(prev => [newEvent, ...prev.slice(0, 9)])
            setCount(prev => prev + Math.floor(Math.random() * 3 + 1))
            setLastUpdate(0)
        }, 4000)

        const timer = setInterval(() => setLastUpdate(prev => prev + 1), 1000)

        return () => { clearInterval(interval); clearInterval(timer) }
    }, [])

    const criticals = events.filter(e => e.severity === 'CRITICAL').length
    const highs = events.filter(e => e.severity === 'HIGH').length
    const mediums = events.filter(e => e.severity === 'MEDIUM').length
    const lows = events.filter(e => e.severity === 'LOW').length
    const infos = events.filter(e => e.severity === 'INFO').length
    const maxSev = Math.max(criticals, highs, mediums, lows, infos) || 1

    return (
        <div className="max-w-7xl mx-auto px-4 py-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                        ← Volver
                    </button>
                    <div className="w-px h-4 bg-border"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent-cyan"></div>
                        <h1 className="text-lg font-bold text-text-primary">SIEM Dashboard</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: '#00B4D815', color: '#00B4D8', border: '1px solid #00B4D830' }}>
                            SOC
                        </span>
                    </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">
                    Actualizado hace {lastUpdate}s
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3 mb-4">
                <StatCard label="Eventos hoy" value={count.toLocaleString()} color="#00B4D8" sub="↑ +12% vs ayer" subColor="#06D6A0" />
                <StatCard label="Críticos" value={criticals} color="#DC2626" sub="Requieren atención" subColor="#DC2626" />
                <StatCard label="Alertas activas" value={highs + mediums} color="#D97706" sub={`${highs} en revisión`} subColor="#A07850" />
                <StatCard label="Fuentes activas" value="24" color="#1A1008" sub="Todas operativas" subColor="#06D6A0" />
            </div>

            {/* Grid 2 columnas */}
            <div className="grid grid-cols-2 gap-3 mb-4">

                {/* Severidad */}
                <div className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan"></div>
                        <span className="text-xs font-bold text-text-primary">Eventos por severidad</span>
                    </div>
                    {[
                        { label: 'Critical', count: criticals, color: '#DC2626' },
                        { label: 'High', count: highs, color: '#D97706' },
                        { label: 'Medium', count: mediums, color: '#00B4D8' },
                        { label: 'Low', count: lows, color: '#06D6A0' },
                        { label: 'Info', count: infos, color: '#C4A882' },
                    ].map(s => (
                        <div key={s.label} className="flex items-center gap-2 mb-1.5">
                            <span className="text-[10px] text-text-secondary w-14 flex-shrink-0">{s.label}</span>
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: '#F5ECD8' }}>
                                <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{ width: `${(s.count / maxSev) * 100}%`, background: s.color }}
                                ></div>
                            </div>
                            <span className="text-[10px] font-mono text-text-muted w-6 text-right">{s.count}</span>
                        </div>
                    ))}
                </div>

                {/* Actividad */}
                <div className="bg-white rounded-xl p-4 border border-border">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan"></div>
                        <span className="text-xs font-bold text-text-primary">Actividad últimas 12h</span>
                    </div>
                    <div className="flex items-end gap-1 h-12">
                        {CHART_DATA.map((h, i) => (
                            <div
                                key={i}
                                className="flex-1 rounded-sm"
                                style={{ height: `${h}%`, background: CHART_COLORS[i], minHeight: '4px' }}
                            ></div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-1">
                        <span className="text-[9px] font-mono text-text-faint">00:00</span>
                        <span className="text-[9px] font-mono text-text-faint">06:00</span>
                        <span className="text-[9px] font-mono text-text-faint">12:00</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border">
                        <div className="text-[10px] text-text-muted mb-2">Top fuentes</div>
                        <div className="flex gap-1.5 flex-wrap">
                            {[
                                { label: 'Firewall', bg: '#EBF5FA', color: '#00B4D8' },
                                { label: 'IDS/IPS', bg: '#FEF3C7', color: '#D97706' },
                                { label: 'Auth logs', bg: '#F5ECD8', color: '#A07850' },
                                { label: 'DNS', bg: '#EBFAF5', color: '#06D6A0' },
                            ].map(f => (
                                <span key={f.label} className="text-[9px] font-mono px-1.5 py-0.5 rounded"
                                    style={{ background: f.bg, color: f.color }}>
                                    {f.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Log de eventos */}
            <div className="bg-white rounded-xl border border-border overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-xs font-bold text-text-primary">Log de eventos recientes</span>
                    <span className="text-[10px] font-mono text-text-muted bg-surface-card px-2 py-0.5 rounded-full">
                        {count.toLocaleString()} eventos
                    </span>
                </div>
                <div>
                    {events.map((e, i) => (
                        <div
                            key={e.id}
                            className="flex items-center gap-3 px-4 py-2 border-b border-surface-bg transition-all"
                            style={{ opacity: i === 0 ? 1 : 1, background: i === 0 ? '#EBF5FA' : 'white' }}
                        >
                            <SeverityBadge severity={e.severity} />
                            <span className="flex-1 text-xs text-text-primary">{e.desc}</span>
                            <span className="text-[10px] font-mono text-text-muted flex-shrink-0">{e.source}</span>
                            <span className="text-[10px] font-mono text-text-faint flex-shrink-0 w-10 text-right">{e.time}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}