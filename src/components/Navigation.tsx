import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { List, Plus } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-card border-b border-border p-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">TGCC Module Navigator</h1>
          
          <div className="flex gap-2">
            <Button
              asChild
              variant={location.pathname === '/' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Link to="/">
                <List className="h-4 w-4" />
                Liste des modules
              </Link>
            </Button>
            
            <Button
              asChild
              variant={location.pathname === '/add' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Link to="/add">
                <Plus className="h-4 w-4" />
                Ajouter module
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;