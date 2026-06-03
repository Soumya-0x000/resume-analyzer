import { Home, FileText, Settings } from 'lucide-react'

export const NAV_MAIN = [
    { key: 'home',    label: 'Home',    path: '/',        icon: Home     },
    { key: 'reports', label: 'Reports', path: '/reports', icon: FileText },
]

export const NAV_BOTTOM = [
    { key: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]
