import { useState } from "react";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ open, onClose }) => {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [name, setName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement your authentication logic here
    console.log("Logging in:", { loginEmail, loginPassword });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: implement your registration logic here
    console.log("Registering:", { name, registerEmail, registerPassword });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4">
        <div className="form-container bg-[var(--dark-card)] p-8 md:p-12 relative flex flex-col justify-center border-2 border-[var(--dark-border)] rounded-lg">
          {/* gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--primary-red)]/20 via-transparent to-transparent opacity-50"></div>
          <div className="relative z-10">
            {/* tabs */}
            <div className="flex mb-8 border-b-2 border-[var(--dark-border)]">
              <button
                className={`tab-button flex-1 ${
                  activeTab === "login" ? "active" : ""
                }`}
                onClick={() => setActiveTab("login")}
              >
                LOGIN
              </button>
              <button
                className={`tab-button flex-1 ${
                  activeTab === "register" ? "active" : ""
                }`}
                onClick={() => setActiveTab("register")}
              >
                REGISTER
              </button>
            </div>
            {/* heading */}
            <h2 className="text-3xl font-bold mb-2 text-white glitch-effect">
              {activeTab === "login" ? "ACCESS GRID" : "REGISTER"}
            </h2>
            <p className="text-[var(--text-muted)] mb-8">
              {activeTab === "login"
                ? "Welcome back, operative."
                : "Join the ranks."}
            </p>
            {/* login form */}
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <input
                    className="form-input-field w-full rounded-lg px-4 py-3 text-white placeholder-[var(--text-muted)]"
                    type="email"
                    id="login-email"
                    placeholder="Email Address / Callsign"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className="form-input-field w-full rounded-lg px-4 py-3 text-white placeholder-[var(--text-muted)]"
                    type="password"
                    id="login-password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--primary-red)] transition-colors duration-300"
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--primary-red)] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 group relative overflow-hidden"
                >
                  <span className="absolute left-0 top-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative">AUTHENTICATE</span>
                </button>
              </form>
            ) : (
              /* registration form */
              <form onSubmit={handleRegister} className="space-y-6">
                <div>
                  <input
                    className="form-input-field w-full rounded-lg px-4 py-3 text-white placeholder-[var(--text-muted)]"
                    type="text"
                    id="register-name"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className="form-input-field w-full rounded-lg px-4 py-3 text-white placeholder-[var(--text-muted)]"
                    type="email"
                    id="register-email"
                    placeholder="Email Address / Callsign"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <input
                    className="form-input-field w-full rounded-lg px-4 py-3 text-white placeholder-[var(--text-muted)]"
                    type="password"
                    id="register-password"
                    placeholder="Password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[var(--primary-red)] text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-red-500/30 group relative overflow-hidden"
                >
                  <span className="absolute left-0 top-0 h-full w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative">REGISTER</span>
                </button>
              </form>
            )}
          </div>
        </div>
        {/* close button */}
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-[var(--dark-card)] h-10 w-10 rounded-full flex items-center justify-center text-white hover:bg-[var(--primary-red)] transition-colors border-2 border-[var(--dark-border)]"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
