import { useState } from 'react'

const CATEGORIES = ['Malware', 'Phishing', 'Data Breach', 'Access Control', 'Network', 'Maintenance', 'Otro']
const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']

const ASSIGNEES = [
    { name: 'Clara Montaño', role: 'Security Analyst', initials: 'CM', color: '#F97316' },
    { name: 'Javier López', role: 'Security Analyst', initials: 'JL', color: '#00B4D8' },
    { name: 'Marta Ruiz', role: 'IAM Specialist', initials: 'MR', color: '#B24BF3' },
    { name: 'Ana Soto', role: 'Security Analyst', initials: 'AS', color: '#06D6A0' },
]

export default function NewIncidentForm({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: '',
        description: '',
        priority: 'MEDIUM',
        category: 'Malware',
        reporterName: '',
        reporterRole: '',
        assigneeIndex: 0,
    })

    function handleSubmit(e) {
        e.preventDefault()
        if (!form.title.trim() || !form.reporterName.trim()) return

        const assignee = ASSIGNEES[form.assigneeIndex]
        const initials = form.reporterName.trim().split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

        const newIncident = {
            id: `INC-${Math.floor(2800 + Math.random() * 200)}`,
            title: form.title.trim(),
            priority: form.priority,
            status: 'open',
            category: form.category,
            reportedBy: { name: form.reporterName.trim(), role: form.reporterRole.trim() || 'Empleado', initials },
            assignee,
            openedAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) + ', ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
            description: form.description.trim() || 'Sin descripción proporcionada.',
            timeline: [
                { action: 'Incidente creado', by: form.reporterName.trim(), when: 'ahora', color: '#DC2626' },
                { action: `Asignado a ${assignee.name}`, by: 'Sistema automático', when: 'ahora', color: assignee.color },
            ]
        }

        onCreate(newIncident)
    }

    return (
        <div
            className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-8 overflow-y-auto"
            onClick={e => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl mt-4">

                <div className="px-5 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="text-base font-bold text-text-primary">Nuevo incidente</h2>
                    <button onClick={onClose} className="w-6 h-6 rounded-md bg-surface-card flex items-center justify-center text-text-muted text-sm">
                        ✕
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="px-5 py-4 flex flex-col gap-4">

                    <div>
                        <label className="text-xs text-text-muted font-medium mb-1.5 block">Título del incidente</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                            placeholder="Ej: Acceso no autorizado detectado"
                            required
                            className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-text-muted font-medium mb-1.5 block">Prioridad</label>
                            <select
                                value={form.priority}
                                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                                className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                            >
                                {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-text-muted font-medium mb-1.5 block">Categoría</label>
                            <select
                                value={form.category}
                                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                            >
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs text-text-muted font-medium mb-1.5 block">Reportado por</label>
                            <input
                                type="text"
                                value={form.reporterName}
                                onChange={e => setForm(f => ({ ...f, reporterName: e.target.value }))}
                                placeholder="Tu nombre"
                                required
                                className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-text-muted font-medium mb-1.5 block">Tu puesto</label>
                            <input
                                type="text"
                                value={form.reporterRole}
                                onChange={e => setForm(f => ({ ...f, reporterRole: e.target.value }))}
                                placeholder="Ej: IT Support"
                                className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-text-muted font-medium mb-1.5 block">Asignar a</label>
                        <select
                            value={form.assigneeIndex}
                            onChange={e => setForm(f => ({ ...f, assigneeIndex: parseInt(e.target.value) }))}
                            className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors"
                        >
                            {ASSIGNEES.map((a, i) => <option key={a.name} value={i}>{a.name} — {a.role}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs text-text-muted font-medium mb-1.5 block">Descripción</label>
                        <textarea
                            value={form.description}
                            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                            placeholder="Describe qué ha pasado..."
                            rows={3}
                            className="w-full bg-surface-bg border border-border rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-brand-orange transition-colors resize-none"
                        />
                    </div>

                    <div className="flex gap-2 mt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-surface-card text-text-secondary hover:bg-surface-card-hover transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-white transition-colors"
                            style={{ background: '#F97316' }}
                        >
                            Crear incidente
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}