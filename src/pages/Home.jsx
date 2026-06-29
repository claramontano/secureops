import { useNavigate } from 'react-router-dom'

const modules = [
    {
        path: '/siem',
        name: 'SIEM Dashboard',
        desc: 'Eventos de seguridad en tiempo real',
        tag: 'SOC',
        color: '#00B4D8',
        border: '#B8D8E8',
        bg: '#EBF5FA',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="8" y="8" width="60" height="38" rx="2" stroke="#00B4D850" strokeWidth="1" />
                <rect x="12" y="12" width="16" height="5" rx="1" fill="#00B4D830" />
                <rect x="12" y="20" width="52" height="1" fill="#00B4D825" />
                <rect x="12" y="25" width="36" height="2" rx="1" fill="#00B4D860" />
                <rect x="12" y="30" width="26" height="2" rx="1" fill="#F9731660" />
                <rect x="12" y="35" width="44" height="2" rx="1" fill="#00B4D840" />
                <rect x="12" y="40" width="20" height="2" rx="1" fill="#00B4D830" />
                <circle cx="60" cy="14" r="4" fill="#F9731640" />
                <circle cx="60" cy="14" r="2" fill="#F97316" />
            </svg>
        )
    },
    {
        path: '/incidents',
        name: 'Incident Response',
        desc: 'Ciclo de vida de incidentes',
        tag: 'IR',
        color: '#F97316',
        border: '#E8C4A0',
        bg: '#FDF0E6',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <circle cx="38" cy="27" r="15" stroke="#F9731630" strokeWidth="1" />
                <circle cx="38" cy="27" r="9" stroke="#F9731650" strokeWidth="1" />
                <path d="M38 18v9l5 4" stroke="#F97316" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="38" cy="27" r="2" fill="#F97316" />
                <path d="M38 12v3M38 39v3M23 27h-3M54 27h3" stroke="#F9731640" strokeWidth="1" />
            </svg>
        )
    },
    {
        path: '/vulns',
        name: 'Vuln Manager',
        desc: 'CVEs y scoring CVSS visual',
        tag: 'NIST',
        color: '#D4A017',
        border: '#E8D89A',
        bg: '#FDFAEC',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <circle cx="38" cy="25" r="12" stroke="#D4A01740" strokeWidth="1" />
                <path d="M31 25a7 7 0 1014 0 7 7 0 00-14 0z" stroke="#D4A01750" strokeWidth="1" />
                <circle cx="38" cy="25" r="3" fill="#D4A01770" />
                <line x1="38" y1="8" x2="38" y2="13" stroke="#D4A01760" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="52" y1="13" x2="48" y2="17" stroke="#D4A01750" strokeWidth="1.5" strokeLinecap="round" />
                <rect x="12" y="42" width="52" height="2" rx="1" fill="#D4A01740" />
                <rect x="12" y="46" width="30" height="2" rx="1" fill="#F9731650" />
            </svg>
        )
    },
    {
        path: '/grc',
        name: 'GRC Manager',
        desc: 'ISO 27001 y matriz de riesgos',
        tag: 'GRC',
        color: '#06D6A0',
        border: '#A0E0CC',
        bg: '#EBFAF5',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="14" y="10" width="48" height="34" rx="2" stroke="#06D6A040" strokeWidth="1" />
                <rect x="18" y="14" width="20" height="3" rx="1" fill="#06D6A050" />
                <rect x="18" y="20" width="40" height="2" rx="1" fill="#06D6A040" />
                <rect x="18" y="25" width="32" height="2" rx="1" fill="#06D6A035" />
                <rect x="18" y="30" width="36" height="2" rx="1" fill="#06D6A040" />
                <rect x="18" y="35" width="24" height="2" rx="1" fill="#06D6A030" />
                <circle cx="54" cy="16" r="3" fill="#06D6A060" />
                <path d="M52.5 16l1 1 2-2" stroke="#06D6A0" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        path: '/iam',
        name: 'IAM Simulator',
        desc: 'Roles, permisos y JWT decoder',
        tag: 'IAM',
        color: '#B24BF3',
        border: '#D4B0F0',
        bg: '#F7EEFE',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <circle cx="38" cy="19" r="7" stroke="#B24BF350" strokeWidth="1" />
                <circle cx="38" cy="19" r="3" fill="#B24BF370" />
                <path d="M24 44c0-7.7 6.3-14 14-14s14 6.3 14 14" stroke="#B24BF340" strokeWidth="1" />
                <rect x="20" y="34" width="8" height="5" rx="1" fill="#B24BF340" />
                <rect x="48" y="34" width="8" height="5" rx="1" fill="#B24BF340" />
                <path d="M28 36.5h20" stroke="#B24BF340" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
        )
    },
    {
        path: '/phish',
        name: 'PhishDetect',
        desc: 'Detección de phishing y URLs',
        tag: 'Anti-phish',
        color: '#F97316',
        border: '#E8C4A0',
        bg: '#FDF0E6',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="14" y="13" width="48" height="28" rx="2" stroke="#F9731640" strokeWidth="1" />
                <path d="M14 20l24 13 24-13" stroke="#F9731650" strokeWidth="1" />
                <rect x="26" y="26" width="24" height="2" rx="1" fill="#F9731640" />
                <rect x="30" y="31" width="16" height="2" rx="1" fill="#F9731635" />
                <circle cx="56" cy="37" r="5" fill="#FDF0E6" stroke="#F9731670" strokeWidth="1" />
                <path d="M56 34.5v2.5M56 38.5v.5" stroke="#F97316" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        path: '/cipher',
        name: 'CipherLab',
        desc: 'Laboratorio de criptografía',
        tag: 'Crypto',
        color: '#00B4D8',
        border: '#B8D8E8',
        bg: '#EBF5FA',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="10" y="15" width="24" height="24" rx="2" stroke="#00B4D840" strokeWidth="1" />
                <rect x="42" y="15" width="24" height="24" rx="2" stroke="#00B4D840" strokeWidth="1" />
                <rect x="14" y="19" width="16" height="2" rx="1" fill="#00B4D860" />
                <rect x="14" y="24" width="12" height="2" rx="1" fill="#00B4D840" />
                <rect x="14" y="29" width="14" height="2" rx="1" fill="#00B4D850" />
                <rect x="46" y="19" width="16" height="2" rx="1" fill="#06D6A060" />
                <rect x="46" y="24" width="10" height="2" rx="1" fill="#06D6A040" />
                <rect x="46" y="29" width="14" height="2" rx="1" fill="#06D6A050" />
                <path d="M34 27h8" stroke="#00B4D870" strokeWidth="1" strokeDasharray="2 2" />
                <path d="M38 24.5l3 2.5-3 2.5" stroke="#00B4D8" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
        )
    },
    {
        path: '/vault',
        name: 'Vault',
        desc: 'Gestor de contraseñas AES-256',
        tag: 'AES-256',
        color: '#06D6A0',
        border: '#A0E0CC',
        bg: '#EBFAF5',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="20" y="13" width="36" height="28" rx="2" stroke="#06D6A040" strokeWidth="1" />
                <rect x="26" y="21" width="24" height="12" rx="2" stroke="#06D6A050" strokeWidth="1" />
                <circle cx="38" cy="27" r="4" stroke="#06D6A060" strokeWidth="1" />
                <circle cx="38" cy="27" r="1.5" fill="#06D6A090" />
                <rect x="36" y="19" width="4" height="3" rx="1" fill="#06D6A050" />
                <rect x="28" y="37" width="8" height="2" rx="1" fill="#06D6A040" />
                <rect x="40" y="37" width="8" height="2" rx="1" fill="#06D6A040" />
            </svg>
        )
    },
    {
        path: '/network',
        name: 'Network Analyzer',
        desc: 'Tráfico y anomalías de red',
        tag: 'NetSec',
        color: '#D4A017',
        border: '#E8D89A',
        bg: '#FDFAEC',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <circle cx="38" cy="27" r="4" fill="#D4A01760" />
                <circle cx="18" cy="17" r="3" fill="#D4A01750" />
                <circle cx="58" cy="17" r="3" fill="#D4A01750" />
                <circle cx="18" cy="37" r="3" fill="#D4A01740" />
                <circle cx="58" cy="37" r="3" fill="#D4A01740" />
                <circle cx="38" cy="9" r="2" fill="#D4A01750" />
                <path d="M38 23L18 17M38 23L58 17M38 23L18 37M38 23L58 37M38 23L38 11" stroke="#D4A01740" strokeWidth="1" />
                <path d="M18 17L18 37M58 17L58 37" stroke="#D4A01730" strokeWidth="1" strokeDasharray="2 2" />
            </svg>
        )
    },
    {
        path: '/mitre',
        name: 'MITRE Explorer',
        desc: 'ATT&CK framework interactivo',
        tag: 'ATT&CK',
        color: '#B24BF3',
        border: '#D4B0F0',
        bg: '#F7EEFE',
        illustration: (
            <svg viewBox="0 0 76 58" width="110" height="90" fill="none">
                <rect x="10" y="10" width="14" height="8" rx="1" fill="#B24BF340" />
                <rect x="28" y="10" width="14" height="8" rx="1" fill="#B24BF340" />
                <rect x="46" y="10" width="14" height="8" rx="1" fill="#B24BF340" />
                <rect x="10" y="22" width="14" height="8" rx="1" fill="#B24BF345" />
                <rect x="28" y="22" width="14" height="8" rx="1" fill="#F9731635" />
                <rect x="46" y="22" width="14" height="8" rx="1" fill="#B24BF340" />
                <rect x="10" y="34" width="14" height="8" rx="1" fill="#B24BF335" />
                <rect x="28" y="34" width="14" height="8" rx="1" fill="#B24BF335" />
                <rect x="46" y="34" width="14" height="8" rx="1" fill="#F9731630" />
                <rect x="28" y="22" width="14" height="8" rx="1" stroke="#F9731670" strokeWidth="0.5" />
            </svg>
        )
    },
]

function Home() {
    const navigate = useNavigate()

    return (
        <div className="max-w-7xl mx-auto px-4 py-10">

            {/* Hero */}
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 text-xs font-mono text-text-muted bg-surface-card border border-border rounded-full px-4 py-1.5 mb-5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                    Plataforma de ciberseguridad
                </div>
                <h1 className="text-4xl font-extrabold text-text-primary leading-tight mb-3">
                    Operaciones de seguridad<br />
                    <span className="text-brand-orange">en un solo lugar</span>
                </h1>
                <p className="text-text-secondary text-sm max-w-md mx-auto mb-8">
                    10 herramientas profesionales para analistas, equipos SOC y auditores de seguridad.
                </p>

                {/* Stats */}
                <div className="flex justify-center gap-10">
                    {[
                        { num: '10', label: 'Módulos' },
                        { num: 'AES-256', label: 'Cifrado real' },
                        { num: 'NIST', label: 'API integrada' },
                        { num: '0', label: 'Backend' },
                    ].map(s => (
                        <div key={s.label} className="text-center">
                            <div className="text-lg font-bold font-mono text-brand-orange">{s.num}</div>
                            <div className="text-xs text-text-muted mt-0.5">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Módulos */}
            <div>
                <p className="text-xs font-mono text-text-muted mb-4">// módulos disponibles</p>
                <div className="grid grid-cols-5 gap-2">
                    {modules.map(m => (
                        <div
                            key={m.path}
                            onClick={() => navigate(m.path)}
                            className="rounded-xl overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
                            style={{ background: '#FFFFFF', border: `1px solid ${m.border}` }}
                        >
                            {/* Ilustración */}
                            <div className="h-[100px] flex items-center justify-center" style={{ background: m.bg }}>
                                {m.illustration}
                            </div>

                            {/* Info */}
                            <div className="p-2.5">
                                <p className="text-sm font-bold text-text-primary mb-1">{m.name}</p>
                                <p className="text-xs text-text-muted leading-snug mb-2">{m.desc}</p>
                                <div className="flex items-center justify-between">
                                    <span
                                        className="text-xs font-mono px-2 py-0.5 rounded-full"
                                        style={{
                                            background: m.color + '20',
                                            color: m.color,
                                            border: `1px solid ${m.color}40`
                                        }}
                                    >
                                        {m.tag}
                                    </span>
                                    <span className="text-xs text-text-faint">→</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home