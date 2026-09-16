import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="border-b border-border bg-card px-5 pb-5 pt-6">
      <Link to="/" className="flex min-h-11 items-center gap-3 rounded-md focus-visible:outline-none">
        <img src={logo} alt="" className="h-11 w-11 shrink-0" width={44} height={44} />
        <div className="flex flex-col leading-tight">
          <span className="text-xl font-bold text-foreground">
            Conecta<span className="text-primary">Mente</span>
          </span>
          {subtitle ? (
            <span className="mt-1 text-sm text-muted-foreground">{subtitle}</span>
          ) : null}
        </div>
      </Link>
    </header>
  );
}
