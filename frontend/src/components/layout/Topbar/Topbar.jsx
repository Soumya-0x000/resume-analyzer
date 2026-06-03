import { useLocation } from 'react-router'

import { NAV_BOTTOM, NAV_MAIN } from '@/config/nav.config'
import { AccountMenu } from './AccountMenu'
import { ThemeToggle } from './ThemeToggle'

const ALL_NAV = [...NAV_MAIN, ...NAV_BOTTOM]

function usePageTitle() {
    const { pathname } = useLocation()
    const match = ALL_NAV.find((item) =>
        item.path === '/' ? pathname === '/' : pathname.startsWith(item.path),
    )
    return match?.label ?? 'Dashboard'
}

export function Topbar() {
    const title = usePageTitle()

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
            <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <AccountMenu />
            </div>
        </header>
    )
}
