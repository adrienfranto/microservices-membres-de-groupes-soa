import React, { useState, useEffect } from 'react';
import { Users, Briefcase, UserCheck, TrendingUp, Calendar, Award, BookOpen, Target } from 'lucide-react';
import { API_URLS } from './config';


const ETUDIANT_API = API_URLS.ETUDIANT;
const GROUPE_API = `${API_URLS.GROUPE}/list`;
const TRAVAIL_API = API_URLS.TRAVAIL;


const Dashboard = () => {
  const [stats, setStats] = useState({
    etudiants: 0,
    groupes: 0,
    travaux: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [etudiantsRes, groupesRes, travauxRes] = await Promise.all([
          fetch(ETUDIANT_API).catch(() => ({ ok: false })),
          fetch(GROUPE_API).catch(() => ({ ok: false })),
          fetch(TRAVAIL_API).catch(() => ({ ok: false }))
        ]);

        let etudiantsCount = 0;
        let groupesCount = 0;
        let travauxCount = 0;

        if (etudiantsRes.ok) {
          const etudiantsData = await etudiantsRes.json();
          etudiantsCount = Array.isArray(etudiantsData) ? etudiantsData.length : 0;
        }

        if (groupesRes.ok) {
          const groupesData = await groupesRes.json();
          groupesCount = Array.isArray(groupesData) ? groupesData.length : 0;
        }

        if (travauxRes.ok) {
          const travauxData = await travauxRes.json();
          travauxCount = Array.isArray(travauxData) ? travauxData.length : 0;
        }

        setStats({
          etudiants: etudiantsCount,
          groupes: groupesCount,
          travaux: travauxCount
        });

      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ icon: Icon, title, value, isDark = false, loading }) => (
    <div className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${isDark ? 'bg-gradient-to-br from-indigo-900 to-slate-900 text-white border border-indigo-500/30' : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 shadow-sm'}`}>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider mb-2 opacity-80">{title}</h3>
          <div className="text-4xl font-black tracking-tight">
            {loading ? (
              <div className={`animate-pulse ${isDark ? 'bg-indigo-800' : 'bg-slate-200 dark:bg-slate-800'} h-10 w-20 rounded-lg mt-1`}></div>
            ) : (
              value
            )}
          </div>
          <p className={`text-sm mt-3 font-medium ${isDark ? 'text-indigo-200' : 'text-slate-500 dark:text-slate-400'}`}>
            {loading ? "Chargement..." : "Total enregistré"}
          </p>
        </div>
        <div className={`p-4 rounded-2xl ${isDark ? 'bg-white/10 backdrop-blur-md shadow-inner' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-500/30'}`}>
          <Icon className="h-8 w-8" />
        </div>
      </div>
      {isDark && <div className="absolute -top-12 -right-12 w-40 h-40 bg-indigo-500 rounded-full mix-blend-screen filter blur-[40px] opacity-40"></div>}
      {!isDark && <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-slate-50 dark:bg-slate-800 rounded-full filter blur-[20px] opacity-60 dark:opacity-20 transition-colors"></div>}
    </div>
  );

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight mb-2 transition-colors">Tableau de Bord</h1>
          <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-medium transition-colors">Vue d'ensemble de votre système de gestion</p>
        </div>

        {/* Cartes principales */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-10 w-full">
          <StatCard
            icon={Users}
            title="Étudiants"
            value={stats.etudiants}
            loading={loading}
          />
          
          <StatCard
            icon={UserCheck}
            title="Groupes"
            value={stats.groupes}
            loading={loading}
          />
          
          <StatCard
            icon={Briefcase}
            title="Travaux"
            value={stats.travaux}
            loading={loading}
            isDark={true}
          />
        </div>

        {/* Section inférieure */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Activités récentes */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8 border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl mr-3">
                <TrendingUp className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Activités Récentes</h3>
            </div>
            
            <div className="space-y-3">
              {[
                { text: "Nouvel étudiant inscrit", time: "Il y a 5 min", icon: Users },
                { text: "Groupe mis à jour", time: "Il y a 15 min", icon: UserCheck },
                { text: "Nouveau travail assigné", time: "Il y a 1 heure", icon: Briefcase },
                { text: "Évaluation terminée", time: "Il y a 2 heures", icon: Award }
              ].map((activity, index) => (
                <div key={index} className="flex items-center p-4 bg-white dark:bg-slate-800/50 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-200 border border-slate-100 dark:border-slate-700/50">
                  <div className="h-2.5 w-2.5 bg-indigo-500 rounded-full mr-4 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
                  <activity.icon className="h-5 w-5 text-slate-400 dark:text-slate-500 mr-3" />
                  <div className="flex-1">
                    <span className="text-slate-900 dark:text-slate-200 font-bold text-sm">{activity.text}</span>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Actions rapides */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm p-8 border border-slate-200 dark:border-slate-800 transition-colors">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl mr-3">
                <Target className="h-6 w-6 text-slate-600 dark:text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Actions Rapides</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "Ajouter Étudiant" },
                { icon: UserCheck, label: "Créer Groupe" },
                { icon: Briefcase, label: "Nouveau Travail" },
                { icon: BookOpen, label: "Voir Rapports" }
              ].map((action, index) => (
                <button
                  key={index}
                  className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 p-4 rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-1 transition-all duration-200 flex flex-col items-center justify-center space-y-3 border border-slate-200 dark:border-slate-700"
                >
                  <action.icon className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                  <span className="text-sm font-bold text-center">{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;