# Primeri uporabe
## Všečkanje

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Všečkanje |
| **ID:** | PU-01 |
| **Cilj:** | Registriran uporabnik z všečkanjem izrazi pozitivno mnenje o receptu. |
| **Akterji:** | Registriran uporabnik, sistem |
| **Predpogoji:** | Recept obstaja. |
| **Stanje sistema po PU:** | Število všečkov recepta je za ena večje. Sistem je zabeležil, da je uporabnik recept všečkal. |
| **Scenarij:** | 1. Uporabnik pritisne gumb »Všečkaj«.<br> 2. Sistem preveri, ali je uporabnik prijavljen.<br> 3. Sistem številu všečkov recepta prišteje 1.<br> 4. Sistem zabeleži, da je uporabnik recept všečkal.<br> 5. Sistem prikaže potrditev, da je bil recept všečkan. |
| **Alternativni tokovi:** | 1a. Uporabnik je recept že všečkal in ponovno pritisne gumb »Všečkaj«: sistem odstrani všeček in število všečkov zmanjša za 1.<br> 2a. Uporabnik ni prijavljen: sistem izpiše opozorilo »Za všečkanje je potrebna prijava.« in všečka ne shrani. |
| **Izjeme:** | - Pri napaki pri shranjevanju všečka sistem ne spremeni števila všečkov in prikaže sporočilo, da všečka ni bilo mogoče shraniti.<br> - Če povezava s strežnikom ni mogoča, sistem prikaže obvestilo o napaki povezave in uporabniku omogoči ponoven poskus. |

## Filtriranje receptov po kategorijah

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Filtriranje receptov po kategorijah |
| **ID:** | PU-02 |
| **Cilj:** | Uporabnik želi videti samo recepte iz izbrane kategorije, da hitreje najde ustrezen recept. |
| **Akterji:** | Gost, registriran uporabnik, sistem |
| **Predpogoji:** | Uporabnik ima odprt ogled receptov (primer uporabe »Ogled receptov«). V sistemu obstaja vsaj ena kategorija. |
| **Stanje sistema po PU:** | Podatki v bazi se ne spremenijo. Seznam receptov je omejen na izbrano kategorijo, dokler uporabnik filtra ne odstrani. |
| **Scenarij:** | 1. Uporabnik na seznamu receptov odpre izbiro kategorij.<br> 2. Sistem prikaže seznam razpoložljivih kategorij.<br> 3. Uporabnik izbere kategorijo.<br> 4. Sistem poišče recepte izbrane kategorije.<br> 5. Sistem prikaže prvo stran ujemajočih receptov in izbrano kategorijo označi kot aktivno. |
| **Alternativni tokovi:** | 3a. Uporabnik poleg kategorije vpiše iskalni niz: sistem prikaže recepte, ki ustrezajo obema pogojema.<br> 4a. V izbrani kategoriji ni receptov: sistem prikaže sporočilo »V tej kategoriji še ni receptov«.<br> 5a. Uporabnik izbere »Vse kategorije«: sistem odstrani filter in prikaže vse recepte. |
| **Izjeme:** | - Seznama kategorij ni mogoče naložiti: sistem prikaže sporočilo o napaki, seznam receptov pa ostane nespremenjen in ga je še vedno mogoče pregledovati brez filtra. |

## Komentiranje receptov

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Komentiranje receptov |
| **ID:** | PU-03 |
| **Cilj:** | Registriran uporabnik želi pod receptom napisati komentar (mnenje, nasvet ali vprašanje). |
| **Akterji:** | Registriran uporabnik, sistem |
| **Predpogoji:** | Recept obstaja in je odprt za ogled. |
| **Stanje sistema po PU:** | Komentar je shranjen in viden pod receptom, z imenom avtorja in časom objave. |
| **Scenarij:** | 1. Uporabnik pri ogledu recepta izbere polje za komentar.<br> 2. Uporabnik vpiše besedilo in ga potrdi.<br> 3. Sistem preveri, da komentar ni prazen in ni predolg.<br> 4. Sistem shrani komentar.<br> 5. Sistem osveži seznam komentarjev, tako da je nov komentar viden. |
| **Alternativni tokovi:** | 1a. Uporabnik ni prijavljen (je gost): sistem polja za komentar ne prikaže in ga pozove k prijavi.<br> 2a. Uporabnik prekliče vnos: besedilo se zavrže, komentar ni shranjen.<br> 3a. Komentar je prazen ali presega dovoljeno dolžino: sistem prikaže opozorilo in ostane na obrazcu (nazaj na korak 2). |
| **Izjeme:** | - Napaka pri shranjevanju: sistem komentarja ne shrani, prikaže sporočilo o napaki in ohrani vneseno besedilo.<br> - Recept je medtem izbrisan: sistem prikaže sporočilo, da recept ne obstaja. |

## Določitev kategorije recepta

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Določitev kategorije recepta |
| **ID:** | PU-04 |
| **Cilj:** | Registriran uporabnik želi receptu ob dodajanju določiti kategorijo, da ga je pozneje mogoče filtrirati. |
| **Akterji:** | Registriran uporabnik, sistem |
| **Predpogoji:** | Uporabnik je prijavljen in je v postopku dodajanja recepta (primer uporabe »Dodajanje novega recepta«, ki ta primer uporabe vključuje). V sistemu obstaja vsaj ena kategorija. |
| **Stanje sistema po PU:** | Recept je ob shranjevanju povezan z izbrano kategorijo. |
| **Scenarij:** | 1. Uporabnik v obrazcu za nov recept odpre izbiro kategorij.<br> 2. Sistem prikaže seznam razpoložljivih kategorij.<br> 3. Uporabnik izbere kategorijo.<br> 4. Sistem izbrano kategorijo prikaže v obrazcu.<br> 5. Ob shranjevanju recepta sistem zapiše tudi kategorijo. |
| **Alternativni tokovi:** | 3a. Uporabnik kategorije ne izbere: sistem recept shrani v privzeto kategorijo »Brez kategorije«. |
| **Izjeme:** | - Seznama kategorij ni mogoče naložiti: sistem omogoči shranjevanje recepta brez kategorije in prikaže opozorilo.<br> - Napaka pri shranjevanju: sistem recepta ne shrani, ohrani vnesene podatke v obrazcu in prikaže sporočilo o napaki. |

## Brisanje receptov

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Brisanje receptov |
| **ID:** | PU-05 |
| **Cilj:** | Administrator želi odstraniti neprimeren ali neustrezen recept katerega koli uporabnika. |
| **Akterji:** | Administrator, sistem |
| **Predpogoji:** | Administrator je prijavljen. Recept obstaja. |
| **Stanje sistema po PU:** | Recept je izbrisan iz baze, skupaj z njegovimi všečki in komentarji. Recept ni več viden nikomur. |
| **Scenarij:** | 1. Administrator odpre recept ali seznam receptov.<br> 2. Administrator izbere možnost »Izbriši recept«.<br> 3. Sistem zahteva potrditev brisanja.<br> 4. Administrator potrdi.<br> 5. Sistem izbriše recept in povezane podatke.<br> 6. Sistem osveži seznam in prikaže potrditev. |
| **Alternativni tokovi:** | 4a. Administrator prekliče brisanje: recept ostane nespremenjen. |
| **Izjeme:** | - Zahtevo za brisanje pošlje uporabnik brez vloge administratorja: sistem brisanje zavrne in prikaže sporočilo o pomanjkanju pravic.<br> - Recept je medtem že izbrisan: sistem prikaže obvestilo in osveži seznam.<br> - Napaka pri brisanju: sistem recepta ne izbriše in prikaže sporočilo o napaki. |

## Brisanje komentarjev

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Brisanje komentarjev |
| **ID:** | PU-06 |
| **Cilj:** | Administrator želi odstraniti neprimeren komentar pod receptom. |
| **Akterji:** | Administrator, sistem |
| **Predpogoji:** | Administrator je prijavljen. Recept ima vsaj en komentar. |
| **Stanje sistema po PU:** | Komentar je izbrisan in ni več viden pod receptom. Recept se ne spremeni. |
| **Scenarij:** | 1. Administrator odpre recept s komentarji.<br> 2. Pri neprimernem komentarju izbere možnost »Izbriši komentar«.<br> 3. Sistem zahteva potrditev brisanja.<br> 4. Administrator potrdi.<br> 5. Sistem izbriše komentar.<br> 6. Sistem osveži seznam komentarjev. |
| **Alternativni tokovi:** | 4a. Administrator prekliče brisanje: komentar ostane. |
| **Izjeme:** | - Zahtevo za brisanje pošlje uporabnik brez vloge administratorja: sistem brisanje zavrne in prikaže sporočilo o pomanjkanju pravic.<br> - Komentar je medtem že izbrisan: sistem prikaže obvestilo in osveži seznam.<br> - Napaka pri brisanju: sistem komentarja ne izbriše in prikaže sporočilo o napaki. |