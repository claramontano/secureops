import { Outlet } from 'react-router-dom'

function Layout() {
    return (
        <div className="min-h-screen bg-surface-bg text-text-primary font-sans">
            <Outlet />
        </div>
    )
}

export default Layout