import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Menu, 
  LogOut, 
  User as UserIcon, 
  Instagram, 
  Facebook
} from 'lucide-react';
import { useAuth } from '../components/AuthContext';
import { NAV_ITEMS } from '../constants';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { user, isAdmin, signIn, logout } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [...NAV_ITEMS];
  if (user) {
    navItems.push({ label: 'My Portal', href: '/portal' });
  }
  if (isAdmin) {
    navItems.push({ label: 'Admin', href: '/admin' });
  }

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-400/50 rounded-lg flex items-center justify-center backdrop-blur-md bg-white/5">
            <span className="text-amber-400 font-bold text-lg">B</span>
          </div>
          <span className="text-2xl font-serif font-bold tracking-widest text-white uppercase">
            BRIJ <span className="text-amber-400">DHARA</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isInternal = item.href.startsWith('/');
            const isHash = item.href.startsWith('#');
            
            if (isInternal) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`text-[10px] uppercase tracking-widest transition-colors font-semibold ${
                    location.pathname === item.href ? 'text-amber-400' : 'text-white/70 hover:text-amber-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            }
            
            return (
              <Link 
                key={item.label}
                to={`/${isHash ? item.href : ''}`}
                onClick={(e) => {
                  if (location.pathname === '/') {
                    e.preventDefault();
                    const id = item.href.replace('#', '');
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else if (item.href === '#') {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className="text-[10px] uppercase tracking-widest text-white/70 hover:text-amber-400 transition-colors font-semibold"
              >
                {item.label}
              </Link>
            );
          })}
          
          <Link 
            to="/contact"
            className={`bg-white/10 backdrop-blur-md border border-white/20 px-5 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-amber-400 hover:text-black transition-all duration-300 rounded-sm ${
              location.pathname === '/contact' ? 'bg-amber-400 text-black border-amber-400' : 'text-white'
            }`}
          >
            Connect
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full" />
                ) : (
                  <UserIcon size={14} className="text-amber-400" />
                )}
                <span className="text-[10px] text-white/70 font-bold uppercase tracking-wider line-clamp-1 max-w-[80px]">
                  {user.displayName?.split(' ')[0]}
                </span>
              </div>
              <button 
                onClick={logout}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <button 
              onClick={signIn}
              className="bg-amber-400 text-black px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-white hover:text-black transition-all duration-300 rounded-sm"
            >
              Sign up
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navItems.map((item) => {
                const isInternal = item.href.startsWith('/');
                const isHash = item.href.startsWith('#');
                
                return (
                  <Link
                    key={item.label}
                    to={isInternal ? item.href : `/${isHash ? item.href : ''}`}
                    onClick={(e) => {
                      if (!isInternal && location.pathname === '/') {
                        e.preventDefault();
                        const id = item.href.replace('#', '');
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        } else if (item.href === '#') {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                      setIsMobileMenuOpen(false);
                    }}
                    className={`text-sm uppercase tracking-widest ${
                      location.pathname === item.href ? 'text-amber-400' : 'text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              
              <Link
                to="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-6 py-3 text-sm uppercase tracking-widest font-bold mt-4 text-center rounded-sm transition-colors ${
                  location.pathname === '/contact' ? 'bg-white text-black' : 'bg-amber-400 text-black'
                }`}
              >
                Connect With Us
              </Link>

              {user ? (
                <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-sm uppercase tracking-widest text-red-400 text-left">
                  Log Out
                </button>
              ) : (
                <button onClick={() => { signIn(); setIsMobileMenuOpen(false); }} className="text-sm uppercase tracking-widest text-amber-400 text-left">
                  Sign Up
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="py-20 border-t border-white/10 glass-dark">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 border-2 border-amber-400/50 rounded-lg flex items-center justify-center backdrop-blur-md bg-white/5">
              <span className="text-amber-400 font-bold text-lg">B</span>
            </div>
            <div className="text-2xl font-serif font-bold tracking-widest uppercase text-white">
              BRIJ <span className="text-amber-400">DHARA</span>
            </div>
          </div>
          <p className="text-white/30 text-[11px] uppercase tracking-widest max-w-sm leading-relaxed">
            Redefining real estate in Mathura-Vrindavan with a focus on value, trust, and spiritual heritage.
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4">
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all backdrop-blur-sm text-white">
              <Instagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-amber-400 hover:text-amber-400 transition-all backdrop-blur-sm text-white">
              <Facebook size={18} />
            </a>
          </div>
          <div className="text-white/30 text-[9px] font-mono tracking-tighter uppercase">
            27.4924° N, 77.6737° E • MATHURA, UP
          </div>
        </div>
      </div>
      
      <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between gap-6 text-[9px] uppercase tracking-[0.3em] font-bold text-white/20">
        <div>© 2024 Brij Dhara Realtech. All Rights Reserved.</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-transparent text-white selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-800 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-amber-900/30 blur-[150px]"></div>
      </div>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
