import { render, screen } from '@testing-library/react';
import App from '../App';

 
describe('testes pro requisito 5', () => {
  test('testando botões e o título', async () => {
    
    render(<App/>);
  
    const botaoFilter = await screen.findByTestId('button-filter');
    const botaoReset = await screen.findByTestId('button-reset');
    const inputColumn = await screen.findByTestId('column-filter');
    const title = await screen.findByText('Planets Table');
    const valueFilter = await screen.findByTestId('value-filter');
    const inputName = await screen.findByPlaceholderText('Filter by name...')
    expect(title).toBeInTheDocument();
    expect(botaoReset).toBeInTheDocument();
    expect(botaoFilter).toBeInTheDocument();
    expect(inputColumn).toBeInTheDocument();
    expect(botaoReset).toHaveTextContent('Reset');
    expect(botaoFilter).toHaveTextContent('Filter');
    expect(valueFilter).toBeInTheDocument();
    expect(inputName).toBeInTheDocument();
  });
  
});
