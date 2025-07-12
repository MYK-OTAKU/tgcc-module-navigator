import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Users, BarChart3, ArrowRight } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: "Gestion des modules",
      description: "Organisez et gérez facilement tous vos modules de formation",
      badge: "Essentiel"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Suivi des participants",
      description: "Suivez les progrès et la participation de vos apprenants",
      badge: "Avancé"
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-purple-600" />,
      title: "Rapports détaillés",
      description: "Analysez les performances avec des rapports complets",
      badge: "Pro"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 mb-6 text-sm font-medium text-blue-700 bg-blue-100 rounded-full dark:text-blue-300 dark:bg-blue-900/30">
              <span>✨ Nouveau : Interface améliorée</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
              Gestion des modules de
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                formation TGCC
              </span>
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Plateforme complète pour organiser, suivre et analyser vos modules de formation. 
              Simplicité et efficacité au service de l'apprentissage.
            </p>
            
            <div className="flex items-center justify-center mt-10 gap-x-6">
              <Link to="/modules">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Voir les modules
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              
              <Link to="/add-module">
                <Button variant="outline" size="lg" className="border-slate-300 dark:border-slate-600">
                  <Plus className="w-5 h-5 mr-2" />
                  Ajouter un module
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Fonctionnalités principales
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            Tout ce dont vous avez besoin pour gérer efficacement vos formations
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-100 rounded-lg dark:bg-slate-800 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">100+</div>
            <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Modules créés</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">50+</div>
            <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Formateurs actifs</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">1000+</div>
            <div className="mt-2 text-sm font-medium text-slate-600 dark:text-slate-300">Heures de formation</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
