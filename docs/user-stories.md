# Uporabniške zgodbe

Izbrani funkcionalnosti sta kategorije receptov (US-01 in US-02) ter všečkanje receptov (US-03). Zgodbe izhajajo iz primerov uporabe v [PrimeriUporabe.md](PrimeriUporabe.md). Uporabniških računov še ni, zato se zgodbe v tej iteraciji nanašajo na vlogo »uporabnik«.

| ID    | Zgodba                        | Odgovorni član   |
|-------|-------------------------------|------------------|
| US-01 | Določitev kategorije recepta  | Sven Smiljanić   |
| US-02 | Filtriranje receptov po kategoriji | Žak Lipič        |
| US-03 | Všečkanje receptov            | Luka Orešnik     |

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
- Kategorije so fiksen seznam v kodi: Predjed, Glavna jed, Priloga, Juha, Sladica, Pijača. Vsak recept ima eno kategorijo (izbira več kategorij iz primera uporabe v tej iteraciji ni vključena). Uporabnik novih kategorij ne more dodajati. Če kategorija ni izbrana, backend nastavi »Brez kategorije«.
- Nov end point `GET /api/recepti/kategorije` vrne seznam kategorij, opis za Swagger z `@Operation`.
- Obličje (`App.jsx`): v obrazcu spustni seznam kategorij (`<select>`), nalaganje seznama ob zagonu z Axiosom, ob napaki opozorilo; ob receptu v seznamu prikaz kategorije.

**Naloge (sub-issues):**
- **US-01-T1:** Zaledje: polje `kategorija` v `Recepti` in end point za seznam kategorij. *Odgovoren: Sven Smiljanić.*
- **US-01-T2:** Obličje: spustni seznam kategorij v obrazcu in prikaz kategorije ob receptu. *Odgovoren: Sven Smiljanić.*

## US-02: Filtriranje receptov po kategoriji

**Odgovorni član:** Žak Lipič

**Zgodba:** Kot uporabnik želim recepte filtrirati po kategoriji, da lažje najdem recept, ki ga iščem.

**Sprejemni kriteriji:**

1. **Given:** seznam vsebuje recepte iz kategorij »Sladica« in »Juha«.  
   **When:** uporabnik izbere kategorijo »Sladica«.  
   **Then:** prikažejo se samo recepti s kategorijo »Sladica«.
2. **Given:** uporabnik je izbral kategorijo »Juha« in obstajajo recepti, ki ustrezajo iskalnemu nizu »buča«.  
   **When:** uporabnik vpiše »buča« v iskalno polje.  
   **Then:** prikažejo se samo recepti, ki ustrezajo iskanju in imajo kategorijo »Juha«.
3. **Given:** v izbrani kategoriji ni receptov.  
   **When:** uporabnik izbere to kategorijo.  
   **Then:** prikaže se sporočilo »V tej kategoriji še ni receptov«.
4. **Given:** uporabnik filtrira seznam po posamezni kategoriji.  
   **When:** izbere možnost »Vse kategorije«.  
   **Then:** filter se odstrani in prikažejo se recepti vseh kategorij.
5. **Given:** seznama kategorij ni mogoče naložiti.  
   **When:** uporabnik odpre izbiro kategorije.  
   **Then:** prikaže se opozorilo, filtriranje po kategoriji ni na voljo, seznam receptov pa je še vedno mogoče pregledovati in iskati brez tega filtra.

**Podrobnosti implementacije:**
- Zgodba je odvisna od US-01, ki doda kategorijo receptu in omogoči pridobitev seznama kategorij.
- Ker so kategorije fiksne (US-01), se filtrira po natančnem ujemanju kategorije. Obličje pošlje izbrano kategorijo kot parameter `kategorija` na `GET /api/recepti/stran`, prazna vrednost pomeni »Vse kategorije«.
- Za posamezen recept se uporablja ena kategorija. Uporabnik lahko izbere eno kategorijo ali »Vse kategorije«.
- Backend razširi obstoječe paginirano iskanje tako, da izbrani kategoriji in iskalnemu nizu ustrezajo isti rezultati. Brez izbrane kategorije se obnašanje iskanja ne spremeni.
- Frontend doda izbiro kategorije in jo poveže z obstoječim iskalnim poljem. Ob spremembi kategorije se seznam začne na prvi strani; ohranjena je paginacija treh receptov na stran in razvrščanje od najnovejšega do najstarejšega.
- Če kategorij ni mogoče naložiti, uporabnik še vedno lahko išče in pregleduje recepte brez filtra kategorije.

**Naloge (sub-issues):**
- **US-02-T1 — Backend: filtriranje receptov po kategoriji.** Razširiti poizvedbo za seznam receptov tako, da upošteva izbrano kategorijo skupaj z iskalnim nizom in paginacijo. **Odgovoren:** Žak Lipič.
- **US-02-T2 — Frontend: izbira kategorije in prikaz filtriranih rezultatov.** Dodati izbiro kategorije, povezati jo z obstoječim iskanjem, ob spremembi filtra ponastaviti stran in prikazati stanje brez rezultatov. **Odgovoren:** Žak Lipič.


## US-03: Všečkanje receptov

**Odgovorni član:** Luka Orešnik

**Prioriteta:** Srednja | **Ocena zahtevnosti:** 3 točke

**Zgodba:** Kot uporabnik želim všečkati recept, da izrazim, da mi je všeč, in da drugi vidijo, kateri recepti so priljubljeni.

**Sprejemni kriteriji:**

1. **Given:** recept ima 0 všečkov in ga uporabnik še ni všečkal.
   **When:** uporabnik pritisne gumb »Všečkaj«.
   **Then:** ob receptu je prikazano število všečkov 1, gumb pa se spremeni v »Odstrani všeček«.
2. **Given:** uporabnik je recept že všečkal in ima ta 1 všeček.
   **When:** uporabnik pritisne gumb »Odstrani všeček«.
   **Then:** število všečkov je 0 in gumb se spremeni nazaj v »Všečkaj«.
3. **Given:** recept ima 5 všečkov in strežnik ni dosegljiv.
   **When:** uporabnik pritisne gumb »Všečkaj«.
   **Then:** prikaže se sporočilo »Všečka ni bilo mogoče shraniti«, število všečkov ostane 5.
4. **Given:** recept ima 5 všečkov, od tega je enega dodal uporabnik.
   **When:** uporabnik osveži stran.
   **Then:** ob receptu je še vedno prikazano število 5, gumb pa prikazuje »Odstrani všeček«.

**Podrobnosti implementacije:**
- V entiteto `Recepti` se doda polje `vseckov` tipa `Integer` (privzeto 0). Uporabi se `Integer`, ne `int`, ker bi Hibernate pri `int` dodal stolpec `NOT NULL`, kar pri obstoječih vrsticah v bazi ne uspe. Vrednost `null` se obravnava kot 0.
- Nova end pointa z opisom `@Operation`: `POST /api/recepti/{id}/vseck` poveča število za 1, `DELETE /api/recepti/{id}/vseck` ga zmanjša za 1 (nikoli pod 0). Oba vrneta 200 s posodobljenim receptom ali 404, če recept ne obstaja.
- Metoda `PUT /api/recepti/{id}` števila všečkov ne spreminja.
- Prijave v aplikaciji še ni, zato se v tej iteraciji všečkanje ne omejuje na registrirane uporabnike. Ali je uporabnik recept že všečkal, si obličje zapomni v `localStorage` (seznam ID-jev všečkanih receptov).
- Obličje (`App.jsx`): ob vsakem receptu gumb »Všečkaj« / »Odstrani všeček« in prikaz števila, klic z Axiosom, ob napaki sporočilo.

**Naloge (sub-issues):**
- **US-03-T1 — Backend: polje `vseckov` in end pointa za všečkanje.** Dodati polje v `Recepti` ter `POST` in `DELETE` `/api/recepti/{id}/vseck`. **Odgovoren:** Luka Orešnik.
- **US-03-T2 — Frontend: gumb za všečkanje in prikaz števila všečkov.** Dodati gumb in število ob receptu, shranjevanje stanja v `localStorage` in sporočilo ob napaki. **Odgovoren:** Luka Orešnik.

## Definition of Ready

- Uporabniške zgodbe so jasno definirane.
- Sprejemni kriteriji so merljivi (podane so konkretne vrednosti in sporočila).
- Ekipa razume namen: razvrstitev receptov v kategorije, lažje iskanje in izražanje priljubljenosti receptov.
- Podrobnosti implementacije so zapisane.

## Preverjanje po implementaciji

Po implementaciji se vsak sprejemni kriterij preveri ročno v aplikaciji (in po potrebi v Swaggerju). Rezultat se zapiše v ustrezen GitHub Issue ob zaprtju zgodbe.