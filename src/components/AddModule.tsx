import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleContext } from '../contexts/ModuleContext';
import { moduleApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Plus, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddModule = () => {
  const [nom, setNom] = useState('');
  const [duree, setDuree] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nom?: string; duree?: string }>({});

  const { dispatch } = useModuleContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { nom?: string; duree?: string } = {};
    
    if (!nom.trim()) {
      newErrors.nom = 'Le nom du module est requis';
    } else if (nom.trim().length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    }

    if (!duree.trim()) {
      newErrors.duree = 'La durée est requise';
    } else if (isNaN(Number(duree)) || Number(duree) <= 0) {
      newErrors.duree = 'La durée doit être un nombre positif';
    } else if (Number(duree) > 1000) {
      newErrors.duree = 'La durée ne peut pas dépasser 1000 heures';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const newModule = await moduleApi.createModule({
        nom: nom.trim(),
        duree: Number(duree),
      });

      dispatch({ type: 'ADD_MODULE', payload: newModule });
      
      toast({
        title: "Succès !",
        description: `Le module "${newModule.nom}" a été créé avec succès.`,
        variant: "default",
      });

      // Reset form
      setNom('');
      setDuree('');
      setErrors({});

      // Redirect to modules list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="mb-4 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la liste
        </Button>
        
        <h2 className="text-3xl font-bold text-foreground mb-2">Ajouter un module</h2>
        <p className="text-muted-foreground">
          Créez un nouveau module de formation
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Nouveau module
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom du module *</Label>
              <Input
                id="nom"
                type="text"
                placeholder="Ex: Introduction à React"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className={errors.nom ? 'border-destructive' : ''}
              />
              {errors.nom && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.nom}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="duree">Durée (en heures) *</Label>
              <Input
                id="duree"
                type="number"
                placeholder="Ex: 8"
                min="1"
                max="1000"
                value={duree}
                onChange={(e) => setDuree(e.target.value)}
                className={errors.duree ? 'border-destructive' : ''}
              />
              {errors.duree && (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {errors.duree}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Créer le module
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddModule;