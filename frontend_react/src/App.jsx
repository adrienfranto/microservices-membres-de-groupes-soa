import React, { useState, useEffect } from 'react';
import { Users, Briefcase, UserCheck, Menu, X, Home, Settings, Bell, User, Sun, Moon } from 'lucide-react';
import Etudiant from './Etudiant';
import Groupe from './Groupe';
import Travail from './Travail';
import Dashboard from './Dashboard';
import { API_URLS } from './config';







const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [etudiants, setEtudiants] = useState([]);
  
  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Dark Mode Effects
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Responsive sidebar handling
  React.useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchEtudiantsForNavbar = async () => {
    try {
      const response = await fetch(`${API_URLS.ETUDIANT}`);
      const data = await response.json();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur récupération étudiants pour navbar:", error);
    }
  };

  React.useEffect(() => {
    fetchEtudiantsForNavbar();
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: Home, component: Dashboard },
    { id: 'etudiants', label: 'Étudiants', icon: Users, component: Etudiant },
    { id: 'groupes', label: 'Groupes', icon: UserCheck, component: Groupe },
    { id: 'travaux', label: 'Travaux', icon: Briefcase, component: Travail },
  ];

  const ActiveComponent = menuItems.find(item => item.id === activeTab)?.component || Dashboard;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-outfit overflow-hidden transition-colors duration-300">
      
      {/* Mobile Backdrop Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm z-20 animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed md:relative z-30 h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800 shadow-2xl md:shadow-none transition-transform duration-300 ease-in-out flex flex-col ${
          sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
        }`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-xl p-2.5 shadow-lg shadow-indigo-500/30 shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            {(sidebarOpen || !isMobile) && (
              <div className={`transition-opacity duration-300 ${!sidebarOpen && !isMobile ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}>
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-800 dark:from-slate-100 dark:to-indigo-400">API Portal</h1>
                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 tracking-wide uppercase">Workspace</p>
              </div>
            )}
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors">
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                title={!sidebarOpen && !isMobile ? item.label : ""}
                className={`w-full flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <item.icon className={`shrink-0 h-5 w-5 transition-transform duration-200 ${isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'group-hover:scale-110'}`} />
                <span className={`ml-3 whitespace-nowrap transition-all duration-300 ${
                  !sidebarOpen && !isMobile ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto text-sm'
                }`}>
                  {item.label}
                </span>
                
                {isActive && (sidebarOpen || isMobile) && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <button className={`w-full flex items-center px-3 py-3 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors ${!sidebarOpen && !isMobile && 'justify-center'}`}>
            <Settings className="h-5 w-5 shrink-0" />
            <span className={`ml-3 text-sm font-medium transition-all duration-300 ${!sidebarOpen && !isMobile ? 'hidden' : 'block'}`}>Paramètres</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full md:w-auto h-full overflow-hidden relative">
        {/* Top Header */}
        <header className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 z-10 sticky top-0 transition-colors duration-300">
          <div className="flex items-center justify-between px-4 sm:px-8 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm ring-1 ring-slate-200 dark:ring-slate-700 p-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:shadow-md dark:hover:shadow-indigo-500/10"
              >
                <Menu className="h-5 w-5" />
              </button>
              
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-100 tracking-tight hidden sm:block animate-fade-in transition-colors">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h2>
            </div>
            
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
                title={isDarkMode ? "Passer au thème clair" : "Passer au thème sombre"}
              >
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-indigo-500" />}
              </button>

              <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
              </button>
              
              <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block transition-colors"></div>
              
              <div className="flex items-center gap-3 cursor-pointer group">
                <div className="flex flex-col items-end hidden sm:flex">
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {etudiants.length > 0 ? etudiants[0].prenoms : 'Admin User'}
                  </span>
                  <span className="text-xs font-medium text-slate-400 dark:text-slate-500 transition-colors">Super Admin</span>
                </div>
                <div className="relative">
                  {etudiants.length > 0 && etudiants[0].image ? (
                    <img
                      className="h-9 w-9 sm:h-10 sm:w-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-700 shadow-sm transition-all"
                      src={etudiants[0].image}
                      alt={etudiants[0].prenoms}
                    />
                  ) : (
                    <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                      A
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-slate-800"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto w-full relative">
          <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 -z-10"></div>
          <ActiveComponent />
        </main>
      </div>
    </div>
  );
};

export default App;