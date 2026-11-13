# Aplikacija za recepte

Spletna aplikacija za shranjevanje, pregledovanje, urejanje in brisanje receptov.
Zaledje je narejeno v Spring Boot, obličje v Reactu, podatki pa so shranjeni v podatkovni bazi PostgreSQL.

Avtor: Sven Smiljanić <br>
Program: Informatika in podatkovne tehnologije (IPT) <br>
Predmet Razvoj informacijskih sistemov (RIS) <br>

## Kazalo

1. [O projektu](#1-o-projektu)
2. [Uporabljene tehnologije](#2-uporabljene-tehnologije)
3. [Struktura projekta](#3-struktura-projekta)
4. [Navodila za nameščanje in zagon](#4-navodila-za-nameščanje-in-zagon)
5. [Navodila za razvijalce](#5-navodila-za-razvijalce)
6. [Standardi kodiranja](#6-standardi-kodiranja)

---

## 1. O projektu

Aplikacija uporabniku omogoča, da na enem mestu hrani svoje recepte. Zaledje (backend) in obličje (frontend) sta ločena projekta v ločenih mapah, ki komunicirata prek REST API-ja.

**Cilji projekta**
- vzpostaviti delujočo spletno aplikacijo z ločenim zaledjem in obličjem,
- podatke trajno shranjevati v podatkovni bazi PostgreSQL,
- API dokumentirati s Swaggerjem (OpenAPI).

**Funkcionalnosti**
- dodajanje, pregledovanje (vseh in enega recepta), posodabljanje in brisanje receptov (CRUD),
- iskanje receptov po imenu ali sestavinah (ne razlikuje velikih in malih črk),
- paginacija seznama (obličje zahteva 3 recepte na stran, najnovejši so zgoraj).
- 
### Podatkovni model

Tabela `recepti` (ustvari se samodejno ob prvem zagonu zaledja):

| Stolpec        | Tip                    | Opis                                  |
|----------------|------------------------|---------------------------------------|
| `id`           | `bigint` (primarni ključ) | unikatni identifikator, ga dodeli baza |
| `ime`          | `varchar(255)`         | naziv jedi                            |
| `opis`         | `varchar(255)`         | kratek povzetek jedi                  |
| `sestavine`    | `varchar(2000)`        | seznam sestavin s količinami          |
| `navodila`     | `varchar(5000)`        | postopek priprave                     |
| `cas_priprave` | `integer`              | čas priprave v minutah                |

### Besednjak

| Izraz | Razlaga |
|---|---|
| **Recept** | Zapis, ki opisuje pripravo določene jedi. V aplikaciji vsebuje ime, kratek opis, seznam sestavin, navodila za pripravo in predvideni čas priprave. |
| **Ime recepta** | Naziv jedi, po katerem uporabnik prepozna recept; uporablja se tudi pri iskanju. |
| **Opis recepta** | Kratek povzetek jedi, ki uporabniku pomaga oceniti, ali ga recept zanima. |
| **Sestavina** | Živilo ali drug element, potreben za pripravo jedi. Pri receptu je naveden skupaj s količino. |
| **Količina sestavine** | Mere ali število enot posamezne sestavine, potrebne za pripravo recepta, na primer 200 g ali 2 kosa. |
| **Navodila za pripravo** | Zaporedje korakov, ki uporabnika vodi od priprave sestavin do dokončane jedi. |
| **Čas priprave** | Predvideno število minut, potrebnih za pripravo jedi po receptu. |
| **Seznam receptov** | Prikaz shranjenih receptov, po katerem uporabnik lahko brska in izbira recept za ogled ali urejanje. |
| **Iskanje receptov** | Funkcija, s katero uporabnik poišče recepte glede na besedo v imenu ali med sestavinami. Iskanje ne razlikuje med velikimi in malimi črkami. |
| **Stran seznama** | Del seznama receptov, prikazan naenkrat. Aplikacija recepte razdeli na strani, da je pregledovanje lažje. |
| **Shranjeni recept** | Recept, ki je vpisan v aplikacijo in je na voljo za poznejši pregled ali spremembo. |
| **Gost** | XYZ |
|**Registriran uporabnik** | XYZ |
|**Administrator** | XYZ |

### REST API

Osnovni naslov: `http://localhost:8080/api/recepti`

| Metoda   | Pot                     | Opis                                                                                         | Odgovor                |
|----------|-------------------------|----------------------------------------------------------------------------------------------|------------------------|
| `GET`    | `/api/recepti`          | vrne vse recepte                                                                             | 200                    |
| `GET`    | `/api/recepti/stran`    | vrne eno stran receptov, z iskanjem (`iskanje`, `stran`, `velikost`; privzeta velikost je 3) | 200 |
| `GET`    | `/api/recepti/{id}`     | vrne en recept                                                                               | 200 / 404              |
| `POST`   | `/api/recepti`          | doda nov recept                                                                              | 200                    |
| `PUT`    | `/api/recepti/{id}`     | posodobi obstoječi recept                                                                    | 200 / 404              |
| `DELETE` | `/api/recepti/{id}`     | izbriše recept                                                                               | 204 / 404              |

Interaktivna dokumentacija (Swagger UI) je na `http://localhost:8080/swagger-ui/index.html`.

---

## 2. Uporabljene tehnologije

### Zaledje (`backend/`)

| Tehnologija               | Verzija | Namen                                   |
|---------------------------|---------|-----------------------------------------|
| Java (JDK)                | 21      | programski jezik                        |
| Spring Boot               | 3.2.5   | ogrodje za zaledje                      |
| Spring Web                | (v Spring Boot 3.2.5) | REST API                  |
| Spring Data JPA (Hibernate) | (v Spring Boot 3.2.5) | delo z bazo                |
| PostgreSQL JDBC gonilnik  | (upravlja Spring Boot) | povezava z bazo           |
| springdoc-openapi (Swagger UI) | 2.5.0 | dokumentacija API-ja                |
| Maven (Maven Wrapper `mvnw`) | priložen projektu | gradnja projekta in odvisnosti |

### Obličje (`frontend/`)

| Tehnologija | Verzija | Namen                                  |
|-------------|---------|----------------------------------------|
| React       | 19.3.1  | knjižnica za uporabniški vmesnik       |
| Vite        | 8.3.4   | razvojni strežnik in gradnja           |
| Axios       | 1.20.0  | HTTP zahteve na zaledje                |
| Node.js     | 24.13.0 | izvajalno okolje                       |

### Podatkovna baza

| Tehnologija | Verzija | Namen                |
|-------------|---------|----------------------|
| PostgreSQL  | 18      | podatkovna baza `recepti` |

---

## 3. Struktura projekta

```
recepti-app/
├── README.md
├── .gitignore
├── postman/                              # zbirka zahtev za Postman
├── backend/                              # zaledje (Spring Boot, Maven)
│   ├── .gitattributes
│   ├── .gitignore
│   ├── .mvn/                             # nastavitve Maven Wrapperja
│   ├── mvnw                              # Maven Wrapper (Linux / macOS)
│   ├── mvnw.cmd                          # Maven Wrapper (Windows)
│   ├── pom.xml
│   └── src/
│       ├── main/
│       │   ├── java/si/student/recepti/
│       │   │   ├── BackendApplication.java
│       │   │   ├── Recepti.java
│       │   │   ├── ReceptiRepository.java
│       │   │   └── ReceptiNadzorna.java
│       │   └── resources/
│       │       └── application.properties
│       └── test/java/si/student/recepti/
│           └── BackendApplicationTests.java
└── frontend/                             # obličje (React + Vite)
    ├── .gitignore
    ├── public/                           # statične datoteke
    ├── index.html
    ├── package.json
    ├── package-lock.json
    ├── vite.config.js
    ├── eslint.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── App.css
        └── index.css
```

### Zaledje

| Datoteka                  | Vsebina                                                                 |
|---------------------------|-------------------------------------------------------------------------|
| `BackendApplication.java` | vstopna točka, zažene Spring Boot                                       |
| `Recepti.java`            | entiteta, ki predstavlja tabelo `recepti`                               |
| `ReceptiRepository.java`  | vmesnik za delo z bazo (CRUD in iskanje po straneh)                     |
| `ReceptiNadzorna.java`    | kontroler z REST end pointi in opisi za Swagger                         |
| `application.properties`  | nastavitve aplikacije in povezave z bazo (vrednosti iz okoljskih spremenljivk) |
| `pom.xml`                 | odvisnosti in nastavitve gradnje                                        |
| `mvnw`, `mvnw.cmd`, `.mvn/` | Maven Wrapper: omogoča gradnjo in zagon brez nameščenega Mavena       |

### Obličje

| Datoteka               | Vsebina                                                                       |
|------------------------|-------------------------------------------------------------------------------|
| `index.html`           | osnovna stran z elementom `root`                                              |
| `src/main.jsx`         | vstopna točka, izriše komponento `App`                                        |
| `src/App.jsx`          | vsa logika in uporabniški vmesnik (obrazec, seznam, iskanje, paginacija, klici na zaledje) |
| `src/App.css`          | stili aplikacije                                                              |
| `src/index.css`        | globalni stili (trenutno prazna)                                              |
| `public/`              | statične datoteke, ki se prenesejo brez obdelave                              |
| `package.json`         | odvisnosti in ukazi (`npm run dev`, `npm run build`)                          |
| `package-lock.json`    | natančne verzije nameščenih knjižnic                                          |
| `vite.config.js`       | nastavitve razvojnega strežnika Vite                                          |
| `eslint.config.js`     | pravila za preverjanje kode (ESLint)                                          |

### Ostalo

| Mapa / datoteka | Vsebina                                                  |
|-----------------|----------------------------------------------------------|
| `postman/`      | zbirka zahtev za preizkušanje API-ja v Postmanu          |
| `.gitignore`    | datoteke in mape, ki se ne shranjujejo v repozitorij (ločena datoteka v korenu, v `backend/` in v `frontend/`, vsaka velja za svojo mapo) |

---

## 4. Navodila za nameščanje in zagon

### 4.1 Predpogoji

Pred zagonom morajo biti nameščeni:

- [Git](https://git-scm.com/)
- [JDK 21](https://adoptium.net/)
- [Node.js](https://nodejs.org/) 20.19+ ali 22.12+ (razvito z 24.13.0) in `npm`
- [PostgreSQL](https://www.postgresql.org/download/) (zagnan na vratih `5432`)

Maven ni potreben, ker projekt vsebuje Maven Wrapper (`mvnw`).

Preveri namestitev:

```bash
java -version
node -v
npm -v
```

Verzijo PostgreSQL preveri v pgAdminu (poizvedba `SELECT version();`). Ukaz `psql --version` deluje, če je mapa `bin` v namestitvi PostgreSQL dodana v sistemsko pot `PATH`.

### 4.2 Kloniranje repozitorija

```bash
git clone https://github.com/svensmiljanic-um/recepti-app.git
cd recepti-app
```

### 4.3 Priprava podatkovne baze

Ustvari prazno bazo `recepti` (v pgAdminu ali v `psql`):

```sql
CREATE DATABASE recepti;
```

Uporabnik `postgres` ima geslo, ki je bilo nastavljeno ob namestitvi PostgreSQL. To geslo uporabi kot `DB_PASSWORD` (korak 4.4).

Tabele ni treba ustvariti ročno. Ob prvem zagonu jo ustvari Spring (`spring.jpa.hibernate.ddl-auto=update`).

### 4.4 Okoljske spremenljivke (zaledje)

Podatki za povezavo z bazo se berejo iz okoljskih spremenljivk, zato v repozitoriju ni gesel.

| Spremenljivka | Obvezna | Privzeta vrednost                          | Opis                          |
|---------------|---------|--------------------------------------------|-------------------------------|
| `DB_URL`      | ne      | `jdbc:postgresql://localhost:5432/recepti` | naslov baze                   |
| `DB_USERNAME` | ne      | `postgres`                                 | uporabnik baze                |
| `DB_PASSWORD` | **da**  | (ni privzete vrednosti)                    | geslo uporabnika baze         |

Nastavitev:

```bash
# Linux / macOS
export DB_PASSWORD='tvoje_geslo'

# Windows (PowerShell)
$env:DB_PASSWORD = "tvoje_geslo"
```

Spremenljivka velja samo v terminalu, v katerem je nastavljena, zato v istem terminalu zaženi tudi zaledje.

V IntelliJ IDEA: **Run → Edit Configurations → BackendApplication → Environment variables** in vpiši `DB_PASSWORD=tvoje_geslo`.

### 4.5 Zagon zaledja

```bash
cd backend

# Linux / macOS
./mvnw spring-boot:run

# Windows (PowerShell in ukazni poziv)
.\mvnw.cmd spring-boot:run
```

Zaledje se zažene na `http://localhost:8080`. Ob prvem zagonu Maven Wrapper prenese potrebne knjižnice, zato je potrebna internetna povezava.

### 4.6 Zagon obličja

V novem terminalu:

```bash
cd frontend
npm install
npm run dev
```

Obličje se zažene na `http://localhost:5173`. Naslov zaledja je določen v konstanti `API_URL` v `src/App.jsx`.

### 4.7 Preverjanje

| Kaj                | Naslov                                          |
|--------------------|-------------------------------------------------|
| Aplikacija         | http://localhost:5173                           |
| Swagger UI         | http://localhost:8080/swagger-ui/index.html     |
| API (vsi recepti)  | http://localhost:8080/api/recepti               |

### 4.8 Pogoste težave

| Težava | Rešitev |
|--------|---------|
| `Could not resolve placeholder 'DB_PASSWORD'` | nastavi okoljsko spremenljivko `DB_PASSWORD` (korak 4.4) |
| `password authentication failed` | geslo v `DB_PASSWORD` se ne ujema z geslom uporabnika v PostgreSQL |
| `Connection refused` / `database "recepti" does not exist` | zaženi PostgreSQL in ustvari bazo `recepti` (korak 4.3) |
| `Port 8080 was already in use` | zapri program, ki uporablja vrata 8080, ali spremeni `server.port` |
| V brskalniku napaka CORS | obličje mora teči na `http://localhost:5173` (tako je nastavljen `@CrossOrigin` v zaledju) |
| `Permission denied` pri `./mvnw` (Linux / macOS) | zaženi `chmod +x mvnw` ali `sh mvnw spring-boot:run` |
| `mvnw.cmd is not recognized` (PowerShell) | uporabi `.\mvnw.cmd spring-boot:run` (s piko in poševnico na začetku) |

---

## 5. Navodila za razvijalce

### 5.1 Delo z repozitorijem

- Veja `main` vsebuje delujočo različico. Nanjo se ne piše neposredno.
- Vsako delo poteka na svoji veji, ki se po končanem delu združi v `main` s pull requestom.

```bash
# 1. posodobi main
git checkout main
git pull

# 2. ustvari novo vejo
git checkout -b feature/razvrscanje-receptov

# 3. delaj, nato spremembe shrani
git add .
git commit -m "feat: dodaj razvrščanje receptov"

# 4. objavi vejo
git push -u origin feature/razvrscanje-receptov
```

Na GitHubu nato odpri **Pull request** v vejo `main`, preveri spremembe (zavihek *Files changed*), ga združi (*Merge*) in izbriši vejo.

### 5.2 Poimenovanje vej

| Predpona      | Uporaba                      | Primer                          |
|---------------|------------------------------|---------------------------------|
| `feature/`    | nova funkcionalnost          | `feature/iskanje-receptov`      |
| `fix/`        | popravek napake              | `fix/napaka-pri-brisanju`       |
| `docs/`       | dokumentacija                | `docs/posodobitev-readme`       |
| `refactor/`   | preurejanje kode brez novih funkcij | `refactor/kontroler`      |

### 5.3 Sporočila commitov

Format: `tip: kratek opis v povedni obliki`

| Tip         | Pomen                                  | Primer                               |
|-------------|----------------------------------------|--------------------------------------|
| `feat`      | nova funkcionalnost                    | `feat: dodaj paginacijo`             |
| `fix`       | popravek napake                        | `fix: popravi osveževanje seznama`   |
| `docs`      | dokumentacija                          | `docs: dopolni navodila za zagon`    |
| `style`     | oblika kode brez spremembe delovanja   | `style: uredi zamike`                |
| `refactor`  | preurejanje kode                       | `refactor: poenoti imena parametrov` |

### 5.4 Pred pull requestom

- zaledje in obličje se zaženeta brez napak,
- vse CRUD operacije delujejo (preveri v aplikaciji ali v Swaggerju),
- novi end pointi imajo `@Operation` opis za Swagger,
- v repozitorij niso dodani gesla, mapi `node_modules/` in `target/` ter nastavitve urejevalnika (to ureja `.gitignore`).

Projekt vsebuje samo privzeti test BackendApplicationTests, ki preveri zagon aplikacije in zahteva delujočo bazo ter nastavljen `DB_PASSWORD`.

### 5.5 Dodajanje nove funkcionalnosti

1. **Zaledje:** po potrebi razširi entiteto `Recepti`, dodaj metodo v `ReceptiRepository`, nov end point v `ReceptiNadzorna` in opis z `@Operation`.
2. **Obličje:** dodaj stanje in klic z Axiosom v `App.jsx` ter stile v `App.css`.
3. **Dokumentacija:** posodobi tabelo REST API in seznam funkcionalnosti v tem README.

---

## 6. Standardi kodiranja

### Java (zaledje)

- Razredi: `PascalCase` (`ReceptiNadzorna`), metode in spremenljivke: `camelCase` (`pridobiVseRecepte`), paketi: male črke (`si.student.recepti`), konstante: `VELIKE_CRKE`.
- Zamik: 4 presledki.
- Kontroler vrača ustrezne HTTP statuse (200, 204, 404).
- Polje `cas_priprave` ohranja ime iz podatkovnega modela, ker je enako ime uporabljeno tudi v bazi in v JSON-u. Za nova polja se uporablja `camelCase`.

### React (obličje)

- Komponente: `PascalCase` (`App`), spremenljivke in funkcije: `camelCase`, funkcije za dogodke se začnejo s `handle` (`handleSubmit`).
- Zamik: 4 presledki v `App.jsx`.
- Za stanje se uporablja `useState`, za branje podatkov ob spremembi `useEffect`.
- Naslov API-ja je v konstanti `API_URL`, ne na več mestih.
- Napake pri klicih se ujamejo s `try/catch`.

### CSS

- Imena razredov: male črke z vezaji (`recipe-card`, `btn-primary`).
- Stili so razdeljeni po razdelkih z kratkimi komentarji.

### REST API

- Poti so v množini in z malimi črkami (`/api/recepti`).
- Metode: `GET` (branje), `POST` (dodajanje), `PUT` (posodabljanje), `DELETE` (brisanje).
- Vsak end point ima `@Operation` opis za Swagger.

### Komentarji in imena

- Komentarji so v slovenščini in razložijo, zakaj ali kaj koda počne.
- Imena datotek in razredov so jasna in opisna.
- Gesel ali drugih skrivnosti se ne vpisuje v kodo, uporabijo se okoljske spremenljivke.