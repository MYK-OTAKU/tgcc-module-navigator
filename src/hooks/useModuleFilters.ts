import { useState, useMemo } from 'react';
import { Module } from '../contexts/ModuleContext';

export const useModuleFilters = (modules: Module[]) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'nom' | 'duree' | 'id'>('nom');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const filteredAndSortedModules = useMemo(() => {
    let filtered = modules;

    // Filtrage par terme de recherche
    if (searchTerm.trim()) {
      filtered = modules.filter(module =>
        module.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'nom':
          comparison = a.nom.localeCompare(b.nom, 'fr', { sensitivity: 'base' });
          break;
        case 'duree':
          comparison = a.duree - b.duree;
          break;
        case 'id':
          comparison = a.id.localeCompare(b.id);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [modules, searchTerm, sortBy, sortOrder]);

  const handleSortChange = (newSortBy: 'nom' | 'duree' | 'id', newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return {
    filteredAndSortedModules,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSortChange,
  };
};