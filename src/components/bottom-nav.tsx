import { Link, useLocation } from "@tanstack/react-router";
import { Home, BookOpen, HeartHandshake, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { rastrear } from "@/lib/track";

type NavItem = { to: "/" | "/recursos" | "/apoio" | "/perfil"; label: string; icon: typeof Home; exact?: boolean };
const items: NavItem[] = [
  { to: "/", label: "Início", icon: Home, exact: true },
  { to: "/recursos", label: "Recursos", icon: BookOpen },
  { to: "/apoio", label: "Apoio", icon: HeartHandshake },
  { to: "/perfil", label: "Perfil", icon: User },
];

export function BottomNav() {
  const { pathname } = useLocation();
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-[480px] -translate-x-1/2 border-t border-border bg-card/95 backdrop-blur-md"
    >
      <ul className="grid grid-cols-4">
        {items.map((it) => {
          const active = it.exact ? pathname === it.to : pathname.startsWith(it.to);
          const Icon = it.icon;
          return (
            <li key={it.to}>
              <Link
                to={it.to}
                onClick={() => rastrear("clique", `Menu · ${it.label}`)}
                className={cn(
                  "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-colors focus-visible:outline-none",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} aria-hidden="true" />
                <span>{it.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
