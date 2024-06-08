import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('FilteredTable Component', () => {
  test('adiciona um filtro corretamente', () => {
    render(<App />);
    const filterButton = screen.getByTestId('button-filter');
    fireEvent.click(filterButton);
    const filters = screen.getAllByTestId('filter');
    expect(filters.length).toBeGreaterThan(0);
  });

  test('reseta filtros corretamente', () => {
    render(<App />);
    const resetButton = screen.getByTestId('button-reset');
    fireEvent.click(resetButton);
    const filters = screen.queryAllByTestId('filter');
    expect(filters.length).toBe(0);
  });

  test('remove um filtro corretamente', () => {
    render(<App />);
    const filterButton = screen.getByTestId('button-filter');
    fireEvent.click(filterButton);
    const removeButton = screen.getByText('X');
    fireEvent.click(removeButton);
    const filters = screen.queryAllByTestId('filter');
    expect(filters.length).toBe(0);
  });

  test('remove todos os filtros corretamente', () => {
    render(<App />);
    const filterButton = screen.getByTestId('button-filter');
    fireEvent.click(filterButton);
    const removeAllButton = screen.getByTestId('button-remove-filters');
    fireEvent.click(removeAllButton);
    const filters = screen.queryAllByTestId('filter');
    expect(filters.length).toBe(0);
  });

});
