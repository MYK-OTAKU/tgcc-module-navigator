import { useEffect } from 'react';
import { useModuleContext } from '../contexts/ModuleContext';
import { moduleApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Clock, Hash } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ModuleList = () => {
  const { state, dispatch } = useModuleContext();
  const { modules, loading, error } = state;

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
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-foreground mb-2">Liste des modules</h2>
        <p className="text-muted-foreground">
          {modules.length} module{modules.length !== 1 ? 's' : ''} disponible{modules.length !== 1 ? 's' : ''}
        </p>
      </div>

      {modules.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">Aucun module trouvé</h3>
              <p className="text-muted-foreground">
                Commencez par ajouter votre premier module !
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Card key={module.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold truncate">{module.nom}</span>
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Hash className="h-3 w-3" />
                    {module.id}
                  </Badge>
                </CardTitle>
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
    </div>
  );
};

export default ModuleList;