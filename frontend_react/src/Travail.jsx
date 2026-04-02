import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit2, Trash2, Plus, Briefcase, DollarSign, Hash, FileText } from "lucide-react";
import { API_URLS } from "./config";


const Travail = () => {
  const [travaux, setTravaux] = React.useState([]);
  const [groupes, setGroupes] = React.useState([]);
  const [form, setForm] = React.useState({
    ordreTravail: "",
    nomTravail: "",
    detailTravail: "",
    salaire: "",
    quantite: "",
  });
  const [editId, setEditId] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [travailToDelete, setTravailToDelete] = React.useState(null);

  React.useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (mainScroll) {
      mainScroll.style.overflow = (showModal || showDeleteModal) ? 'hidden' : 'auto';
    }
    return () => {
      if (mainScroll) mainScroll.style.overflow = 'auto';
    };
  }, [showModal, showDeleteModal]);

  const TRAVAIL_API = API_URLS.TRAVAIL;
  const GROUPE_API = `${API_URLS.GROUPE}/list`;


  React.useEffect(() => {
    fetchTravaux();
    fetchGroupes();
  }, []);

  const fetchTravaux = async () => {
    try {
      const res = await fetch(TRAVAIL_API);
      const data = await res.json();
      setTravaux(data);
    } catch (err) {
      console.error("Erreur récupération travaux :", err);
    }
  };

  const fetchGroupes = async () => {
    try {
      const res = await fetch(GROUPE_API);
      const data = await res.json();
      setGroupes(data);
    } catch (err) {
      console.error("Erreur récupération groupes :", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await fetch(`${TRAVAIL_API}/${editId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(TRAVAIL_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      resetForm();
      fetchTravaux();
    } catch (err) {
      console.error("Erreur enregistrement :", err);
    }
  };

  const resetForm = () => {
    setForm({ ordreTravail: "", nomTravail: "", detailTravail: "", salaire: "", quantite: "" });
    setEditId(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (travailToDelete) {
      try {
        await fetch(`${TRAVAIL_API}/${travailToDelete}`, { method: 'DELETE' });
        fetchTravaux();
        setShowDeleteModal(false);
        setTravailToDelete(null);
      } catch (err) {
        console.error("Erreur suppression :", err);
      }
    }
  };

  const confirmDelete = (id) => {
    setTravailToDelete(id);
    setShowDeleteModal(true);
  };

  const handleEdit = (travail) => {
    setForm(travail);
    setEditId(travail.id);
    setShowModal(true);
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Gestion des Travaux</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Gérez les ordres de travail et leurs détails</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex w-full sm:w-auto items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/30 dark:shadow-indigo-500/20 hover:shadow-indigo-600/50 dark:hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouveau Travail
            </button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Travaux</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">{travaux.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Budget Total</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {travaux.reduce((sum, t) => sum + parseFloat(t.salaire || 0), 0).toLocaleString()} €
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Hash className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Quantité Totale</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {travaux.reduce((sum, t) => sum + parseInt(t.quantite || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-gray-200 dark:border-slate-800 p-6 transition-colors">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Salaire Moyen</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {travaux.length > 0 ? Math.round(travaux.reduce((sum, t) => sum + parseFloat(t.salaire || 0), 0) / travaux.length).toLocaleString() : 0} €
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Table & Mobile List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Liste des Travaux</h3>
            <span className="bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 py-1 px-3 rounded-full text-xs font-bold">{travaux.length} Total</span>
          </div>

          {/* Mobile View: Cards */}
          <div className="block md:hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {travaux.map((travail) => (
                <div key={travail.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                        <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">{travail.nomTravail}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">#{travail.id}</span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                            Ordre: {travail.ordreTravail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{travail.detailTravail}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                      {parseFloat(travail.salaire).toLocaleString()} €
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                      Qté: {travail.quantite}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                    <button onClick={() => handleEdit(travail)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(travail.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {travaux.length === 0 && (
                <div className="py-10 text-center text-slate-500 dark:text-slate-400">
                  <Briefcase className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium">Aucun travail trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Ordre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Détail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Salaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Quantité</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                {travaux.map((travail) => (
                  <tr key={travail.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">
                      #{travail.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        {travail.ordreTravail}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-bold text-slate-900 dark:text-slate-100">{travail.nomTravail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 max-w-[200px] truncate">
                      {travail.detailTravail}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                        {parseFloat(travail.salaire).toLocaleString()} €
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300">
                        {travail.quantite}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(travail)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => confirmDelete(travail.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/30 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {travaux.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                      <Briefcase className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-4" />
                      <p className="text-lg font-medium">Aucun travail trouvé</p>
                      <p className="mt-1">Commencez par créer votre premier travail.</p>
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
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl text-left shadow-2xl transform transition-all w-full max-w-2xl max-h-[90vh] flex flex-col border border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                {editId ? "Modifier le travail" : "Nouveau travail"}
              </h3>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:px-8 sm:py-6 space-y-6 overflow-y-auto flex-1">
              {/* Icon Section */}
              <div className="flex justify-center">
                <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shadow-inner">
                  <Briefcase className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>

              <div className="space-y-5">
                {/* Première ligne : Ordre Travail et Nom Travail */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Ordre Travail</label>
                    <input type="text" name="ordreTravail" placeholder="Ex: T-001" value={form.ordreTravail} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nom Travail</label>
                    <select name="nomTravail" value={form.nomTravail} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required>
                      <option value="">Choisir un travail</option>
                      {groupes.map((g) => (
                        <option key={g.id} value={g.nomTravail}>{g.nomTravail}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Deuxième ligne : Détail Travail */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Détail du Travail</label>
                  <textarea name="detailTravail" placeholder="Description du travail" value={form.detailTravail} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" />
                </div>

                {/* Troisième ligne : Salaire et Quantité */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Salaire (€)</label>
                    <input type="number" name="salaire" placeholder="Salaire" value={form.salaire} onChange={handleChange} min="0" step="0.01" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Quantité</label>
                    <input type="number" name="quantite" placeholder="Quantité" value={form.quantite} onChange={handleChange} min="1" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-b-2xl sm:rounded-b-3xl flex justify-between space-x-3">
              <button type="button" onClick={resetForm} className="flex-1 px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                Annuler
              </button>
              <button type="button" onClick={handleSubmit} className="flex-1 px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 border border-transparent rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20 transition-all">
                {editId ? "Modifier" : "Créer le travail"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modal Suppression */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-auto">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={() => {setShowDeleteModal(false); setTravailToDelete(null);}}></div>
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
                    Êtes-vous sûr de vouloir supprimer ce travail ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 flex space-x-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => { setShowDeleteModal(false); setTravailToDelete(null); }} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
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

export default Travail;