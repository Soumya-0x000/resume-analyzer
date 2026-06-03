import * as React from 'react'
import { DropdownMenu as DropdownMenuPrimitive } from 'radix-ui'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

function DropdownMenu({ ...props }) {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuTrigger({ ...props }) {
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuPortal({ ...props }) {
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuContent({ className, sideOffset = 4, ...props }) {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md',
                    'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
                    'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                    'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                    className,
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    )
}

function DropdownMenuGroup({ ...props }) {
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuItem({ className, inset, variant = 'default', ...props }) {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                'data-inset:pl-8',
                '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-3.5',
                variant === 'destructive' &&
                    'text-destructive focus:bg-destructive/10 focus:text-destructive',
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuCheckboxItem({ className, children, checked, ...props }) {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            className={cn(
                'relative flex cursor-pointer select-none items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-xs outline-none transition-colors',
                'focus:bg-accent focus:text-accent-foreground',
                'data-disabled:pointer-events-none data-disabled:opacity-50',
                className,
            )}
            checked={checked}
            {...props}
        >
            <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <CheckIcon className="size-3.5" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    )
}

function DropdownMenuSub({ ...props }) {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }) {
    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                'flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-xs outline-none transition-colors',
                'focus:bg-accent data-open:bg-accent',
                'data-inset:pl-8',
                '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-3.5',
                className,
            )}
            {...props}
        >
            {children}
            <ChevronRightIcon className="ml-auto" />
        </DropdownMenuPrimitive.SubTrigger>
    )
}

function DropdownMenuSubContent({ className, ...props }) {
    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'z-50 min-w-[8rem] overflow-hidden rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-lg',
                'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95',
                'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95',
                'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
                'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuLabel({ className, inset, ...props }) {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn(
                'px-2 py-1.5 text-xs font-medium text-muted-foreground data-inset:pl-8',
                className,
            )}
            {...props}
        />
    )
}

function DropdownMenuSeparator({ className, ...props }) {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn('-mx-1 my-1 h-px bg-border', className)}
            {...props}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
}
