import React, { createContext,
  useContext, useState, Dispatch, SetStateAction } from 'react';

export interface Planet {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  films: string[];
  created: string;
  edited: string;
  url: string;
}

type ComparisonOperator = 'maior que' | 'menor que' | 'igual a';

interface FilterState {
  column: keyof Planet;
  comparison: ComparisonOperator;
  value: string;
}

export interface PlanetsContextType {
  planets: Planet[];
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  applyFilter: (column: keyof Planet,
    operator: ComparisonOperator, value: string) => void;
  resetFilter: () => void;
  addFilter: () => void;
  filters: FilterState[];
}

const PlanetsContext = createContext<PlanetsContextType | undefined>(undefined);

export const usePlanets = () => {
  const context = useContext(PlanetsContext);
  if (!context) {
    throw new Error('usePlanets must be used within a PlanetsProvider');
  }
  return context;
};

function PlanetsProvider({ children }: { children: React.ReactNode }) {
  const [originalPlanets, setOriginalPlanets] = useState<Planet[]>([]);
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [filterText, setFilterText] = useState<string>('');
  const [filters, setFilters] = useState<FilterState[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://swapi.dev/api/planets');
        const data = await response.json();
        const fetchedPlanets = data.results.map((planet: any) => {
          const { residents, ...cleanedPlanet } = planet;
          return cleanedPlanet;
        });
        setOriginalPlanets(fetchedPlanets);
        setPlanets(fetchedPlanets);
      } catch (error) {
        console.error('Error fetching planets:', error);
      }
    };
    fetchData();
  }, []);

  const applyFilter = (
    column: keyof Planet,
    operator: ComparisonOperator,
    value: string,
  ) => {
    const filterValue = parseFloat(value);

    const filteredPlanets = planets.filter((planet) => {
      const planetValue = parseFloat(String(planet[column]));
      if (Number.isNaN(planetValue)) return false;
      switch (operator) {
        case 'maior que':
          return planetValue > filterValue;
        case 'menor que':
          return planetValue < filterValue;
        case 'igual a':
          return planetValue === filterValue;
        default:
          return true;
      }
    });

    setPlanets([...filteredPlanets]);
  };

  const resetFilter = () => {
    setPlanets(originalPlanets);
    setFilterText('');
    setFilters([]);
  };

  const addFilter = () => {
    const availableColumns = Object.keys(originalPlanets[0]) as (keyof Planet)[];
    const filteredColumns = filters.map((filter) => filter.column);
    const remainingColumns = availableColumns.filter(
      (column) => !filteredColumns.includes(column),
    );

    if (remainingColumns.length > 0) {
      setFilters([
        ...filters,
        {
          column: remainingColumns[0],
          comparison: 'maior que',
          value: '0',
        },
      ]);
    }
  };

  const contextValue: PlanetsContextType = {
    planets,
    filterText,
    setFilterText,
    applyFilter,
    resetFilter,
    addFilter,
    filters,
  };

  return (
    <PlanetsContext.Provider value={ contextValue }>
      {children}
    </PlanetsContext.Provider>
  );
}

export default PlanetsProvider;
