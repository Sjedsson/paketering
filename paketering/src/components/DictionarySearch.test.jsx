import { render, screen, fireEvent } from '@testing-library/react';
import DictionarySearch from './DictionarySearch';

// Vi mockar fetch-anropet här, så att vi inte gör riktiga anrop varje gång vi testar... ingen vill vänta på API
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,  // Vi låtsas att API:et är på gott humör och returnerar ett bra svar
    json: () =>
      Promise.resolve([
        {
          word: 'test',
          meanings: [{ definitions: [{ definition: 'A procedure to assess performance.' }] }], 
          phonetics: [{ audio: '' }]  // Ljud finns... men vi bryr oss inte om det just nu
        }
      ])
  })
);

describe('DictionarySearch Component', () => {
  test('Visar felmeddelande när sökfältet är tomt', () => {
    render(<DictionarySearch />);  // Rendera komponenten, dags för showtime!
    
    const searchButton = screen.getByText(/Sök/i);  // Ah, sökknappen. Dags att klicka på den
    fireEvent.click(searchButton);  // Simulerar en användare som är lite för snabb utan att skriva nåt
    
    const errorMessage = screen.getByText(/Sökfältet är tomt. Ange ett ord./i);  // Oops, glömde skriva nåt, här kommer felet!
    expect(errorMessage).toBeInTheDocument();  // Japp, vi förväntar oss att se det här röda lilla meddelandet nu
  });

  test('Visar resultat efter en lyckad sökning', async () => {
    render(<DictionarySearch />);  // Vi kör igång igen
    
    const input = screen.getByPlaceholderText(/Skriv in ett ord/i);  // Var ska vi skriva? Jo, här.
    fireEvent.change(input, { target: { value: 'test' } });  // Skriv in 'test', ett enkelt men pålitligt ord
    
    const searchButton = screen.getByText(/Sök/i);  // Sökknappen igen. Nu är vi seriösa.
    fireEvent.click(searchButton);  // Vi trycker på knappen och väntar på resultatet
    
    // Nu borde vi se resultatet... hoppas API:et inte har en dålig dag
    const wordElement = await screen.findByText(/test/i);
    const definitionElement = await screen.findByText(/A procedure to assess performance./i);
    
    expect(wordElement).toBeInTheDocument();  // Ordet 'test' borde dyka upp
    expect(definitionElement).toBeInTheDocument();  // Och en definition som faktiskt förklarar nåt
  });

  test('Visar felmeddelande vid ogiltig förfrågan', async () => {
    global.fetch = vi.fn(() =>  // Vi ändrar vårt mock nu för att se hur det funkar när API:et inte hittar nåt
      Promise.resolve({
        ok: false  // "Nope", säger API:et, "det här ordet finns inte"
      })
    );

    render(<DictionarySearch />);  // Renderar om vår kära komponent
    
    const input = screen.getByPlaceholderText(/Skriv in ett ord/i);  // Dags att skriva nåt skumt
    fireEvent.change(input, { target: { value: 'invalidword' } });  // "invalidword", finns det ens?

    const searchButton = screen.getByText(/Sök/i);  // Samma gamla sökknapp, vi klickar igen
    fireEvent.click(searchButton);  // Och där trycker vi, redo för att se ett felmeddelande

    // Vi borde få ett surt felmeddelande om att definitionen inte hittades
    const errorMessage = await screen.findByText(/Ingen definition hittades./i);
    expect(errorMessage).toBeInTheDocument();  // Japp, det här var väntat. Ingen definition.
  });
});
