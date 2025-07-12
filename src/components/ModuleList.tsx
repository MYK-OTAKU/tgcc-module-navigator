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
import { Loader2, AlertCircle, Clock, Hash, Edit, Trash2, Plus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Module } from '../contexts/ModuleContext';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const ModuleList = () => {
  const { state, dispatch } = useModuleContext();
  const { modules, loading, error } = state;
  
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
    setEditForm({ nom: module.nom, duree: module.duree });
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Chargement des modules...</span>
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
    <div className="container mx-auto p-6">
      {/* Header avec actions */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2">Liste des modules</h2>
          <p className="text-muted-foreground">
            {modules.length} module{modules.length !== 1 ? 's' : ''} disponible{modules.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to="/add-module">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau module
          </Button>
        </Link>
      </div>

      {modules.length === 0 ? (
        <Card className="border-dashed border-2 border-slate-300 dark:border-slate-600">
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Aucun module trouvé</h3>
              <p className="text-muted-foreground mb-6">
                Commencez par ajouter votre premier module !
              </p>
              <Link to="/add-module">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter un module
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold truncate mb-2">
                      {module.nom}
                    </CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                      <Hash className="h-3 w-3" />
                      {module.id}
                    </Badge>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditClick(module)}
                      className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteClick(module.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{module.duree} heure{module.duree !== 1 ? 's' : ''}</span>
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
                value={editForm.nom}
                onChange={(e) => setEditForm({ ...editForm, nom: e.target.value })}
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
                value={editForm.duree}
                onChange={(e) => setEditForm({ ...editForm, duree: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={operationLoading}>
              Annuler
            </Button>
            <Button onClick={handleEditSubmit} disabled={operationLoading || !editForm.nom.trim()}>
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
  );
};

export default ModuleList;