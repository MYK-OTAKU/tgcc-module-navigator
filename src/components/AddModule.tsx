import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModuleContext } from '../contexts/ModuleContext';
import { moduleApi } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Plus, ArrowLeft, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';

const AddModule = () => {
  const [nom, setNom] = useState('');
  const [duree, setDuree] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ nom?: string; duree?: string }>({});

  const { dispatch } = useModuleContext();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: { nom?: string; duree?: string } = {};
    
    if (!nom.trim()) {
      newErrors.nom = 'Le nom du module est requis';
    } else if (nom.trim().length < 3) {
      newErrors.nom = 'Le nom doit contenir au moins 3 caractères';
    } else if (nom.trim().length > 100) {
      newErrors.nom = 'Le nom ne peut pas dépasser 100 caractères';
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
      
      toast.success(`Module "${newModule.nom}" créé avec succès !`);

      // Reset form
      setNom('');
      setDuree('');
      setDescription('');
      setErrors({});

      // Redirect to modules list after a short delay
      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="mb-6 flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
              <Plus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Créer un nouveau module
            </h1>
            <p className="text-slate-600 dark:text-slate-300">
              Ajoutez un module de formation à votre catalogue
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="pb-6">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              Informations du module
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom du module */}
              <div className="space-y-3">
                <Label htmlFor="nom" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nom du module *
                </Label>
                <Input
                  id="nom"
                  type="text"
                  placeholder="Ex: Introduction à React.js"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  className={`h-11 ${errors.nom ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                />
                {errors.nom && (
                  <Alert variant="destructive" className="py-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.nom}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Durée */}
              <div className="space-y-3">
                <Label htmlFor="duree" className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Durée (en heures) *
                </Label>
                <Input
                  id="duree"
                  type="number"
                  placeholder="Ex: 8"
                  min="1"
                  max="1000"
                  value={duree}
                  onChange={(e) => setDuree(e.target.value)}
                  className={`h-11 ${errors.duree ? 'border-red-500 focus-visible:ring-red-500' : 'border-slate-300 dark:border-slate-600'}`}
                />
                {errors.duree && (
                  <Alert variant="destructive" className="py-3">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {errors.duree}
                    </AlertDescription>
                  </Alert>
                )}
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Durée totale estimée du module de formation
                </p>
              </div>

              {/* Description (optionnelle) */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description (optionnelle)
                </Label>
                <Textarea
                  id="description"
                  placeholder="Décrivez brièvement le contenu et les objectifs du module..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[100px] border-slate-300 dark:border-slate-600 resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                  {description.length}/500 caractères
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1"
                  onClick={handleBack}
                  disabled={loading}
                >
                  Annuler
                </Button>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  disabled={loading || !nom.trim() || !duree.trim()}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Créer le module
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aide contextuelle */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">💡 Conseils</h3>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Choisissez un nom descriptif et unique pour votre module</li>
            <li>• Estimez la durée totale en incluant les exercices pratiques</li>
            <li>• Une bonne description aide les apprenants à comprendre les objectifs</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddModule;