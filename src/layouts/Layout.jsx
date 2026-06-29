import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Layout() {
    return (
        <div className="min-h-screen bg-surface-bg text-text-primary font-sans">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default Layout