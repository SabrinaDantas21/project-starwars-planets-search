import { useState, useEffect } from 'react';
import { usePlanets, Planet } from '../context/PlanetsContext';

type PlanetKey = keyof Planet;

type PlanetProperty = 'name' | 'population' | 'orbital_period' |
'diameter' | 'rotation_period' | 'surface_water';

function FilteredTable() {
  const { planets: originalPlanets, applyFilter,
    filterText, setFilterText } = usePlanets();
  const [filters, setFilters,
  ] = useState<{ column: PlanetKey; comparison: string; value: string }[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<PlanetKey>('population');
  const [comparisonOperator, setComparisonOperator,
  ] = useState<'maior que' | 'menor que' | 'igual a'>('maior que');
  const [filterValue, setFilterValue] = useState('0');
  const [availableColumns, setAvailableColumns] = useState<PlanetKey[]>([]);
  const [filteredColumns, setFilteredColumns] = useState<PlanetKey[]>([]);

  useEffect(() => {
    if (originalPlanets.length > 0) {
      const columns = Object.keys(originalPlanets[0]) as PlanetKey[];
      setAvailableColumns(columns.filter((column) => !filteredColumns
        .includes(column) && ['population', 'orbital_period',
        'diameter', 'rotation_period', 'surface_water'].includes(column)));
    }
  }, [originalPlanets, filteredColumns]);

  const handleFilter = () => {
    const newFilter = { column: selectedColumn,
      comparison: comparisonOperator,
      value: filterValue };
    setFilters([...filters, newFilter]);
    const updatedFilteredColumns = [...filteredColumns, selectedColumn];
    setFilteredColumns(updatedFilteredColumns);
    applyFilter(selectedColumn, comparisonOperator, filterValue);
    setAvailableColumns(availableColumns
      .filter((column) => !updatedFilteredColumns.includes(column)));
    setSelectedColumn(availableColumns[0]);
    setComparisonOperator('maior que');
    setFilterValue('0');
  };

  const resetFilter = () => {
    setFilters([]);
    setFilteredColumns([]);
    if (originalPlanets && originalPlanets.length > 0) {
      const columns = Object.keys(originalPlanets[0])
        .filter((column) => !filteredColumns.includes(column as PlanetProperty)
        && ['population', 'orbital_period',
          'diameter', 'rotation_period', 'surface_water']
          .includes(column as PlanetProperty)) as PlanetProperty[];

      setAvailableColumns(columns);
    }

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
        {availableColumns.map((column) => (
          <option key={ column } value={ column }>
            {column}
          </option>
        ))}
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

      <button
        type="button"
        onClick={ handleFilter }
        data-testid="button-filter"
        disabled={ availableColumns.length === 0 }
      >
        Filter
      </button>

      <button
        type="button"
        onClick={ resetFilter }
        data-testid="button-reset"
      >
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
            {originalPlanets.length > 0 && Object
              .keys(originalPlanets[0]).map((column) => (
                <th key={ column }>{column}</th>
              ))}
          </tr>
        </thead>
        <tbody>
          {filteredPlanets.map((planet, index) => (
            <tr key={ index }>
              {Object.keys(originalPlanets[0]).map((column) => (
                <td key={ column }>{planet[column as PlanetKey] ?? ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FilteredTable;
