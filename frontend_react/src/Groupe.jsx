import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit2, Trash2, Plus, Users, Hash } from "lucide-react";
import { API_URLS } from "./config";


const Groupe = () => {
  const [groupes, setGroupes] = React.useState([]);
  const [formData, setFormData] = React.useState({
    id: "",
    nomTravail: "",
    quantite: "",
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [groupeToDelete, setGroupeToDelete] = React.useState(null);

  React.useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (mainScroll) {
      mainScroll.style.overflow = (showModal || showDeleteModal) ? 'hidden' : 'auto';
    }
    return () => {
      if (mainScroll) mainScroll.style.overflow = 'auto';
    };
  }, [showModal, showDeleteModal]);

  const API_URL = API_URLS.GROUPE;


  const fetchGroupes = async () => {
    try {
      const response = await fetch(API_URL + "/list");
      const data = await response.json();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des groupes:", error);
    }
  };

  React.useEffect(() => {
    fetchGroupes();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await fetch(`${API_URL}/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      resetForm();
      fetchGroupes();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du groupe:", error);
    }
  };

  const resetForm = () => {
    setFormData({ id: "", nomTravail: "", quantite: "" });
    setIsEditing(false);
    setShowModal(false);
  };

  const handleEdit = (groupe) => {
    setFormData(groupe);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (groupeToDelete) {
      try {
        await fetch(`${API_URL}/${groupeToDelete}`, { method: 'DELETE' });
        fetchGroupes();
        setShowDeleteModal(false);
        setGroupeToDelete(null);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const confirmDelete = (id) => {
    setGroupeToDelete(id);
    setShowDeleteModal(true);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="w-full">
      <div className="p-4 sm:p-6 lg:p-8 animate-fade-in max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-5 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Gestion des Groupes</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Gérez les groupes de travail</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex w-full sm:w-auto items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 dark:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Groupe
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Groupes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{groupes.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Hash className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Capacité Totale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {groupes.reduce((sum, groupe) => sum + parseInt(groupe.quantite || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Capacité Moyenne</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {groupes.length > 0 ? Math.round(groupes.reduce((sum, groupe) => sum + parseInt(groupe.quantite || 0), 0) / groupes.length) : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table & Mobile List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Liste des Groupes</h3>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 py-1 px-3 rounded-full text-xs font-bold">{groupes.length} Total</span>
          </div>
          
          {/* Mobile View: Cards */}
          <div className="block md:hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {groupes.map((groupe) => (
                <div key={groupe.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{groupe.nomTravail}</h4>
                        <span className="inline-flex items-center px-2.5 py-0.5 mt-1.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                          {groupe.quantite} places
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <button onClick={() => handleEdit(groupe)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(groupe.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {groupes.length === 0 && (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium">Aucun groupe trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom du Travail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                {groupes.map((groupe) => (
                  <tr key={groupe.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{groupe.nomTravail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                        {groupe.quantite} places
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(groupe)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(groupe.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {groupes.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <Users className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-lg font-medium">Aucun groupe trouvé</p>
                      <p className="mt-1">Commencez par créer votre premier groupe.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-auto">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={resetForm}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl text-left shadow-2xl transform transition-all w-full max-w-lg max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {isEditing ? "Modifier le groupe" : "Nouveau groupe"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:px-8 sm:py-6 space-y-6 overflow-y-auto flex-1">
              {/* Icon Section */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-inner">
                  <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nom du Travail</label>
                  <input type="text" name="nomTravail" placeholder="Nom du Travail" value={formData.nomTravail} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Quantité</label>
                  <input type="number" name="quantite" placeholder="Quantité" value={formData.quantite} onChange={handleChange} min="1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required />
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-b-2xl sm:rounded-b-3xl flex justify-between space-x-3">
              <button type="button" onClick={resetForm} className="flex-1 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                Annuler
              </button>
              <button type="button" onClick={handleSubmit} className="flex-1 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20 transition-all">
                {isEditing ? "Enregistrer" : "Créer le groupe"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Suppression */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-auto">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={() => {setShowDeleteModal(false); setGroupeToDelete(null);}}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl text-left shadow-2xl transform transition-all w-full max-w-md border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="px-6 sm:px-8 py-6">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shadow-sm">
                    <Trash2 className="h-6 w-6 text-rose-600 dark:text-rose-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Confirmer la suppression</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 flex space-x-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => { setShowDeleteModal(false); setGroupeToDelete(null); }} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                Annuler
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-rose-600 border border-transparent rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 dark:shadow-rose-500/20 transition-all">
                Supprimer
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Groupe;
