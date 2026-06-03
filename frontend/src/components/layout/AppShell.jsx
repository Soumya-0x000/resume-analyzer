import { Outlet } from 'react-router'

import { useSidebarState } from '@/hooks/useSidebarState'
import { Sidebar } from './Sidebar/Sidebar'
import { Topbar } from './Topbar/Topbar'

export function AppShell() {
    const { collapsed, toggle } = useSidebarState()

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar collapsed={collapsed} onToggle={toggle} />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
