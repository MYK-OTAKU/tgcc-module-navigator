import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ModuleSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: 'nom' | 'duree' | 'id';
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: 'nom' | 'duree' | 'id', sortOrder: 'asc' | 'desc') => void;
}

const ModuleSearch: React.FC<ModuleSearchProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleSortSelect = (newSortBy: 'nom' | 'duree' | 'id') => {
    if (newSortBy === sortBy) {
      // Si c'est déjà le critère de tri, inverser l'ordre
      onSortChange(newSortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Sinon, utiliser le nouveau critère en ordre ascendant
      onSortChange(newSortBy, 'asc');
    }
  };

  const getSortLabel = () => {
    const labels = {
      nom: 'Nom',
      duree: 'Durée',
      id: 'ID'
    };
    return `${labels[sortBy]} ${sortOrder === 'asc' ? '↑' : '↓'}`;
  };

  return (
    <div className="flex gap-3 mb-6">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <div className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200 ${isFocused ? 'text-primary' : 'text-muted-foreground'}`}>
          <Search className="h-4 w-4" />
        </div>
        <Input
          placeholder="Rechercher un module..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`pl-10 pr-10 transition-all duration-200 ${
            isFocused 
              ? 'ring-2 ring-primary/20 border-primary/50 shadow-glow' 
              : 'border-border hover:border-primary/30'
          }`}
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 px-3 h-auto hover:bg-transparent text-muted-foreground hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Sort Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 hover:shadow-soft transition-all duration-200">
            {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
            {getSortLabel()}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover/95 backdrop-blur-sm border-border/50">
          <DropdownMenuLabel className="font-medium text-foreground">Trier par</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => handleSortSelect('nom')}
            className={`cursor-pointer ${sortBy === 'nom' ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span className="flex items-center gap-2">
              Nom {sortBy === 'nom' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleSortSelect('duree')}
            className={`cursor-pointer ${sortBy === 'duree' ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span className="flex items-center gap-2">
              Durée {sortBy === 'duree' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleSortSelect('id')}
            className={`cursor-pointer ${sortBy === 'id' ? 'bg-accent text-accent-foreground' : ''}`}
          >
            <span className="flex items-center gap-2">
              ID {sortBy === 'id' && (sortOrder === 'asc' ? '↑' : '↓')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ModuleSearch;