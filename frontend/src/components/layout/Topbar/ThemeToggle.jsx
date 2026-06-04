import { Monitor, Moon, Sun } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTheme } from "@/context/theme/useTheme";

const OPTIONS = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
];

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={theme}
            onValueChange={(val) => {
                if (val) setTheme(val);
            }}
            aria-label="Theme"
        >
            {OPTIONS.map(({ value, icon, label }) => {
                const Icon = icon;
                return (
                    <ToggleGroupItem key={value} value={value} aria-label={label} title={label}>
                        <Icon className="h-3.5 w-3.5" />
                    </ToggleGroupItem>
                );
            })}
        </ToggleGroup>
    );
}
