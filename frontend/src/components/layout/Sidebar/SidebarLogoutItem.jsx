import { LogOut } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useLogout } from '@/features/auth/services/auth.queries'

export function SidebarLogoutItem({ collapsed }) {
    const { mutate: logoutUser, isPending } = useLogout()

    const button = (
        <button
            type="button"
            onClick={() => logoutUser()}
            disabled={isPending}
            className={cn(
                'flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-xs font-medium transition-colors duration-150',
                'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive',
                'disabled:pointer-events-none disabled:opacity-50',
                collapsed && 'justify-center px-2',
            )}
        >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span className="truncate">Logout</span>}
        </button>
    )

    if (!collapsed) return button

    return (
        <Tooltip>
            <TooltipTrigger asChild>{button}</TooltipTrigger>
            <TooltipContent side="right">Logout</TooltipContent>
        </Tooltip>
    )
}
