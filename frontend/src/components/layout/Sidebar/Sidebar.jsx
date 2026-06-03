import { Brain, PanelLeftClose, PanelLeftOpen } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { NAV_BOTTOM, NAV_MAIN } from '@/config/nav.config'
import { SidebarNavItem } from './SidebarNavItem'

export function Sidebar({ collapsed, onToggle }) {
    return (
        <TooltipProvider>
            <aside
                className={cn(
                    'flex h-full flex-col border-r border-sidebar-border bg-sidebar',
                    'transition-[width] duration-300 ease-in-out',
                    collapsed ? 'w-14' : 'w-56',
                )}
            >
                {/* Logo */}
                <div
                    className={cn(
                        'flex h-12 shrink-0 items-center border-b border-sidebar-border px-3',
                        collapsed ? 'justify-center' : 'gap-2.5',
                    )}
                >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10">
                        <Brain className="h-4 w-4 text-primary" />
                    </div>
                    {!collapsed && (
                        <span className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">
                            PrepAI
                        </span>
                    )}
                </div>

                {/* Main nav */}
                <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2">
                    {NAV_MAIN.map((item) => (
                        <SidebarNavItem key={item.key} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                <Separator className="bg-sidebar-border" />

                {/* Bottom nav */}
                <nav className="flex flex-col gap-0.5 p-2">
                    {NAV_BOTTOM.map((item) => (
                        <SidebarNavItem key={item.key} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                {/* Collapse toggle */}
                <div className="border-t border-sidebar-border p-2">
                    <button
                        onClick={onToggle}
                        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        className={cn(
                            'flex h-7 w-full items-center rounded-md px-2 text-xs font-medium',
                            'text-sidebar-foreground/50 transition-colors',
                            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            collapsed ? 'justify-center' : 'gap-2',
                        )}
                    >
                        {collapsed ? (
                            <PanelLeftOpen className="h-4 w-4 shrink-0" />
                        ) : (
                            <>
                                <PanelLeftClose className="h-4 w-4 shrink-0" />
                                <span>Collapse</span>
                            </>
                        )}
                    </button>
                </div>
            </aside>
        </TooltipProvider>
    )
}
