import { useState, useEffect } from 'react';
import { usePlanets, Planet } from '../context/PlanetsContext';

type PlanetKey = keyof Planet;

function FilteredTable() {
  const { planets: originalPlanets, applyFilter,
    filterText, setFilterText } = usePlanets();
  const [selectedColumn, setSelectedColumn] = useState<PlanetKey>('population');
  const [comparisonOperator, setComparisonOperator,
  ] = useState<'maior que' | 'menor que' | 'igual a'>('maior que');
  const [filterValue, setFilterValue] = useState('0');
  const [availableColumns, setAvailableColumns] = useState<PlanetKey[]>([]);

  useEffect(() => {
    if (originalPlanets.length > 0) {
      const columns = Object.keys(originalPlanets[0]) as PlanetKey[];
      setAvailableColumns(columns);
    }
  }, [originalPlanets]);

  const handleFilter = () => {
    applyFilter(selectedColumn, comparisonOperator, filterValue);
  };

  const resetFilter = () => {
    setSelectedColumn('population');
    setComparisonOperator('maior que');
    setFilterValue('0');
  };

  const filteredPlanets = originalPlanets.filter((planet) => {
    if (!filterText) return true;
    return planet.name.toLowerCase().includes(filterText.toLowerCase());
  });

  return (
    <div>
      <select
        value={ selectedColumn }
        onChange={ (e) => setSelectedColumn(e.target.value as PlanetKey) }
        data-testid="column-filter"
      >
        <option value="population">population</option>
        <option value="orbital_period">orbital_period</option>
        <option value="diameter">diameter</option>
        <option value="rotation_period">rotation_period</option>
        <option value="surface_water">surface_water</option>
      </select>
      <select
        value={ comparisonOperator }
        onChange={ (e) => setComparisonOperator(e
          .target.value as 'maior que' | 'menor que' | 'igual a') }
        data-testid="comparison-filter"
      >
        <option value="maior que">maior que</option>
        <option value="menor que">menor que</option>
        <option value="igual a">igual a</option>
      </select>
      <input
        type="number"
        value={ filterValue }
        onChange={ (e) => setFilterValue(e.target.value) }
        data-testid="value-filter"
      />
      <button type="button" onClick={ handleFilter } data-testid="button-filter">
        Filter
      </button>
      <button type="reset" onClick={ resetFilter } data-testid="button-reset">
        Reset
      </button>
      <h2>Planets Table</h2>
      <input
        type="text"
        placeholder="Filter by name..."
        value={ filterText }
        onChange={ (e) => setFilterText(e.target.value) }
        data-testid="name-filter"
      />
      <table data-testid="planets-table">
        <thead>
          <tr>
            {availableColumns.map((column) => (
              <th key={ column }>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredPlanets.map((planet, index) => (
            <tr key={ index }>
              {availableColumns.map((column) => (
                <td key={ column }>{planet[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilteredTable;
