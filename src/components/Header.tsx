import { Search, User } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onAuthIconClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthIconClick }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const publicLinks = [
    { label: "Home", to: "/" },
    { label: "Teams", to: "/teams" },
    { label: "Tournaments", to: "/tournaments" },
    { label: "Partners", to: "/partners" },
    { label: "Recruit", to: "/recruit" },
    { label: "Contact", to: "/contact" },
  ];
  
  const authLinks = [
    { label: "My Teams", to: "/my-teams" },
  ];
  
  const links = user ? [...publicLinks.slice(0, 2), ...authLinks, ...publicLinks.slice(2)] : publicLinks;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      {/* Logo */}
      <NavLink to="/" className="flex items-center gap-4 text-white">
        <img src="/src/assets/ascendium-logo.png" alt="Ascendium Logo" className="h-12 w-12" />
        <h2 className="text-white text-2xl font-bold tracking-widest uppercase font-orbitron">
          Ascendium
        </h2>
      </NavLink>

      {/* Navigation links */}
      <nav className="hidden lg:flex flex-1 justify-center gap-10">
        {links.map(({ label, to }) => (
          <NavLink key={to} to={to} className="relative group text-lg font-medium tracking-wide">
            {({ isActive }) => (
              <>
                <span
                  className={`transition-colors duration-300 ${
                    isActive ? "text-red-500" : "text-white/80 group-hover:text-red-500"
                  }`}
                >
                  {label}
                </span>
                <span
                  className={`absolute left-0 -bottom-1 w-full h-0.5 transition-all duration-300 ${
                    isActive
                      ? "bg-red-500 scale-x-100"
                      : "bg-cyan-400 scale-x-0 group-hover:scale-x-100 group-hover:bg-red-500"
                  }`}
                />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Search and user (login vs dropdown) */}
      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-red-500 hover:text-black border-2 border-transparent hover:border-red-700">
          <Search className="h-6 w-6" />
        </button>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-cyan-400 hover:text-black border-2 border-transparent hover:border-cyan-600">
                <User className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onSelect={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <button
            onClick={onAuthIconClick}
            className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-cyan-400 hover:text-black border-2 border-transparent hover:border-cyan-600"
          >
            <User className="h-6 w-6" />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
