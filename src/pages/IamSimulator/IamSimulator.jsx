import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLES = {
    admin: { label: 'Admin', bg: '#FEE2E2', text: '#DC2626', color: '#DC2626' },
    analyst: { label: 'Analyst', bg: '#EBF5FA', text: '#00B4D8', color: '#00B4D8' },
    auditor: { label: 'Auditor', bg: '#EBFAF5', text: '#06D6A0', color: '#06D6A0' },
    viewer: { label: 'Viewer', bg: '#F7EEFE', text: '#B24BF3', color: '#B24BF3' },
}

const PERMISSIONS = [
    { id: 'incidents.read', label: 'Ver incidentes' },
    { id: 'incidents.write', label: 'Crear/editar incidentes' },
    { id: 'incidents.delete', label: 'Eliminar incidentes' },
    { id: 'vulns.read', label: 'Ver vulnerabilidades' },
    { id: 'vulns.write', label: 'Gestionar vulnerabilidades' },
    { id: 'users.manage', label: 'Gestionar usuarios' },
    { id: 'logs.read', label: 'Ver logs de acceso' },
    { id: 'settings.write', label: 'Modificar configuración' },
    { id: 'reports.export', label: 'Exportar informes' },
    { id: 'system.shutdown', label: 'Apagar sistema' },
]

const ROLE_PERMISSIONS = {
    admin: ['incidents.read', 'incidents.write', 'incidents.delete', 'vulns.read', 'vulns.write', 'users.manage', 'logs.read', 'settings.write', 'reports.export'],
    analyst: ['incidents.read', 'incidents.write', 'vulns.read', 'vulns.write', 'logs.read', 'reports.export'],
    auditor: ['incidents.read', 'vulns.read', 'logs.read', 'reports.export'],
    viewer: ['incidents.read', 'vulns.read'],
}

const AVATAR_COLORS = ['#F97316', '#00B4D8', '#06D6A0', '#B24BF3', '#D4A017', '#DC2626']

const INITIAL_USERS = [
    { id: 'usr_001', name: 'Clara Montaño', email: 'clara@secureops.com', role: 'admin', color: '#F97316', active: true },
    { id: 'usr_002', name: 'Javier López', email: 'javier@secureops.com', role: 'analyst', color: '#00B4D8', active: true },
    { id: 'usr_003', name: 'Ana Soto', email: 'ana@secureops.com', role: 'auditor', color: '#06D6A0', active: true },
    { id: 'usr_004', name: 'Marta Ruiz', email: 'marta@secureops.com', role: 'viewer', color: '#B24BF3', active: true },
]

const INITIAL_LOGS = [
    { id: 1, user: 'Clara Montaño', action: 'LOGIN', resource: '/dashboard', status: 'success', time: '09:14:02' },
    { id: 2, user: 'Javier López', action: 'READ', resource: '/incidents/INC-2847', status: 'success', time: '09:18:45' },
    { id: 3, user: 'Marta Ruiz', action: 'WRITE', resource: '/settings', status: 'denied', time: '09:22:11' },
    { id: 4, user: 'Ana Soto', action: 'EXPORT', resource: '/reports/audit', status: 'success', time: '09:30:05' },
    { id: 5, user: 'Javier López', action: 'DELETE', resource: '/incidents/INC-2830', status: 'denied', time: '09:35:20' },
]

function getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}

function generateJWT(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(JSON.stringify({
        sub: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        iat: now,
        exp: now + 86400,
    }))
    const signature = btoa(`HMACSHA256(${header}.${payload}, secret)`)
    return `${header}.${payload}.${signature}`
}

export default function IamSimulator() {
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('users')
    const [users, setUsers] = useState(INITIAL_USERS)
    const [selectedUser, setSelectedUser] = useState(INITIAL_USERS[0])
    const [logs, setLogs] = useState(INITIAL_LOGS)
    const [showNewUser, setShowNewUser] = useState(false)
    const [jwtInput, setJwtInput] = useState('')
    const [jwtDecoded, setJwtDecoded] = useState(null)
    const [jwtError, setJwtError] = useState(null)
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'viewer' })

    function handleCreateUser() {
        if (!newUser.name.trim() || !newUser.email.trim()) return
        const user = {
            id: 'usr_' + Date.now(),
            name: newUser.name.trim(),
            email: newUser.email.trim(),
            role: newUser.role,
            color: AVATAR_COLORS[users.length % AVATAR_COLORS.length],
            active: true,
        }
        setUsers(prev => [...prev, user])
        setLogs(prev => [{
            id: Date.now(), user: 'Sistema', action: 'CREATE_USER',
            resource: `/users/${user.id}`, status: 'success',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }, ...prev])
        setNewUser({ name: '', email: '', role: 'viewer' })
        setShowNewUser(false)
    }

    function handleDeleteUser(id) {
        const user = users.find(u => u.id === id)
        setUsers(prev => prev.filter(u => u.id !== id))
        if (selectedUser?.id === id) setSelectedUser(users.find(u => u.id !== id) || null)
        setLogs(prev => [{
            id: Date.now(), user: 'Sistema', action: 'DELETE_USER',
            resource: `/users/${id}`, status: 'success',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }, ...prev])
    }

    function handleChangeRole(userId, newRole) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        if (selectedUser?.id === userId) setSelectedUser(prev => ({ ...prev, role: newRole }))
        setLogs(prev => [{
            id: Date.now(), user: 'Sistema', action: 'CHANGE_ROLE',
            resource: `/users/${userId}/role → ${newRole}`, status: 'success',
            time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        }, ...prev])
    }

    function decodeJWT(token) {
        try {
            const parts = token.trim().split('.')
            if (parts.length !== 3) throw new Error('Formato JWT inválido')
            const header = JSON.parse(atob(parts[0]))
            const payload = JSON.parse(atob(parts[1]))
            setJwtDecoded({ header, payload, signature: parts[2] })
            setJwtError(null)
        } catch {
            setJwtDecoded(null)
            setJwtError('Token JWT inválido o malformado')
        }
    }

    const selectedPerms = selectedUser ? ROLE_PERMISSIONS[selectedUser.role] : []

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
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#B24BF3' }}></div>
                        <h1 className="text-lg font-bold text-text-primary">IAM Simulator</h1>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
                            style={{ background: '#B24BF315', color: '#B24BF3', border: '1px solid #B24BF330' }}>
                            IAM
                        </span>
                    </div>
                </div>
                <div className="text-[11px] font-mono text-text-muted">OAuth 2.0 · JWT</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-white border border-border rounded-xl p-1">
                {[
                    { id: 'users', label: 'Usuarios & Roles' },
                    { id: 'perms', label: 'Permisos' },
                    { id: 'jwt', label: 'JWT Decoder' },
                    { id: 'logs', label: 'Access Log' },
                ].map(t => (
                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                        className="flex-1 text-xs font-semibold py-2 rounded-lg transition-colors"
                        style={activeTab === t.id ? { background: '#B24BF320', color: '#B24BF3' } : { color: '#A07850' }}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* TAB USUARIOS */}
            {activeTab === 'users' && (
                <div className="grid grid-cols-2 gap-4">
                    {/* Lista usuarios */}
                    <div className="bg-white rounded-xl border border-border overflow-hidden">
                        <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                            <span className="text-sm font-bold text-text-primary">Usuarios</span>
                            <button onClick={() => setShowNewUser(true)}
                                className="text-[10px] font-semibold text-white px-3 py-1.5 rounded-lg"
                                style={{ background: '#B24BF3' }}>
                                + Nuevo usuario
                            </button>
                        </div>

                        {showNewUser && (
                            <div className="p-4 border-b border-border bg-surface-bg">
                                <div className="flex flex-col gap-2">
                                    <input type="text" placeholder="Nombre completo" value={newUser.name}
                                        onChange={e => setNewUser(f => ({ ...f, name: e.target.value }))}
                                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-orange" />
                                    <input type="email" placeholder="Email" value={newUser.email}
                                        onChange={e => setNewUser(f => ({ ...f, email: e.target.value }))}
                                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-orange" />
                                    <select value={newUser.role} onChange={e => setNewUser(f => ({ ...f, role: e.target.value }))}
                                        className="w-full bg-white border border-border rounded-lg px-3 py-2 text-xs text-text-primary outline-none focus:border-brand-orange">
                                        {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={handleCreateUser}
                                            className="flex-1 py-2 rounded-lg text-xs font-semibold text-white"
                                            style={{ background: '#B24BF3' }}>Crear</button>
                                        <button onClick={() => setShowNewUser(false)}
                                            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-surface-card text-text-muted">Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-2">
                            {users.map(user => {
                                const role = ROLES[user.role]
                                return (
                                    <div key={user.id}
                                        onClick={() => setSelectedUser(user)}
                                        className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-colors mb-1"
                                        style={{ background: selectedUser?.id === user.id ? '#B24BF310' : 'transparent' }}>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                                            style={{ background: user.color }}>
                                            {getInitials(user.name)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-semibold text-text-primary truncate">{user.name}</p>
                                            <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                                        </div>
                                        <select
                                            value={user.role}
                                            onClick={e => e.stopPropagation()}
                                            onChange={e => handleChangeRole(user.id, e.target.value)}
                                            className="text-[9px] font-mono font-semibold px-2 py-1 rounded-full border-0 outline-none cursor-pointer"
                                            style={{ background: role.bg, color: role.text }}>
                                            {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                                        </select>
                                        <button onClick={e => { e.stopPropagation(); handleDeleteUser(user.id) }}
                                            className="w-6 h-6 rounded flex items-center justify-center text-text-muted hover:text-[#DC2626] hover:bg-[#FEE2E2] transition-colors text-xs">
                                            ✕
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Detalle usuario seleccionado */}
                    {selectedUser && (
                        <div className="bg-white rounded-xl border border-border overflow-hidden">
                            <div className="px-4 py-3 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                                        style={{ background: selectedUser.color }}>
                                        {getInitials(selectedUser.name)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-text-primary">{selectedUser.name}</p>
                                        <p className="text-[10px] text-text-muted font-mono">{selectedUser.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="mb-3">
                                    <p className="text-[10px] text-text-muted mb-1">ID de usuario</p>
                                    <p className="text-xs font-mono text-text-primary">{selectedUser.id}</p>
                                </div>
                                <div className="mb-4">
                                    <p className="text-[10px] text-text-muted mb-1">Token JWT generado</p>
                                    <div className="bg-surface-bg rounded-lg p-2 text-[9px] font-mono text-text-muted break-all">
                                        {generateJWT(selectedUser).slice(0, 80)}...
                                    </div>
                                </div>
                                <p className="text-xs font-bold text-text-primary mb-2">Permisos del rol {ROLES[selectedUser.role].label}</p>
                                <div className="flex flex-col gap-1">
                                    {PERMISSIONS.map(p => {
                                        const has = selectedPerms.includes(p.id)
                                        return (
                                            <div key={p.id} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                                                style={{ background: has ? '#B24BF308' : '#F5ECD8' }}>
                                                <span className="text-[10px] font-mono text-text-primary">{p.id}</span>
                                                <div className="w-2 h-2 rounded-full" style={{ background: has ? '#06D6A0' : '#DC2626' }}></div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB PERMISOS */}
            {activeTab === 'perms' && (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-border">
                        <span className="text-sm font-bold text-text-primary">Matriz de permisos por rol</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left px-4 py-2.5 text-xs text-text-muted font-medium">Permiso</th>
                                    {Object.entries(ROLES).map(([k, v]) => (
                                        <th key={k} className="px-4 py-2.5 text-xs font-semibold" style={{ color: v.text }}>{v.label}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSIONS.map(p => (
                                    <tr key={p.id} className="border-b border-surface-bg">
                                        <td className="px-4 py-2.5">
                                            <p className="text-xs font-mono text-text-primary">{p.id}</p>
                                            <p className="text-[10px] text-text-muted">{p.label}</p>
                                        </td>
                                        {Object.keys(ROLES).map(role => (
                                            <td key={role} className="px-4 py-2.5 text-center">
                                                <div className="w-4 h-4 rounded-full mx-auto"
                                                    style={{ background: ROLE_PERMISSIONS[role].includes(p.id) ? '#06D6A0' : '#FEE2E2' }}>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* TAB JWT DECODER */}
            {activeTab === 'jwt' && (
                <div className="flex flex-col gap-4">
                    <div className="bg-white rounded-xl border border-border p-4">
                        <p className="text-xs font-bold text-text-primary mb-2">Pega un token JWT para decodificarlo</p>
                        <div className="flex gap-2">
                            <textarea
                                value={jwtInput}
                                onChange={e => setJwtInput(e.target.value)}
                                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                                rows={3}
                                className="flex-1 bg-surface-bg border border-border rounded-lg px-3 py-2 text-xs font-mono text-text-primary outline-none focus:border-brand-orange resize-none"
                            />
                            <button onClick={() => decodeJWT(jwtInput)}
                                className="px-4 py-2 rounded-lg text-xs font-semibold text-white self-start"
                                style={{ background: '#B24BF3' }}>
                                Decodificar
                            </button>
                        </div>
                        <button
                            onClick={() => { setJwtInput(generateJWT(INITIAL_USERS[0])); }}
                            className="mt-2 text-[10px] text-text-muted hover:text-text-primary transition-colors underline"
                        >
                            Usar token de ejemplo
                        </button>
                    </div>

                    {jwtError && (
                        <div className="bg-[#FEE2E2] text-[#DC2626] text-xs px-4 py-3 rounded-xl border border-[#FECACA]">
                            {jwtError}
                        </div>
                    )}

                    {jwtDecoded && (
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: 'HEADER', data: jwtDecoded.header, color: '#F97316', bg: '#FDF0E6' },
                                { label: 'PAYLOAD', data: jwtDecoded.payload, color: '#B24BF3', bg: '#F7EEFE' },
                                { label: 'SIGNATURE', data: { value: jwtDecoded.signature.slice(0, 30) + '...' }, color: '#06D6A0', bg: '#EBFAF5' },
                            ].map(section => (
                                <div key={section.label} className="rounded-xl p-4 border" style={{ background: section.bg, borderColor: section.color + '30' }}>
                                    <p className="text-[10px] font-bold font-mono mb-3" style={{ color: section.color }}>{section.label}</p>
                                    {Object.entries(section.data).map(([k, v]) => (
                                        <div key={k} className="mb-1.5">
                                            <span className="text-[9px] font-mono" style={{ color: section.color + 'AA' }}>{k}: </span>
                                            <span className="text-[9px] font-mono break-all" style={{ color: section.color }}>
                                                {typeof v === 'number' && k === 'exp'
                                                    ? new Date(v * 1000).toLocaleString('es-ES')
                                                    : typeof v === 'number' && k === 'iat'
                                                        ? new Date(v * 1000).toLocaleString('es-ES')
                                                        : String(v)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* TAB ACCESS LOG */}
            {activeTab === 'logs' && (
                <div className="bg-white rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                        <span className="text-sm font-bold text-text-primary">Log de accesos</span>
                        <span className="text-[10px] font-mono text-text-muted bg-surface-bg px-2 py-0.5 rounded-full">{logs.length} eventos</span>
                    </div>
                    {logs.map(log => (
                        <div key={log.id} className="flex items-center gap-3 px-4 py-2.5 border-b border-surface-bg last:border-0">
                            <span className="text-[10px] font-mono text-text-faint w-16 flex-shrink-0">{log.time}</span>
                            <span className="text-xs font-semibold text-text-primary flex-shrink-0 w-28 truncate">{log.user}</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded flex-shrink-0"
                                style={{ background: '#EBF5FA', color: '#00B4D8' }}>{log.action}</span>
                            <span className="flex-1 text-[10px] font-mono text-text-muted truncate">{log.resource}</span>
                            <span className="text-[9px] font-mono px-2 py-0.5 rounded-full flex-shrink-0"
                                style={{
                                    background: log.status === 'success' ? '#EBFAF5' : '#FEE2E2',
                                    color: log.status === 'success' ? '#06D6A0' : '#DC2626'
                                }}>
                                {log.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}