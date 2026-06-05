import { useState } from 'react'
import { useLocation } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { RotateCw } from 'lucide-react'

import { NAV_BOTTOM, NAV_MAIN } from '@/config/nav.config'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
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

function RefetchButton() {
    const queryClient = useQueryClient()
    const [isRefetching, setIsRefetching] = useState(false)

    const handleRefetch = async () => {
        setIsRefetching(true)
        await queryClient.refetchQueries()
        setIsRefetching(false)
    }

    return (
        <TooltipProvider delayDuration={300}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={handleRefetch}
                        disabled={isRefetching}
                        aria-label="Refresh all data"
                    >
                        <RotateCw className={cn('h-3.5 w-3.5', isRefetching && 'animate-spin')} />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Refresh all data</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function Topbar() {
    const title = usePageTitle()

    return (
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4">
            <span className="text-sm font-semibold tracking-tight text-foreground">{title}</span>
            <div className="flex items-center gap-3">
                <ThemeToggle />
                <AccountMenu />
                <RefetchButton />
            </div>
        </header>
    )
}
