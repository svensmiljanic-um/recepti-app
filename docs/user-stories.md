# Uporabniške zgodbe

| ID    | Zgodba                        | Odgovorni član   |
|-------|-------------------------------|------------------|
| US-01 | Določitev kategorije recepta  | Sven Smiljanić   |
| US-02 | Filtriranje receptov po kategoriji | Žak Lipič        |
| US-03 |                               | Luka Orešnik     |

## US-01: Določitev kategorije recepta

**Odgovorni član:** Sven Smiljanić

**Zgodba:** Kot uporabnik želim receptu ob dodajanju ali urejanju določiti kategorijo, da je recept pravilno razvrščen in ga drugi lažje najdejo.

**Sprejemni kriteriji:**

1. **Given:** odprt je obrazec za nov recept z izpolnjenimi obveznimi polji.
   **When:** izberem kategorijo »Sladica« in recept shranim.
   **Then:** recept je shranjen in v seznamu receptov je ob njem prikazana kategorija »Sladica«.
2. **Given:** odprt je obrazec za nov recept z izpolnjenimi obveznimi polji, kategorija ni izbrana.
   **When:** recept shranim.
   **Then:** recept je shranjen s kategorijo »Brez kategorije«.
3. **Given:** recept s kategorijo »Juha« je odprt za urejanje.
   **When:** kategorijo spremenim v »Glavna jed« in shranim.
   **Then:** v seznamu receptov je ob receptu prikazana kategorija »Glavna jed«.
4. **Given:** seznama kategorij ni mogoče naložiti.
   **When:** odprem obrazec za nov recept.
   **Then:** prikaže se opozorilo, da kategorij ni mogoče izbrati, recept pa je še vedno mogoče shraniti s kategorijo »Brez kategorije«.
   **Podrobnosti implementacije:**
- V entiteto `Recepti` se doda polje `kategorija` (`String`, stolpec `kategorija`). Ker je v projektu `ddl-auto=update`, Hibernate stolpec doda sam. Obstoječi recepti imajo vrednost `null`, ki se prikaže kot »Brez kategorije«.
- Kategorije so fiksen seznam v kodi: Predjed, Glavna jed, Priloga, Juha, Sladica, Pijača. Vsak recept ima eno kategorijo (izbira več kategorij iz primera uporabe v tej iteraciji ni vključena).
- Nov end point `GET /api/recepti/kategorije` vrne seznam kategorij, opis za Swagger z `@Operation`.
- Obličje (`App.jsx`): v obrazcu spustni seznam kategorij (`<select>`), nalaganje seznama ob zagonu z Axiosom, ob napaki opozorilo; ob receptu v seznamu prikaz kategorije.
  **Naloge (sub-issues):**
- **US-01-T1:** Zaledje: polje `kategorija` v `Recepti` in end point za seznam kategorij. *Odgovoren: Sven Smiljanić.*
- **US-01-T2:** Obličje: spustni seznam kategorij v obrazcu in prikaz kategorije ob receptu. *Odgovoren: Sven Smiljanić.*

## US-02: Filtriranje receptov po kategoriji

**Odgovorni član:** Žak Lipič

**Zgodba:** Kot <vloga> želim <cilj>, da <korist>

**Sprejemni kriteriji**

1. **Given:** XYZ
   **When:** XYZ
   **Then:** XYZ
2. **Given:** XYZ
   **When:** XYZ
   **Then:** XYZ
   **Podrobnosti implementacije:**
- XYZ
- XYZ
   **Naloge (sub-issues)**





## Definition of Ready

- Uporabniške zgodbe so jasno definirane.
- Sprejemni kriteriji so merljivi (podane so konkretne vrednosti in sporočila).
- Ekipa razume namen: razvrstitev receptov v kategorije in lažje iskanje.
- Podrobnosti implementacije so zapisane.
- 
## Preverjanje po implementaciji

Po implementaciji se vsak sprejemni kriterij preveri ročno v aplikaciji (in po potrebi v Swaggerju). Rezultat se zapiše v ustrezen GitHub Issue ob zaprtju zgodbe.