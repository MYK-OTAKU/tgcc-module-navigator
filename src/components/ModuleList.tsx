import { useEffect, useState } from 'react';
import { useModuleContext } from '../contexts/ModuleContext';
import { moduleApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, AlertCircle, Clock, Hash, Edit, Trash2, Plus, Star, Calendar, User } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Module } from '../contexts/ModuleContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import ModuleStats from './ModuleStats';
import ModuleSearch from './ModuleSearch';
import { useModuleFilters } from '../hooks/useModuleFilters';

const ModuleList = () => {
  const { state, dispatch } = useModuleContext();
  const { modules, loading, error } = state;
  
  // Filtres et tri
  const {
    filteredAndSortedModules,
    searchTerm,
    setSearchTerm,
    sortBy,
    sortOrder,
    handleSortChange,
  } = useModuleFilters(modules);
  
  // États pour la modification
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editForm, setEditForm] = useState({ nom: '', duree: 0 });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // États pour la suppression
  const [deletingModuleId, setDeletingModuleId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // État de chargement des opérations
  const [operationLoading, setOperationLoading] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const modulesData = await moduleApi.getModules();
        dispatch({ type: 'SET_MODULES', payload: modulesData });
      } catch (err) {
        dispatch({ type: 'SET_ERROR', payload: err instanceof Error ? err.message : 'Erreur inconnue' });
      }
    };

    fetchModules();
  }, [dispatch]);

  const handleEditClick = (module: Module) => {
    setEditingModule(module);
    setEditForm({ nom: module.nom || '', duree: module.duree || 0 });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!editingModule) return;
    
    setOperationLoading(true);
    try {
      const updatedModule = await moduleApi.updateModule(editingModule.id, editForm);
      dispatch({ type: 'UPDATE_MODULE', payload: updatedModule });
      setIsEditDialogOpen(false);
      setEditingModule(null);
      toast.success('Module mis à jour avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
    } finally {
      setOperationLoading(false);
    }
  };

  const handleDeleteClick = (moduleId: string) => {
    setDeletingModuleId(moduleId);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingModuleId) return;
    
    setOperationLoading(true);
    try {
      await moduleApi.deleteModule(deletingModuleId);
      dispatch({ type: 'DELETE_MODULE', payload: deletingModuleId });
      setIsDeleteDialogOpen(false);
      setDeletingModuleId(null);
      toast.success('Module supprimé avec succès');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setOperationLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-light/20">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-large animate-pulse-glow">
                  <Loader2 className="h-10 w-10 text-white animate-spin" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-2">Chargement des modules</h3>
              <p className="text-muted-foreground animate-pulse">Récupération des données en cours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-light/20">
      <div className="container mx-auto p-6">
        {/* Header avec titre et actions */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Gestion des Modules
            </h1>
            <p className="text-muted-foreground text-lg">
              {modules.length} module{modules.length !== 1 ? 's' : ''} • {filteredAndSortedModules.length} affiché{filteredAndSortedModules.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Link to="/add">
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow text-white border-0 px-8 py-3 text-base font-medium transition-all duration-300 hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Nouveau module
            </Button>
          </Link>
        </div>

        {/* Statistiques */}
        <ModuleStats />

        {/* Barre de recherche et filtres */}
        <ModuleSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />

        {/* Contenu principal */}
        {modules.length === 0 ? (
          <Card className="border-dashed border-2 border-primary/20 bg-gradient-glass backdrop-blur-sm animate-fade-in">
            <CardContent className="flex items-center justify-center py-20">
              <div className="text-center max-w-md">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-large animate-float">
                  <Star className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Aucun module trouvé</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  Créez votre premier module de formation pour commencer à organiser votre contenu pédagogique !
                </p>
                <Link to="/add">
                  <Button size="lg" className="bg-gradient-primary hover:opacity-90 shadow-glow">
                    <Plus className="h-5 w-5 mr-2" />
                    Créer un module
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : filteredAndSortedModules.length === 0 ? (
          <Card className="border-dashed border-2 border-primary/20 bg-gradient-glass backdrop-blur-sm">
            <CardContent className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-2">Aucun résultat</h3>
                <p className="text-muted-foreground mb-4">
                  Aucun module ne correspond à votre recherche "{searchTerm}"
                </p>
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Effacer la recherche
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredAndSortedModules.map((module, index) => (
              <Card 
                key={module.id} 
                className="group hover:shadow-glow transition-all duration-500 border-0 bg-gradient-glass backdrop-blur-sm hover:scale-[1.02] animate-fade-in" 
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-bold text-foreground truncate mb-2 group-hover:text-primary transition-colors">
                        {module.nom}
                      </CardTitle>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className="text-xs font-medium bg-primary-light text-primary border-0">
                          <Hash className="h-3 w-3 mr-1" />
                          {module.id}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(module)}
                        className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary hover:scale-110 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(module.id)}
                        className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive hover:scale-110 transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Durée */}
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-1.5 bg-primary/10 rounded-lg">
                        <Clock className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">
                        {module.duree} heure{module.duree !== 1 ? 's' : ''}
                      </span>
                    </div>
                    
                    {/* Métadonnées */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border/50">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Créé récemment</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>TGCC</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Dialog de modification */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier le module</DialogTitle>
            <DialogDescription>
              Modifiez les informations du module ci-dessous.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nom" className="text-right">
                Nom
              </Label>
              <Input
                id="nom"
                value={editForm.nom || ''}
                onChange={(e) => setEditForm({ ...editForm, nom: e.target.value || '' })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duree" className="text-right">
                Durée (h)
              </Label>
              <Input
                id="duree"
                type="number"
                value={editForm.duree || 0}
                onChange={(e) => setEditForm({ ...editForm, duree: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={operationLoading}>
              Annuler
            </Button>
            <Button onClick={handleEditSubmit} disabled={operationLoading || !editForm.nom?.trim()}>
              {operationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmation de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Le module sera définitivement supprimé.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={operationLoading}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={operationLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {operationLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
};

export default ModuleList;