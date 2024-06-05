import React,
{ createContext, useContext, useState, Dispatch, SetStateAction } from 'react';

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

export interface PlanetsContextType {
  planets: Planet[];
  filterText: string;
  setFilterText: Dispatch<SetStateAction<string>>;
  applyFilter: (column: keyof Planet,
    operator: ComparisonOperator, value: string) => void;
  resetFilter: () => void;
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

  React.useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        const fetchedPlanets: Planet[] = data.results.map((planet: any) => {
          const { residents, ...cleanedPlanet } = planet;
          return cleanedPlanet;
        });
        setOriginalPlanets(fetchedPlanets);
        setPlanets(fetchedPlanets);
      })
      .catch((error) => {
        console.error('Error fetching planets:', error);
      });
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
  };

  const contextValue: PlanetsContextType = {
    planets,
    filterText,
    setFilterText,
    applyFilter,
    resetFilter,
  };

  return (
    <PlanetsContext.Provider value={ contextValue }>
      {children}
    </PlanetsContext.Provider>
  );
}

export default PlanetsProvider;
