import { Search, User } from "lucide-react";
import { NavLink } from "react-router-dom";

interface HeaderProps {
  onAuthIconClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAuthIconClick }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="flex items-center gap-4 text-white">
        <svg
          className="h-10 w-10 text-red-500"
          fill="none"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
        </svg>
        <h2 className="text-white text-2xl font-bold tracking-widest uppercase font-orbitron">
          Ascendium
        </h2>
      </div>

      <nav className="hidden lg:flex flex-1 justify-center gap-10">
        {[
          { label: "Home", to: "/" },
          { label: "Teams", to: "/teams" },
          { label: "Recruitment", to: "/recruitment" },
          { label: "Tournaments", to: "/tournaments" },
          { label: "Community", to: "/community" },
        ].map(({ label, to }) => (
          <NavLink
            key={to}
            to={to}
            className="text-white/80 hover:text-red-500 transition-all duration-300 text-lg font-medium tracking-wide relative group"
          >
            {label}
            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-red-500 hover:text-black border-2 border-transparent hover:border-red-700">
          <Search className="h-6 w-6" />
        </button>
        <button
          onClick={onAuthIconClick}
          className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-cyan-400 hover:text-black border-2 border-transparent hover:border-cyan-600"
        >
          <User className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;
