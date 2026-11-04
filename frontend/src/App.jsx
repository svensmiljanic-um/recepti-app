import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8080/api/recepti';
const VELIKOST_STRANI = 3; // število receptov na eni strani

function App() {
    const [recipes, setRecipes] = useState([]); // recepti na trenutni strani
    const [editingId, setEditingId] = useState(null); // id, ki ga urejamo

    const [iskanje, setIskanje] = useState(''); // besedilo v iskalnem polju
    const [stran, setStran] = useState(0); // trenutna stran (prva je 0)
    const [skupajStrani, setSkupajStrani] = useState(0); // koliko strani je skupaj
    const [skupajRecepti, setSkupajRecepti] = useState(0); // koliko receptov je skupaj

    const [formData, setFormData] = useState({ //vrednosti polj v obrazcu
        ime: '',
        opis: '',
        sestavine: '',
        navodila: '',
        cas_priprave: ''
    });

    // recepte ponovno preberemo, ko se spremeni stran ali iskanje
    useEffect(() => {
        fetchRecipes();
    }, [stran, iskanje]);

    // GET zahteva na backend (iskanje + paginacija)
    const fetchRecipes = async () => {
        try {
            const response = await axios.get(`${API_URL}/stran`, {
                params: { iskanje: iskanje, stran: stran, velikost: VELIKOST_STRANI }
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
            setFormData({ ime: '', opis: '', sestavine: '', navodila: '', cas_priprave: '' });

            if (!editingId && (stran !== 0 || iskanje !== '')) {
                setIskanje('');
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
            cas_priprave: recipe.cas_priprave || ''
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

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ ime: '', opis: '', sestavine: '', navodila: '', cas_priprave: '' });
    };

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

            {recipes.length === 0 ? (
                <p className="empty-state">
                    {iskanje ? 'Ni receptov, ki bi ustrezali iskanju.' : 'Trenutno ni vnesenih receptov. Dodajte prvega zgoraj!'}
                </p>
            ) : (
                <div className="recipe-list">
                    {recipes.map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                            <div className="card-header">
                                <h3 className="recipe-title">{recipe.ime}</h3>
                                {recipe.cas_priprave > 0 && (
                                    <span className="recipe-badge">{recipe.cas_priprave} min</span>
                                )}
                            </div>

                            {recipe.opis && <p className="recipe-opis">{recipe.opis}</p>}

                            <div className="recipe-details">
                                {recipe.sestavine && (
                                    <div className="detail-block">
                                        <strong>Sestavine:</strong>
                                        <p className="detail-text">{recipe.sestavine}</p>
                                    </div>
                                )}
                                {recipe.navodila && (
                                    <div className="detail-block">
                                        <strong>Navodila:</strong>
                                        <p className="detail-text">{recipe.navodila}</p>
                                    </div>
                                )}
                            </div>

                            <div className="card-actions">
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
        </div>
    );
}

export default App;
