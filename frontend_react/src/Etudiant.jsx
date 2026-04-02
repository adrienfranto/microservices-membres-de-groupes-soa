import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Edit2, Trash2, Plus, User, Upload, ArrowRight, ArrowLeft } from "lucide-react";
import { API_URLS } from "./config";


const Etudiant = () => {
  const [etudiants, setEtudiants] = React.useState([]);
  const [groupes, setGroupes] = React.useState([]);
  const [formData, setFormData] = React.useState({
    matricule:"",
    nom: "",
    prenoms: "",
    sexe: "",
    niveau: "",
    id_groupe: "",
    image: null,
  });
  const [isEditing, setIsEditing] = React.useState(false);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [studentToDelete, setStudentToDelete] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    const mainScroll = document.getElementById('main-scroll-container');
    if (mainScroll) {
      mainScroll.style.overflow = (showModal || showDeleteModal) ? 'hidden' : 'auto';
    }
    return () => {
      if (mainScroll) mainScroll.style.overflow = 'auto';
    };
  }, [showModal, showDeleteModal]);

  const ETUDIANT_API = API_URLS.ETUDIANT;
  const GROUPE_API = `${API_URLS.GROUPE}/list`;


  const fetchEtudiants = async () => {
    try {
      const response = await fetch(ETUDIANT_API);
      const data = await response.json();
      setEtudiants(data);
    } catch (error) {
      console.error("Erreur récupération étudiants:", error);
    }
  };

  const fetchGroupes = async () => {
    try {
      const response = await fetch(GROUPE_API);
      const data = await response.json();
      setGroupes(data);
    } catch (error) {
      console.error("Erreur récupération groupes:", error);
    }
  };

  React.useEffect(() => {
    fetchEtudiants();
    fetchGroupes();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("etudiant", new Blob([JSON.stringify({
        matricule: formData.matricule,
        nom: formData.nom,
        prenoms: formData.prenoms,
        sexe: formData.sexe,
        niveau: formData.niveau,
        id_groupe: formData.id_groupe,
      })], { type: "application/json" }));
      if (formData.image) data.append("image", formData.image);

      if (isEditing) {
        await fetch(`${ETUDIANT_API}/${formData.id}`, {
          method: 'PUT',
          body: data,
        });
      } else {
        await fetch(ETUDIANT_API, {
          method: 'POST',
          body: data,
        });
      }

      resetForm();
      fetchEtudiants();
    } catch (error) {
      console.error("Erreur enregistrement étudiant:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      matricule:"",
      nom: "",
      prenoms: "",
      sexe: "",
      niveau: "",
      id_groupe: "",
      image: null,
    });
    setIsEditing(false);
    setShowModal(false);
    setImagePreview(null);
  };

  const handleEdit = (etudiant) => {
    setFormData({
      ...etudiant,
      image: null,
    });
    setImagePreview(etudiant.image ? etudiant.image : null);
    setImagePreview(etudiant.image ? etudiant.image : null);

    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async () => {
    if (studentToDelete) {
      try {
        await fetch(`${ETUDIANT_API}/${studentToDelete}`, { method: 'DELETE' });
        fetchEtudiants();
        setShowDeleteModal(false);
        setStudentToDelete(null);
      } catch (error) {
        console.error("Erreur suppression étudiant:", error);
      }
    }
  };

  const confirmDelete = (id) => {
    setStudentToDelete(id);
    setShowDeleteModal(true);
  };

  const getNomGroupe = (idGroupe) => {
    const id = Number(idGroupe);
    const groupe = groupes.find((g) => Number(g.id) === id);
    return groupe ? groupe.nomTravail : "-";
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
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Gestion des Étudiants</h1>
              <p className="text-slate-500 dark:text-slate-400 font-medium mt-1 transition-colors">Gérez les informations des étudiants</p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex w-full sm:w-auto items-center justify-center px-5 py-2.5 bg-indigo-600 text-white font-medium text-sm rounded-xl hover:bg-indigo-700 transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 dark:shadow-indigo-500/20 dark:hover:shadow-indigo-500/40 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvel Étudiant
            </button>
          </div>
        </div>

        {/* Table & Mobile List */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          
          {/* Mobile View: Cards */}
          <div className="block md:hidden">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {etudiants.map((etudiant) => (
                <div key={etudiant.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex-shrink-0 h-12 w-12">
                      {etudiant.image ? (
                        <img className="h-12 w-12 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700" src={etudiant.image} alt={etudiant.nom} />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <User className="h-6 w-6 text-slate-400 dark:text-slate-500" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{etudiant.nom} {etudiant.prenoms}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Matricule: <span className="text-slate-700 dark:text-slate-300">{etudiant.matricule}</span></p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      etudiant.sexe === 'Masculin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
                    }`}>
                      {etudiant.sexe}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                      Niveau {etudiant.niveau}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300">
                      {getNomGroupe(etudiant.id_groupe)}
                    </span>
                  </div>

                  <div className="flex justify-end space-x-2 border-t border-slate-100 dark:border-slate-800 pt-3 mt-1">
                    <button onClick={() => handleEdit(etudiant)} className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-2 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => confirmDelete(etudiant.id)} className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/30 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {etudiants.length === 0 && (
                <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                  <User className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm font-medium">Aucun étudiant trouvé</p>
                </div>
              )}
            </div>
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 dark:divide-slate-800">
              <thead className="bg-slate-50/80 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Image</th>                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matricule</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Nom</th>                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Prénoms</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Sexe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Niveau</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Groupe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-100/60 dark:divide-slate-800/60">
                {etudiants.map((etudiant) => (
                  <tr key={etudiant.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors duration-150">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {etudiant.image ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700"
                            src={etudiant.image}
                            alt={etudiant.nom}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-slate-100">{etudiant.matricule}</td>                    
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-200">{etudiant.nom}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">{etudiant.prenoms}</td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        etudiant.sexe === 'Masculin' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300'
                      }`}>
                        {etudiant.sexe}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300">
                        {etudiant.niveau}
                      </span>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-400">{getNomGroupe(etudiant.id_groupe)}</td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-right">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(etudiant)}
                          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => confirmDelete(etudiant.id)}
                          className="text-rose-600 dark:text-rose-400 hover:text-rose-900 dark:hover:text-rose-300 p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/30 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {etudiants.length === 0 && (
              <div className="py-12 text-center text-slate-500 dark:text-slate-400">
                <User className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-medium">Aucun étudiant trouvé</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Ajout/Modification */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={resetForm}></div>
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl text-left shadow-2xl transform transition-all w-full max-w-2xl flex flex-col border border-slate-100 dark:border-slate-800 max-h-[90vh]">
            
            <div className="flex justify-between items-center px-6 sm:px-8 py-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                  {isEditing ? "Modifier l'étudiant" : "Nouvel étudiant"}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Étape {step} sur 2</p>
              </div>
              <button
                onClick={resetForm}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 p-2 rounded-full transition-colors"
                title="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:px-8 sm:py-6 overflow-y-auto flex-1">
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-24 w-24 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800 shadow-sm" />
                      ) : (
                        <div className="h-24 w-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border-4 border-slate-50 dark:border-slate-900">
                          <User className="h-10 w-10 text-slate-300 dark:text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <input type="file" name="image" onChange={handleChange} className="sr-only" accept="image/*" id="image-upload" />
                      <label htmlFor="image-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-sm">
                        <Upload className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" /> Choisir une image
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Nom</label>
                      <input type="text" name="nom" placeholder="Saisir le nom" value={formData.nom} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Prénoms</label>
                      <input type="text" name="prenoms" placeholder="Saisir les prénoms" value={formData.prenoms} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Sexe</label>
                      <select name="sexe" value={formData.sexe} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required>
                        <option value="">Sélectionner le sexe</option>
                        <option value="Masculin">Masculin</option>
                        <option value="Féminin">Féminin</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Niveau</label>
                      <select name="niveau" value={formData.niveau} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required>
                        <option value="">Sélectionner le niveau</option>
                        <option value="L1">L1</option>
                        <option value="L2">L2</option>
                        <option value="L3">L3</option>
                        <option value="M1">M1</option>
                        <option value="M2">M2</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Matricule</label>
                      <input type="text" name="matricule" placeholder="Ex: 1555H-F" value={formData.matricule} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-1.5">Groupe</label>
                      <select name="id_groupe" value={formData.id_groupe} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-xl focus:ring-2 focus:ring-indigo-500/20 dark:focus:ring-indigo-500/40 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all" required>
                        <option value="">Sélectionner un groupe</option>
                        {groupes.map((g) => (
                          <option key={g.id} value={g.id}>{g.nomTravail}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 sm:px-8 py-5 border-t border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50 dark:bg-slate-900 rounded-b-2xl sm:rounded-b-3xl flex justify-between items-center">
              {step === 1 ? (
                <>
                  <button type="button" onClick={resetForm} className="px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                    Annuler
                  </button>
                  <button type="button" onClick={() => setStep(2)} className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 dark:shadow-indigo-500/20 transition-all">
                    Suivant <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setStep(1)} className="inline-flex items-center px-5 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Précédent
                  </button>
                  <button type="button" onClick={handleSubmit} className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 dark:shadow-emerald-500/20 transition-all">
                    {isEditing ? "Enregistrer" : "Ajouter l'étudiant"}
                  </button>
                </>
              )}
            </div>
            
          </div>
        </div>,
        document.body
      )}

      {/* Modal Suppression */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 animate-fade-in pointer-events-auto">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity" aria-hidden="true" onClick={() => {setShowDeleteModal(false); setStudentToDelete(null);}}></div>
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
                    Êtes-vous sûr de vouloir supprimer cet étudiant ? Cette action ne peut pas être annulée.
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 py-5 bg-slate-50 dark:bg-slate-800/50 flex space-x-3 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => { setShowDeleteModal(false); setStudentToDelete(null); }} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-100 transition-all shadow-sm">
                Annuler
              </button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-600/20 dark:shadow-rose-500/20 transition-all">
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

export default Etudiant;