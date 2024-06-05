import React, { useState, useEffect } from 'react';
import PlanetsContext, { Planet } from './PlanetsContext';

export default function PlanetsProvider({ children }: { children: React.ReactNode }) {
  const [planets, setPlanets] = useState<Planet[]>([]);
  const [filterText, setFilterText] = useState<string>('');

  useEffect(() => {
    fetch('https://swapi.dev/api/planets')
      .then((response) => response.json())
      .then((data) => {
        const planetsData: Planet[] = data.results.map((planet: any) => {
          const { residents, ...cleanedPlanet } = planet;
          return cleanedPlanet;
        });
        setPlanets(planetsData);
      })
      .catch((error) => console.error('Erro ao buscar planetas:', error));
  }, []);

  const contextValue = {
    planets,
    filterText,
    setFilterText,
  };

  return (
    <PlanetsContext.Provider value={ contextValue }>
      {children}
    </PlanetsContext.Provider>
  );
}
