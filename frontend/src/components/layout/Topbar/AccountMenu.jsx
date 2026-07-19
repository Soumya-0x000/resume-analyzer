import { LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth/useAuth";
import { useLogout } from "@/features/auth/services/auth.queries";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";

export function AccountMenu() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { mutate: logoutUser } = useLogout();

    const displayName = user?.username || user?.name || "User";
    const email = user?.email ?? "";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="rounded-none" aria-label="Account menu">
                    <Avatar className="h-7 w-7 rounded-none">
                        <AvatarImage src={user?.avatar} alt={displayName} />
                        <AvatarFallback className="rounded-none">
                            {getInitials(displayName)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden max-w-28 truncate font-medium sm:block">
                        {displayName}
                    </span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-52 rounded-none">
                <DropdownMenuLabel className="p-0">
                    <div className="flex items-center gap-2.5 px-2 py-2.5">
                        <Avatar className="h-8 w-8 rounded-none">
                            <AvatarImage src={user?.avatar} alt={displayName} />
                            <AvatarFallback className="rounded-none">
                                {getInitials(displayName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex min-w-0 flex-col gap-0.5">
                            <span className="truncate font-semibold text-foreground">
                                {displayName}
                            </span>
                            {email && (
                                <span className="truncate font-normal text-muted-foreground">
                                    {email}
                                </span>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuItem className="rounded-none" onSelect={() => navigate("/profile")}>
                        <UserRound />
                        Profile
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    className="rounded-none"
                    variant="destructive"
                    onSelect={() => logoutUser()}
                >
                    <LogOut />
                    Sign out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
