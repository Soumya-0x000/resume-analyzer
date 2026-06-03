import { LogOut, Settings, UserRound } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth/useAuth'

function getInitials(str) {
    if (!str) return '?'
    return str
        .split(/[\s_.-]+/)
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? '')
        .join('')
}

export function AccountMenu() {
    const { user, logoutUser } = useAuth()

    const displayName = user?.username || user?.name || 'User'
    const email = user?.email ?? ''

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 text-xs outline-none transition-colors hover:bg-accent focus-visible:ring-1 focus-visible:ring-ring">
                    <Avatar className="h-7 w-7">
                        <AvatarImage src={user?.avatar} alt={displayName} />
                        <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate font-medium sm:block">{displayName}</span>
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52">
                {/* User identity header */}
                <DropdownMenuLabel>
                    <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} alt={displayName} />
                            <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate font-semibold text-foreground">{displayName}</span>
                            {email && (
                                <span className="truncate font-normal text-muted-foreground">{email}</span>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <UserRound />
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <Settings />
                        Settings
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    variant="destructive"
                    onSelect={() => logoutUser('Signed out successfully.')}
                >
                    <LogOut />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
