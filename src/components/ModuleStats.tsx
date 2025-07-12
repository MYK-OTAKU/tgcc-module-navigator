import { useMemo } from 'react';
import { useModuleContext } from '../contexts/ModuleContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, TrendingUp, BarChart3 } from 'lucide-react';

const ModuleStats = () => {
  const { state } = useModuleContext();
  const { modules } = state;

  const stats = useMemo(() => {
    const totalModules = modules.length;
    const totalHours = modules.reduce((sum, module) => sum + module.duree, 0);
    const averageHours = totalModules > 0 ? Math.round(totalHours / totalModules) : 0;
    const longestModule = modules.length > 0 ? Math.max(...modules.map(m => m.duree)) : 0;

    return {
      totalModules,
      totalHours,
      averageHours,
      longestModule
    };
  }, [modules]);

  const statCards = [
    {
      title: "Total Modules",
      value: stats.totalModules,
      icon: BookOpen,
      gradient: "from-blue-500 to-purple-600",
      bgGradient: "from-blue-50 to-purple-50"
    },
    {
      title: "Heures Totales",
      value: `${stats.totalHours}h`,
      icon: Clock,
      gradient: "from-green-500 to-emerald-600",
      bgGradient: "from-green-50 to-emerald-50"
    },
    {
      title: "Durée Moyenne",
      value: `${stats.averageHours}h`,
      icon: TrendingUp,
      gradient: "from-orange-500 to-red-600",
      bgGradient: "from-orange-50 to-red-50"
    },
    {
      title: "Module le Plus Long",
      value: `${stats.longestModule}h`,
      icon: BarChart3,
      gradient: "from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={stat.title} className="group hover:shadow-glow transition-all duration-300 border-0 bg-gradient-glass backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.gradient} text-white shadow-medium group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  {stat.value}
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModuleStats;