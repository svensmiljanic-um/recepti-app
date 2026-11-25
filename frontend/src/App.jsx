import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api/recepti';
const VELIKOST_STRANI = 3; // število receptov na eni strani

// besedilo sestavin razdeli na posamezne sestavine: po novih vrsticah, podpičjih in vejicah
// vejica med dvema številkama (npr. 1,5 dl) ostane, ker je decimalna vejica
function razdeliSestavine(besedilo) {
    return besedilo
        .split(/\n|;|(?<!\d),|,(?!\d)/)
        .map((sestavina) => sestavina.trim())
        .filter((sestavina) => sestavina !== '');
}

function App() {
    const [recipes, setRecipes] = useState([]); // recepti na trenutni strani
    const [editingId, setEditingId] = useState(null); // id, ki ga urejamo

    const [iskanje, setIskanje] = useState(''); // besedilo v iskalnem polju
    const [filterKategorija, setFilterKategorija] = useState(''); // izbrana kategorija za filtriranje
    const [stran, setStran] = useState(0); // trenutna stran (prva je 0)
    const [skupajStrani, setSkupajStrani] = useState(0); // koliko strani je skupaj
    const [skupajRecepti, setSkupajRecepti] = useState(0); // koliko receptov je skupaj

    const [kategorije, setKategorije] = useState([]); // seznam kategorij iz backenda (fiksen)
    const [napakaKategorije, setNapakaKategorije] = useState(false); // true, če kategorij ni bilo mogoče naložiti

    const [vseckani, setVseckani] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('vseckani')) || [];
        } catch {
            return [];
        }
    });
    const [napakaVseck, setNapakaVseck] = useState(false);
    const [odprtId, setOdprtId] = useState(null); // id recepta, ki je odprt v oknu (null = okno je zaprto)

    const [formData, setFormData] = useState({ //vrednosti polj v obrazcu
        ime: '',
        opis: '',
        sestavine: '',
        navodila: '',
        cas_priprave: '',
        kategorija: ''
    });

    // recepte ponovno preberemo, ko se spremeni stran, iskanje ali kategorija
    useEffect(() => {
        fetchRecipes();
    }, [stran, iskanje, filterKategorija]);

    useEffect(() => {
        localStorage.setItem('vseckani', JSON.stringify(vseckani));
    }, [vseckani]);

    // okno z receptom zapremo s tipko Escape
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setOdprtId(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // kategorije preberemo samo enkrat, ob zagonu strani
    useEffect(() => {
        axios.get(`${API_URL}/kategorije`)
            .then((response) => setKategorije(response.data))
            .catch(() => setNapakaKategorije(true));
    }, []);

    // GET zahteva na backend (iskanje, kategorija + paginacija)
    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_URL}/stran`, {
                params: {
                    iskanje: iskanje,
                    kategorija: filterKategorija,
                    stran: stran,
                    velikost: VELIKOST_STRANI
                }
            });
            setRecipes(response.data.content); // recepti na tej strani
            setSkupajStrani(response.data.totalPages);
            setSkupajRecepti(response.data.totalElements);
        } catch (error) {
            console.error('Napaka pri pridobivanju receptov:', error);
        }
    };

    // posodobi ustrezno vrednost
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ob vpisu v iskalno polje gremo nazaj na prvo stran
    const handleSearch = (e) => {
        setIskanje(e.target.value);
        setStran(0);
    };

    // ob spremembi kategorije se vrnemo na prvo stran rezultatov
    const handleCategoryFilter = (e) => {
        setFilterKategorija(e.target.value);
        setStran(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // cas priprave pretvorimo v stevilo, ker backend pričakuje int
            const podatki = { ...formData, cas_priprave: Number(formData.cas_priprave) || 0 };

            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, podatki);
                setEditingId(null);
            } else {
                await axios.post(API_URL, podatki);
            }
            setFormData({ ime: '', opis: '', sestavine: '', navodila: '', cas_priprave: '', kategorija: '' });

            // nov recept se mora videti, zato pri dodajanju počistimo iskanje, filter in stran
            if (!editingId && (stran !== 0 || iskanje !== '' || filterKategorija !== '')) {
                setIskanje('');
                setFilterKategorija('');
                setStran(0);
            } else {
                fetchRecipes();
            }

        } catch (error) {
            console.error('Napaka pri shranjevanju recepta:', error);
        }
    };

    // napolni obrazec s podatki izbranega recepta
    const handleEdit = (recipe) => {
        setEditingId(recipe.id);
        setFormData({
            ime: recipe.ime || '',
            opis: recipe.opis || '',
            sestavine: recipe.sestavine || '',
            navodila: recipe.navodila || '',
            cas_priprave: recipe.cas_priprave || '',
            // "Brez kategorije" v obrazcu pomeni, da kategorija ni izbrana
            kategorija: recipe.kategorija === 'Brez kategorije' ? '' : (recipe.kategorija || '')
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Res želiš izbrisati ta recept?')) {
            try {
                await axios.delete(`${API_URL}/${id}`);
                // če smo izbrisali zadnji recept na strani, gremo nazaj na prejšnjo stran
                if (recipes.length === 1 && stran > 0) {
                    setStran(stran - 1);
                } else {
                    fetchRecipes();
                }
            } catch (error) {
                console.error('Napaka pri brisanju recepta:', error);
            }
        }
    };

    const handleLike = async (recipe) => {
        const jeVseckan = vseckani.includes(recipe.id);
        try {
            const response = jeVseckan
                ? await axios.delete(`${API_URL}/${recipe.id}/vseck`)
                : await axios.post(`${API_URL}/${recipe.id}/vseck`);
            setRecipes((prejsnji) => prejsnji.map((r) => (r.id === recipe.id ? response.data : r)));
            setVseckani((prejsnji) => jeVseckan ? prejsnji.filter((id) => id !== recipe.id) : [...prejsnji, recipe.id]);
            setNapakaVseck(false);
        } catch {
            setNapakaVseck(true);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ ime: '', opis: '', sestavine: '', navodila: '', cas_priprave: '', kategorija: '' });
    };

    // recept, ki je odprt v oknu
    const odprtRecept = recipes.find((r) => r.id === odprtId);

    return (
        <div className="app-container">
            <header className="app-header">
                <h1 className="app-title">Aplikacija z recepti</h1>
            </header>

            {/* Obrazec */}
            <div className="card-form">
                <h2 className="section-title">{editingId ? 'Uredi recept' : 'Dodaj nov recept'}</h2>
                <form onSubmit={handleSubmit} className="recipe-form">
                    <div className="input-group">
                        <label>Naziv jedi</label>
                        <input
                            type="text"
                            name="ime"
                            value={formData.ime}
                            onChange={handleChange}
                            required
                            maxLength={255}
                            className="form-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Opis</label>
                        <textarea
                            name="opis"
                            value={formData.opis}
                            onChange={handleChange}
                            maxLength={255}
                            className="form-textarea short-textarea"
                        />
                    </div>

                    <div className="form-row">
                        <div className="input-group flex-1">
                            <label>Sestavine</label>
                            <textarea
                                name="sestavine"
                                value={formData.sestavine}
                                onChange={handleChange}
                                placeholder="Vsako sestavino loči z vejico ali jo napiši v novo vrstico"
                                maxLength={2000}
                                className="form-textarea medium-textarea"
                            />
                        </div>
                        <div className="input-group flex-1">
                            <label>Postopek priprave</label>
                            <textarea
                                name="navodila"
                                value={formData.navodila}
                                onChange={handleChange}
                                maxLength={5000}
                                className="form-textarea medium-textarea"
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Čas priprave (v minutah)</label>
                        <input
                            type="number"
                            name="cas_priprave"
                            value={formData.cas_priprave}
                            onChange={handleChange}
                            className="form-input narrow-input"
                        />
                    </div>

                    <div className="input-group">
                        <label>Kategorija</label>
                        <select
                            name="kategorija"
                            value={formData.kategorija}
                            onChange={handleChange}
                            className="form-input narrow-input"
                        >
                            <option value="">Brez kategorije</option>
                            {kategorije.map((k) => (
                                <option key={k} value={k}>{k}</option>
                            ))}
                        </select>
                        {napakaKategorije && (
                            <span className="warning-text">
                                Kategorij ni mogoče naložiti. Recept bo shranjen brez kategorije.
                            </span>
                        )}
                    </div>

                    <div className="button-container">
                        <button type="submit" className="btn-primary">
                            {editingId ? 'Shrani spremembe' : 'Dodaj recept'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={handleCancelEdit} className="btn-secondary">
                                Prekliči
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Seznam receptov */}
            <h2 className="section-title">Seznam receptov ({skupajRecepti})</h2>

            {/* Iskanje */}
            <input
                type="text"
                placeholder="Išči po imenu ali sestavinah..."
                value={iskanje}
                onChange={handleSearch}
                className="form-input search-input"
            />

            <div className="input-group category-filter">
                <label htmlFor="filter-kategorija">Filtriraj po kategoriji</label>
                <select
                    id="filter-kategorija"
                    value={filterKategorija}
                    onChange={handleCategoryFilter}
                    disabled={napakaKategorije}
                    className="form-input narrow-input"
                >
                    <option value="">Vse kategorije</option>
                    {kategorije.map((k) => (
                        <option key={k} value={k}>{k}</option>
                    ))}
                </select>
            </div>
            {napakaKategorije && (
                <p className="warning-text" role="alert">
                    Seznama kategorij ni mogoče naložiti. Filtriranje po kategoriji ni na voljo; recepte lahko še vedno pregleduješ in iščeš brez filtra.
                </p>
            )}

            {napakaVseck && (
                <p className="warning-text" role="alert">
                    Všečka ni bilo mogoče shraniti
                </p>
            )}

            {recipes.length === 0 ? (
                <p className="empty-state">
                    {filterKategorija
                        ? iskanje
                            ? 'V tej kategoriji ni receptov, ki bi ustrezali iskanju.'
                            : 'V tej kategoriji še ni receptov.'
                        : iskanje
                            ? 'Ni receptov, ki bi ustrezali iskanju.'
                            : 'Trenutno ni vnesenih receptov. Dodajte prvega zgoraj!'}
                </p>
            ) : (
                <div className="recipe-list">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            {/* klik na ta del kartice odpre okno s celotnim receptom */}
                            <div className="card-click" onClick={() => setOdprtId(recipe.id)}>
                                <div className="card-header">
                                    <h3 className="recipe-title">{recipe.ime}</h3>
                                    <div className="card-badges">
                                        <span className="recipe-badge">{recipe.kategorija || 'Brez kategorije'}</span>
                                        {recipe.cas_priprave > 0 && (
                                            <span className="recipe-badge">{recipe.cas_priprave} min</span>
                                        )}
                                    </div>
                                </div>

                                {recipe.opis && <p className="recipe-opis">{recipe.opis}</p>}

                                <p className="card-hint">Odpri recept</p>
                            </div>

                            <div className="card-actions">
                                <button
                                    onClick={() => handleLike(recipe)}
                                    className={vseckani.includes(recipe.id) ? 'btn-like btn-like-active' : 'btn-like'}
                                >
                                    {vseckani.includes(recipe.id) ? 'Odstrani všeček' : 'Všečkaj'}
                                </button>
                                <span className="like-count">Všečkov: {recipe.vseckov || 0}</span>
                                <button onClick={() => handleEdit(recipe)} className="btn-edit">
                                    Uredi
                                </button>
                                <button onClick={() => handleDelete(recipe.id)} className="btn-delete">
                                    Izbriši
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Paginacija */}
            {skupajStrani > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setStran(stran - 1)}
                        disabled={stran === 0}
                        className="btn-secondary"
                    >
                        Prejšnja
                    </button>
                    <span>Stran {stran + 1} od {skupajStrani}</span>
                    <button
                        onClick={() => setStran(stran + 1)}
                        disabled={stran + 1 >= skupajStrani}
                        className="btn-secondary"
                    >
                        Naslednja
                    </button>
                </div>
            )}

            {/* Okno s celotnim receptom */}
            {odprtRecept && (
                <div className="modal-overlay" onClick={() => setOdprtId(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => setOdprtId(null)} className="modal-close">
                            Zapri
                        </button>

                        <h2 className="modal-title">{odprtRecept.ime}</h2>
                        <div className="card-badges modal-badges">
                            <span className="recipe-badge">{odprtRecept.kategorija || 'Brez kategorije'}</span>
                            {odprtRecept.cas_priprave > 0 && (
                                <span className="recipe-badge">{odprtRecept.cas_priprave} min</span>
                            )}
                            <span className="recipe-badge">Všečkov: {odprtRecept.vseckov || 0}</span>
                        </div>

                        {odprtRecept.opis && <p className="recipe-opis">{odprtRecept.opis}</p>}

                        {odprtRecept.sestavine && (
                            <div className="detail-block modal-block">
                                <strong>Sestavine:</strong>
                                {/* vsaka sestavina je svoja točka v seznamu */}
                                <ul className="ingredient-list">
                                    {razdeliSestavine(odprtRecept.sestavine).map((sestavina, i) => (
                                        <li key={i}>{sestavina}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {odprtRecept.navodila && (
                            <div className="detail-block modal-block">
                                <strong>Navodila:</strong>
                                <p className="detail-text">{odprtRecept.navodila}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;