import logo from "@/assets/logo.png";
import { Link } from "@tanstack/react-router";

export function AppHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className="flex items-center gap-3 px-5 pt-6 pb-3">
      <Link to="/" className="flex items-center gap-3">
        <img src={logo} alt="ConectaMente" className="h-10 w-10" width={40} height={40} />
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-foreground">
            Conecta<span className="text-primary">Mente</span>
          </span>
          {subtitle ? (
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          ) : null}
        </div>
      </Link>
    </header>
  );
}
