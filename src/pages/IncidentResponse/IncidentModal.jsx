
function PriorityBadge({ priority }) {
    const colors = {
        CRITICAL: { bg: '#FEE2E2', text: '#DC2626' },
        HIGH: { bg: '#FEF3C7', text: '#D97706' },
        MEDIUM: { bg: '#EBF5FA', text: '#00B4D8' },
        LOW: { bg: '#EBFAF5', text: '#06D6A0' },
    }
    const c = colors[priority]
    return (
        <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
            style={{ background: c.bg, color: c.text }}>
            {priority}
        </span>
    )
}

const STATUS_LABELS = {
    open: { label: '● Abierto', bg: '#FEE2E2', text: '#DC2626' },
    investigating: { label: '● Investigando', bg: '#FEF3C7', text: '#D97706' },
    containing: { label: '● Conteniendo', bg: '#EBF5FA', text: '#00B4D8' },
    resolved: { label: '● Resuelto', bg: '#EBFAF5', text: '#06D6A0' },
}

const NEXT_LABEL = {
    open: 'Mover a Investigando →',
    investigating: 'Mover a Conteniendo →',
    containing: 'Mover a Resuelto →',
    resolved: null,
}

export default function IncidentModal({ incident, onClose, onAdvance, onDelete }) {
    if (!incident) return null

    const status = STATUS_LABELS[incident.status]
    const nextLabel = NEXT_LABEL[incident.status]

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-8 overflow-y-auto"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl mt-4">

                {/* Header */}
                <div className="px-5 py-4 border-b border-border flex items-start justify-between">
                    <div>
                        <div className="text-[10px] font-mono text-text-muted mb-1">#{incident.id}</div>
                        <h2 className="text-base font-bold text-text-primary leading-snug">{incident.title}</h2>
                    </div>
                    <button onClick={onClose} className="w-6 h-6 rounded-md bg-surface-card flex items-center justify-center text-text-muted text-sm flex-shrink-0">
                        ✕
                    </button>
                </div>

                <div className="px-5 py-4">
                    {/* Prioridad / Estado / Categoría */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                            <div className="text-[10px] text-text-muted mb-1">Prioridad</div>
                            <PriorityBadge priority={incident.priority} />
                        </div>
                        <div>
                            <div className="text-[10px] text-text-muted mb-1">Estado</div>
                            <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
                                style={{ background: status.bg, color: status.text }}>
                                {status.label}
                            </span>
                        </div>
                        <div>
                            <div className="text-[10px] text-text-muted mb-1">Categoría</div>
                            <div className="text-xs text-text-primary font-medium">{incident.category}</div>
                        </div>
                    </div>

                    {/* Reportado por */}
                    <div className="mb-4">
                        <div className="text-[10px] text-text-muted mb-1.5">Reportado por</div>
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                style={{ background: '#6B4E35' }}>
                                {incident.reportedBy.initials}
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-text-primary">{incident.reportedBy.name}</div>
                                <div className="text-[10px] text-text-muted">{incident.reportedBy.role}</div>
                            </div>
                        </div>
                    </div>

                    {/* Asignado / Fecha */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <div className="text-[10px] text-text-muted mb-1.5">Asignado a</div>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                    style={{ background: incident.assignee.color }}>
                                    {incident.assignee.initials}
                                </div>
                                <div>
                                    <div className="text-xs font-semibold text-text-primary">{incident.assignee.name}</div>
                                    <div className="text-[10px] text-text-muted">{incident.assignee.role}</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="text-[10px] text-text-muted mb-1">Fecha de apertura</div>
                            <div className="text-xs text-text-primary font-medium">{incident.openedAt}</div>
                        </div>
                    </div>

                    {/* Descripción */}
                    <div className="text-xs font-bold text-text-primary mb-2 mt-4">Descripción</div>
                    <div className="text-xs text-text-secondary leading-relaxed bg-surface-bg p-3 rounded-lg">
                        {incident.description}
                    </div>

                    {/* Timeline */}
                    <div className="text-xs font-bold text-text-primary mb-2 mt-4">Actividad</div>
                    <div className="flex flex-col">
                        {incident.timeline.map((t, i) => (
                            <div key={i} className="flex gap-2.5 pb-3 last:pb-0 relative">
                                <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1 relative z-10" style={{ background: t.color }}></div>
                                {i < incident.timeline.length - 1 && (
                                    <div className="absolute left-[3px] top-3 bottom-0 w-px bg-border"></div>
                                )}
                                <div className="flex-1">
                                    <div className="text-xs font-semibold text-text-primary">{t.action}</div>
                                    <div className="text-[10px] text-text-muted mt-0.5">{t.by} · {t.when}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-5 py-3.5 border-t border-border flex gap-2">
                    <button
                        onClick={() => onDelete(incident)}
                        className="py-2.5 px-4 rounded-lg text-xs font-semibold bg-[#FEE2E2] text-[#DC2626] hover:bg-[#FECACA] transition-colors"
                    >
                        Eliminar
                    </button>
                    {nextLabel && (
                        <button
                            onClick={() => onAdvance(incident)}
                            className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white transition-colors"
                            style={{ background: '#F97316' }}
                        >
                            {nextLabel}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}