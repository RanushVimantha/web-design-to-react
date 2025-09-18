import { Search, User } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-white/10 glass-bg px-10 py-4">
      <div className="flex items-center gap-4 text-white">
        <svg 
          className="h-10 w-10 text-red-500 text-shadow-red" 
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
        <a className="nav-link nav-link-red" href="#">
          Home
        </a>
        <a className="nav-link nav-link-cyan" href="#">
          Teams
        </a>
        <a className="nav-link nav-link-cyan" href="#">
          Recruitment
        </a>
        <a className="nav-link nav-link-cyan" href="#">
          Tournaments
        </a>
        <a className="nav-link nav-link-cyan" href="#">
          Community
        </a>
      </nav>
      
      <div className="flex items-center gap-4">
        <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-red-500 hover:text-black border-2 border-transparent hover:border-red-700">
          <Search className="text-2xl" />
        </button>
        <button className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white/5 text-white transition-all duration-300 hover:bg-cyan-400 hover:text-black border-2 border-transparent hover:border-cyan-600">
          <User className="text-2xl" />
        </button>
      </div>
    </header>
  );
};

export default Header;