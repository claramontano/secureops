import { Link, useLocation } from 'react-router-dom'

const modules = [
    { path: '/siem', label: 'SIEM', tag: 'SOC' },
    { path: '/incidents', label: 'Incidents', tag: 'IR' },
    { path: '/vulns', label: 'Vulns', tag: 'NIST' },
    { path: '/grc', label: 'GRC', tag: 'GRC' },
    { path: '/iam', label: 'IAM', tag: 'IAM' },
    { path: '/phish', label: 'Phish', tag: 'Anti-phish' },
    { path: '/cipher', label: 'Cipher', tag: 'Crypto' },
    { path: '/vault', label: 'Vault', tag: 'AES-256' },
    { path: '/network', label: 'Network', tag: 'NetSec' },
    { path: '/mitre', label: 'MITRE', tag: 'ATT&CK' },
]

function Navbar() {
    const location = useLocation()
    const isHome = location.pathname === '/'

    return (
        <header className="bg-surface-nav border-b border-border sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 no-underline">
                    <div className="w-7 h-7 bg-brand-orange rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                            <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" stroke="#FDF8F4" strokeWidth="1.5" />
                            <circle cx="8" cy="8" r="2" fill="#FDF8F4" />
                        </svg>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-text-primary leading-none">SecureOps</div>
                        <div className="text-[10px] font-mono text-text-muted leading-none mt-0.5">v1.0.0</div>
                    </div>
                </Link>

                {/* Nav links — solo visibles fuera del home */}
                {!isHome && (
                    <nav className="flex items-center gap-1">
                        {modules.map(m => (
                            <Link
                                key={m.path}
                                to={m.path}
                                className={`px-2 py-1 rounded text-[11px] font-mono transition-colors no-underline ${location.pathname === m.path
                                    ? 'bg-brand-orange text-white'
                                    : 'text-text-muted hover:text-text-primary hover:bg-surface-card'
                                    }`}
                            >
                                {m.tag}
                            </Link>
                        ))}
                    </nav>
                )}

                {/* Status */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-text-muted bg-surface-card border border-border rounded-full px-3 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand-orange"></span>
                        Sistema operativo
                    </div>
                </div>

            </div>
        </header>
    )
}

export default Navbar