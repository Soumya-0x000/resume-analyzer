import { NavLink } from 'react-router'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

export function SidebarNavItem({ item, collapsed }) {
    const Icon = item.icon

    const link = (
        <NavLink
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors duration-150',
                    'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                    isActive && 'bg-sidebar-accent text-sidebar-primary font-semibold',
                    collapsed && 'justify-center px-2',
                )
            }
        >
            <Icon className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
        </NavLink>
    )

    if (!collapsed) return link

    return (
        <Tooltip>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
        </Tooltip>
    )
}
