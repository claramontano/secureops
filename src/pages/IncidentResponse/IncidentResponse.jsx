import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import IncidentModal from './IncidentModal'
import NewIncidentForm from './NewIncidentForm'

const STATUSES = [
    { id: 'open', label: 'Abierto', color: '#DC2626' },
    { id: 'investigating', label: 'Investigando', color: '#D97706' },
    { id: 'containing', label: 'Conteniendo', color: '#00B4D8' },
    { id: 'resolved', label: 'Resuelto', color: '#06D6A0' },
]

const PRIORITY_COLORS = {
    CRITICAL: { bg: '#FEE2E2', text: '#DC2626' },
    HIGH: { bg: '#FEF3C7', text: '#D97706' },
    MEDIUM: { bg: '#EBF5FA', text: '#00B4D8' },
    LOW: { bg: '#EBFAF5', text: '#06D6A0' },
}

const INITIAL_INCIDENTS = [
    {
        id: 'INC-2847',
        title: 'Ransomware detectado en servidor de archivos',
        priority: 'CRITICAL',
        status: 'open',
        category: 'Malware',
        reportedBy: { name: 'Pablo García', role: 'IT Support · Madrid HQ', initials: 'PG' },
        assignee: { name: 'Clara Montaño', role: 'Security Analyst', initials: 'CM', color: '#F97316' },
        openedAt: '30 jun 2026, 09:14',
        description: 'Se ha detectado actividad de cifrado masivo de archivos en el servidor FILE-SRV-02. El proceso sospechoso ha sido identificado ejecutándose desde una ruta no estándar. Se han cifrado aproximadamente 340 archivos antes de la detección automática.',
        timeline: [
            { action: 'Incidente creado y clasificado como Critical', by: 'Sistema automático', when: 'hace 12 min', color: '#DC2626' },
            { action: 'Asignado a Clara Montaño', by: 'Sistema automático', when: 'hace 10 min', color: '#F97316' },
            { action: 'Servidor aislado de la red preventivamente', by: 'Clara Montaño', when: 'hace 6 min', color: '#00B4D8' },
        ]
    },
    {
        id: 'INC-2846',
        title: 'Fuga de datos sospechada en API pública',
        priority: 'HIGH',
        status: 'open',
        category: 'Data Breach',
        reportedBy: { name: 'Laura Sánchez', role: 'DevOps Engineer', initials: 'LS' },
        assignee: { name: 'Javier López', role: 'Security Analyst', initials: 'JL', color: '#00B4D8' },
        openedAt: '30 jun 2026, 08:02',
        description: 'Se han detectado peticiones masivas al endpoint /api/users que podrían indicar extracción no autorizada de datos personales. Volumen de peticiones 40x superior a lo habitual.',
        timeline: [
            { action: 'Incidente creado', by: 'Laura Sánchez', when: 'hace 1h 30min', color: '#F97316' },
        ]
    },
    {
        id: 'INC-2845',
        title: 'Cuenta de admin con actividad inusual',
        priority: 'MEDIUM',
        status: 'open',
        category: 'Access Control',
        reportedBy: { name: 'Sistema automático', role: 'SIEM Alert', initials: 'SA' },
        assignee: { name: 'Marta Ruiz', role: 'IAM Specialist', initials: 'MR', color: '#B24BF3' },
        openedAt: '30 jun 2026, 07:45',
        description: 'La cuenta admin@secureops.com ha iniciado sesión desde una ubicación geográfica no habitual (Rusia) fuera del horario laboral establecido.',
        timeline: [
            { action: 'Incidente creado por detección automática', by: 'SIEM', when: 'hace 2h', color: '#00B4D8' },
        ]
    },
    {
        id: 'INC-2841',
        title: 'Phishing dirigido a departamento financiero',
        priority: 'HIGH',
        status: 'investigating',
        category: 'Phishing',
        reportedBy: { name: 'Ana Soto', role: 'Finance Manager', initials: 'AS' },
        assignee: { name: 'Ana Soto', role: 'Security Analyst', initials: 'AS', color: '#06D6A0' },
        openedAt: '29 jun 2026, 16:20',
        description: 'Varios empleados de finanzas han recibido un email suplantando al CEO solicitando una transferencia urgente. Ningún empleado ha hecho clic todavía.',
        timeline: [
            { action: 'Incidente creado', by: 'Ana Soto', when: 'hace 18h', color: '#F97316' },
            { action: 'Email reenviado para análisis forense', by: 'Ana Soto', when: 'hace 17h', color: '#D97706' },
            { action: 'Dominio del remitente bloqueado en el gateway de correo', by: 'Ana Soto', when: 'hace 16h', color: '#00B4D8' },
        ]
    },
    {
        id: 'INC-2839',
        title: 'DDoS leve en endpoint de login',
        priority: 'MEDIUM',
        status: 'investigating',
        category: 'Network',
        reportedBy: { name: 'Sistema automático', role: 'WAF Alert', initials: 'SA' },
        assignee: { name: 'Clara Montaño', role: 'Security Analyst', initials: 'CM', color: '#F97316' },
        openedAt: '29 jun 2026, 14:10',
        description: 'Pico de peticiones al endpoint /login desde múltiples IPs, patrón compatible con ataque de fuerza bruta distribuido a baja escala.',
        timeline: [
            { action: 'Incidente creado por el WAF', by: 'Sistema automático', when: 'hace 20h', color: '#00B4D8' },
            { action: 'Rate limiting reforzado en el endpoint', by: 'Clara Montaño', when: 'hace 19h', color: '#D97706' },
        ]
    },
    {
        id: 'INC-2830',
        title: 'Malware propagándose en red interna',
        priority: 'CRITICAL',
        status: 'containing',
        category: 'Malware',
        reportedBy: { name: 'Javier López', role: 'Network Admin', initials: 'JL' },
        assignee: { name: 'Javier López', role: 'Security Analyst', initials: 'JL', color: '#00B4D8' },
        openedAt: '28 jun 2026, 11:30',
        description: 'Worm detectado propagándose entre estaciones de trabajo del departamento de RRHH. 4 equipos infectados, contención en curso mediante segmentación de red.',
        timeline: [
            { action: 'Incidente creado', by: 'Javier López', when: 'hace 1d 14h', color: '#F97316' },
            { action: 'Identificadas 4 estaciones infectadas', by: 'Javier López', when: 'hace 1d 12h', color: '#DC2626' },
            { action: 'Segmento de red aislado del resto de la infraestructura', by: 'Javier López', when: 'hace 1d 10h', color: '#00B4D8' },
            { action: 'Limpieza de equipos en curso', by: 'Javier López', when: 'hace 3h', color: '#D97706' },
        ]
    },
    {
        id: 'INC-2820',
        title: 'Actualización pendiente en firewall perimetral',
        priority: 'LOW',
        status: 'resolved',
        category: 'Maintenance',
        reportedBy: { name: 'Marta Ruiz', role: 'Network Admin', initials: 'MR' },
        assignee: { name: 'Marta Ruiz', role: 'IAM Specialist', initials: 'MR', color: '#B24BF3' },
        openedAt: '25 jun 2026, 10:00',
        description: 'El firewall perimetral tenía pendiente una actualización de firmware con parches de seguridad críticos.',
        timeline: [
            { action: 'Incidente creado', by: 'Marta Ruiz', when: 'hace 5d', color: '#F97316' },
            { action: 'Firmware actualizado en ventana de mantenimiento', by: 'Marta Ruiz', when: 'hace 4d', color: '#06D6A0' },
            { action: 'Incidente cerrado, sin incidencias', by: 'Marta Ruiz', when: 'hace 4d', color: '#06D6A0' },
        ]
    },
    {
        id: 'INC-2815',
        title: 'Certificado SSL renovado en producción',
        priority: 'MEDIUM',
        status: 'resolved',
        category: 'Maintenance',
        reportedBy: { name: 'Sistema automático', role: 'Monitor', initials: 'SA' },
        assignee: { name: 'Ana Soto', role: 'Security Analyst', initials: 'AS', color: '#06D6A0' },
        openedAt: '23 jun 2026, 08:30',
        description: 'El certificado SSL del dominio principal expiraba en 48 horas, se renovó preventivamente.',
        timeline: [
            { action: 'Alerta de expiración generada', by: 'Sistema automático', when: 'hace 7d', color: '#D97706' },
            { action: 'Certificado renovado', by: 'Ana Soto', when: 'hace 6d', color: '#06D6A0' },
        ]
    },
]

function IncidentCard({ incident, onClick }) {
    const p = PRIORITY_COLORS[incident.priority]
    const isResolved = incident.status === 'resolved'

    return (
        <div
            onClick={() => onClick(incident)}
            className="rounded-lg p-4 border border-[#F0E4D4] cursor-pointer hover:border-text-muted transition-colors"
            style={{ background: '#FDF8F4', opacity: isResolved ? 0.7 : 1, fontSize: '0.7rem' }}
        >
            <span
                className="font-mono font-semibold px-1.5 py-0.5 rounded mb-1 inline-block"
                style={{ background: p.bg, color: p.text, fontSize: '0.55rem' }}
            >
                {incident.priority}
            </span>
            <p className="font-semibold text-text-primary leading-snug mb-1" style={{ fontSize: '0.7rem' }}>{incident.title}</p>
            <div className="flex items-center justify-between">
                <span className="font-mono text-text-faint" style={{ fontSize: '0.55rem' }}>#{incident.id}</span>
                <div
                    className="rounded-full flex items-center justify-center font-bold text-white"
                    style={{ background: incident.assignee.color, width: '14px', height: '14px', fontSize: '0.5rem' }}
                >
                    {incident.assignee.initials}
                </div>
            </div>
        </div>
    )
}

export default function IncidentResponse() {
    const navigate = useNavigate()
    const [incidents, setIncidents] = useState(INITIAL_INCIDENTS)
    const [selected, setSelected] = useState(null)
    const [showNewForm, setShowNewForm] = useState(false)

    function handleAdvance(incident) {
        const order = ['open', 'investigating', 'containing', 'resolved']
        const idx = order.indexOf(incident.status)
        const nextStatus = order[idx + 1]
        if (!nextStatus) return

        const statusLabel = STATUSES.find(s => s.id === nextStatus).label

        setIncidents(prev => prev.map(i =>
            i.id === incident.id
                ? {
                    ...i,
                    status: nextStatus,
                    timeline: [...i.timeline, {
                        action: `Movido a ${statusLabel}`,
                        by: 'Clara Montaño',
                        when: 'ahora',
                        color: STATUSES.find(s => s.id === nextStatus).color
                    }]
                }
                : i
        ))
        setSelected(null)
    }

    function handleDelete(incident) {
        setIncidents(prev => prev.filter(i => i.id !== incident.id))
        setSelected(null)
    }
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
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F97316' }}></div>
                        <h1 className="text-lg font-bold text-text-primary">Incident Response</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: '#F9731615', color: '#F97316', border: '1px solid #F9731630' }}>
                            IR
                        </span>
                    </div>
                </div>
                <button
                    onClick={() => setShowNewForm(true)}
                    className="text-xs font-semibold text-white px-3.5 py-2 rounded-lg"
                    style={{ background: '#F97316' }}
                >
                    + Nuevo incidente
                </button>
            </div>

            {/* Kanban */}
            <div className="grid grid-cols-4 gap-3">
                {STATUSES.map(status => {
                    const items = incidents.filter(i => i.status === status.id)
                    return (
                        <div key={status.id} className="bg-white rounded-xl border border-border overflow-hidden">
                            <div className="px-3 py-2.5 border-b border-surface-bg flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: status.color }}></span>
                                    <span className="text-[11px] font-bold text-text-primary">{status.label}</span>
                                </div>
                                <span className="text-[10px] font-mono text-text-muted bg-surface-bg px-1.5 py-0.5 rounded-full">
                                    {items.length}
                                </span>
                            </div>
                            <div className="p-2 flex flex-col gap-1.5 min-h-[200px]">
                                {items.map(incident => (
                                    <IncidentCard key={incident.id} incident={incident} onClick={setSelected} />
                                ))}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Modal */}
            <IncidentModal
                incident={selected}
                onClose={() => setSelected(null)}
                onAdvance={handleAdvance}
                onDelete={handleDelete}
            />

            {showNewForm && (
                <NewIncidentForm
                    onClose={() => setShowNewForm(false)}
                    onCreate={(newIncident) => {
                        setIncidents(prev => [newIncident, ...prev])
                        setShowNewForm(false)
                    }}
                />
            )}
        </div>
    )
}