import { Palette, Sun, Moon, Sparkles, CloudSun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme, type Theme } from "@/components/theme-provider";
import { useTranslation } from "react-i18next";

const themes: { value: Theme; icon: typeof Sun; colors: string[] }[] = [
  {
    value: "default",
    icon: Sun,
    colors: ["bg-[hsl(350,65%,55%)]", "bg-[hsl(45,30%,98%)]", "bg-[hsl(180,35%,45%)]"],
  },
  {
    value: "night",
    icon: Moon,
    colors: ["bg-[hsl(350,65%,58%)]", "bg-[hsl(25,20%,8%)]", "bg-[hsl(180,40%,42%)]"],
  },
  {
    value: "bright",
    icon: Sparkles,
    colors: ["bg-[hsl(330,80%,50%)]", "bg-[hsl(0,0%,100%)]", "bg-[hsl(175,70%,42%)]"],
  },
  {
    value: "pastel",
    icon: CloudSun,
    colors: ["bg-[hsl(270,50%,70%)]", "bg-[hsl(260,30%,97%)]", "bg-[hsl(160,40%,55%)]"],
  },
];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();

  const themeLabels: Record<Theme, string> = {
    default: t("themes.default", "Warm & Classic"),
    night: t("themes.night", "Night Mode"),
    bright: t("themes.bright", "Bright & Colorful"),
    pastel: t("themes.pastel", "Soft Pastel"),
  };

  const currentTheme = themes.find((th) => th.value === theme) || themes[0];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" data-testid="button-theme-toggle">
          <CurrentIcon className="h-5 w-5" />
          <span className="sr-only">{t("themes.switchTheme", "Switch theme")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {themes.map((th) => {
          const Icon = th.icon;
          const isActive = theme === th.value;
          return (
            <DropdownMenuItem
              key={th.value}
              onClick={() => setTheme(th.value)}
              className={`flex items-center gap-3 cursor-pointer ${isActive ? "bg-accent/20 font-medium" : ""}`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{themeLabels[th.value]}</span>
              <div className="flex gap-0.5">
                {th.colors.map((color, i) => (
                  <span
                    key={i}
                    className={`h-3 w-3 rounded-full border border-border/50 ${color}`}
                  />
                ))}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
