import { ArrowRight } from 'lucide-react';

const Footer = () => {
  const navigationLinks = [
    { name: "About Us", href: "#" },
    { name: "Teams", href: "#" },
    { name: "Contact", href: "#" },
    { name: "Sponsors", href: "#" }
  ];

  const supportLinks = [
    { name: "FAQ", href: "#" },
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Press", href: "#" }
  ];

  return (
    <footer className="bg-black border-t border-white/10 relative overflow-hidden footer-glow">
      <div className="absolute inset-0 z-0">
        <div className="absolute -bottom-1/2 -left-1/4 w-full h-full animate-aurora bg-gradient-to-tr from-red-500/20 via-transparent to-cyan-400/20 opacity-50" />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 py-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="flex items-center gap-4">
              <svg 
                className="h-12 w-12 text-red-500 text-shadow-red" 
                fill="none" 
                viewBox="0 0 48 48" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor" />
              </svg>
              <h2 className="text-white text-3xl font-bold tracking-widest uppercase font-orbitron">
                Ascendium
              </h2>
            </div>
            <p className="mt-4 text-white/60 max-w-xs">
              Forging legends in the digital arena. Join the ascent and become part of the future of esports.
            </p>
          </div>
          
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white font-orbitron">
                Navigate
              </h3>
              <nav className="mt-4 flex flex-col gap-3">
                {navigationLinks.map((link, index) => (
                  <a 
                    key={index}
                    className="text-white/60 hover:text-red-500 hover:translate-x-1 transition-all duration-300" 
                    href={link.href}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-white font-orbitron">
                Support
              </h3>
              <nav className="mt-4 flex flex-col gap-3">
                {supportLinks.map((link, index) => (
                  <a 
                    key={index}
                    className="text-white/60 hover:text-cyan-400 hover:translate-x-1 transition-all duration-300" 
                    href={link.href}
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div className="col-span-2 md:col-span-2">
              <h3 className="text-lg font-bold uppercase tracking-wider text-white font-orbitron">
                Join Our Newsletter
              </h3>
              <p className="mt-4 text-white/60">
                Get the latest updates, match schedules, and exclusive content.
              </p>
              <form className="mt-4 flex">
                <input 
                  className="flex-grow bg-white/5 border border-white/20 rounded-l-md px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all" 
                  placeholder="Enter your email" 
                  type="email"
                />
                <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-4 py-2 rounded-r-md transition-all duration-300 transform hover:scale-105">
                  <ArrowRight />
                </button>
              </form>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm tracking-wider">
            © 2024 Ascendium E-Sports. All Rights Reserved.
          </p>
          
          <div className="flex justify-center gap-4">
            {/* Social Media Icons */}
            <a className="group" href="#">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:border-red-500 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)]">
                <svg aria-hidden="true" className="h-6 w-6 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </div>
            </a>
            
            <a className="group" href="#">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-400 group-hover:border-cyan-400 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_-5px_rgba(34,211,238,0.4)]">
                <svg className="w-6 h-6 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37c-1.53-.69-3.17-1.2-4.885-1.47a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.64 18.64 0 0 0-5.487 0 12.404 12.404 0 0 0-.617-1.23A.077.077 0 0 0 8.562 2.9c-1.714.27-3.354.78-4.885 1.47a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418Z" />
                </svg>
              </div>
            </a>
            
            <a className="group" href="#">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-red-500 group-hover:border-red-500 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_-5px_rgba(239,68,68,0.4)]">
                <svg aria-hidden="true" className="h-6 w-6 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </div>
            </a>
            
            <a className="group" href="#">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 group-hover:bg-cyan-400 group-hover:border-cyan-400 group-hover:-translate-y-1 group-hover:shadow-[0_10px_20px_-5px_rgba(34,211,238,0.4)]">
                <svg aria-hidden="true" className="h-6 w-6 text-white/60 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-.962 6.502-.378 1.83-.891 2.156-1.649 2.156-.562 0-.91-.364-.91-.364l-2.907-2.156-1.081-.816-.452-.371s.165-.123.356-.216c.356-.165.707-.31.995-.474a.65.65 0 0 0 .273-.38c.036-.11.017-.224-.054-.312-.072-.089-.18-.142-.295-.142-.416 0-.622.163-.829.256-.247.111-.43.199-.693.287-.148.05-.342.085-.518.045l-3.51-.784c-.168-.037-.322-.096-.463-.182a.619.619 0 0 1-.225-.26.513.513 0 0 1-.039-.327c.044-.142.134-.248.215-.33.09-.093.222-.154.33-.185.265-.077.494-.096.764-.149.23-.045.537-.104.993-.216 2.506-.608 10.756-2.807 10.756-2.807.143-.044.287-.085.418-.103Z" />
                </svg>
              </div>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;