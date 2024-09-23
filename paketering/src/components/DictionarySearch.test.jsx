import { render, screen, fireEvent } from '@testing-library/react';
import DictionarySearch from './DictionarySearch';

global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          word: 'test',
          meanings: [{ definitions: [{ definition: 'A procedure to assess performance.' }] }],
          phonetics: [{ audio: '' }]
        }
      ])
  })
);

describe('DictionarySearch Component', () => {
  test('Shows error message when search field is empty', () => {
    render(<DictionarySearch />);
    
    const searchButton = screen.getByText(/Sök/i);
    fireEvent.click(searchButton);
    
    const errorMessage = screen.getByText(/Sökfältet är tomt. Ange ett ord./i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('Displays result after a successful search', async () => {
    render(<DictionarySearch />);
    
    const input = screen.getByPlaceholderText(/Skriv in ett ord/i);
    fireEvent.change(input, { target: { value: 'test' } });
    
    const searchButton = screen.getByText(/Sök/i);
    fireEvent.click(searchButton);
    
    const wordElement = await screen.findByText(/test/i);
    const definitionElement = await screen.findByText(/A procedure to assess performance./i);
    
    expect(wordElement).toBeInTheDocument();
    expect(definitionElement).toBeInTheDocument();
  });

  test('Shows error message for invalid request', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false
      })
    );

    render(<DictionarySearch />);
    
    const input = screen.getByPlaceholderText(/Skriv in ett ord/i);
    fireEvent.change(input, { target: { value: 'invalidword' } });
    
    const searchButton = screen.getByText(/Sök/i);
    fireEvent.click(searchButton);
    
    const errorMessage = await screen.findByText(/Ingen definition hittades./i);
    expect(errorMessage).toBeInTheDocument();
  });
});
