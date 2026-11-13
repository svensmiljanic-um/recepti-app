# Primeri uporabe

## Primer uporabe 1

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Všečkanje |
| **ID:** | Enolična oznaka primera uporabe, na primer PU-01. |
| **Cilj:** | Uporabnik z všečkanjem pokaže svoje pozitino mnenje o nekem receptu. |
| **Akterji:** | Kdo sodeluje (npr. končni uporabnik, sistem, administrator)? |
| **Predpogoji:** | Kaj mora biti izpolnjeno, preden se primer uporabe lahko izvede? |
| **Stanje sistema po PU:** | Ali se stanje sistema spremeni oziroma kakšno je po izvedbi? |
| **Scenarij:** | Opišite običajni potek interakcije uporabnika s sistemom po korakih:<br> 1. Korak 1;<br> 2. Korak 2;<br> 3. … |
| **Alternativni tokovi:** | Opišite možne drugačne poteke in navedite, pri katerem koraku se pojavijo (npr.<br> 1a <br> 1b <br> 2a <br>). |
| **Izjeme:** | Kje lahko pride do napake in kako naj se sistem takrat odzove? |

## Primer uporabe 2
| Polje | Vsebina                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
|---|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Primer uporabe:** | Registracija uporabnika                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| **ID:** |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **Cilj:** | Gost si želi ustvariti uporabniški račun, da lahko dodaja in ureja svoje recepte ter shranjuje priljubljene.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Akterji:** | Gost, sistem                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| **Predpogoji:** | Uporabnik ni prijavljen. Uporabnik đe nima računa u istim e-poštnim naslovom ali uporabniškim imenom                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| **Stanje sistema po PU:** | V podatkovni bazi je ustvarjen nov uporabniški račun z vlogo Uporabnik. Uporabnik lahko po registraciji nadaljuje s prijavo                                                                                                                                                                                                                                                                                                                                                                                                               |
| **Scenarij:** | 1. Gost izbere možnost "Registracija". <br> 2. Sistem prikaže obrazec za registracijo (uporabniški račun, e-poštni naslov, geslo, ponovitev gesla. <br> 3. Gost izpolni obrazec in ga potrdi.  <br> 4. Sistem preveri, da so vsa polja izpolnjena in veljavna. <br> 5. Sistem preveri, da uporabniško ime in e-poštni naslov še vedno zasedena. <br> 6. Sistem shrani nov uporabniški račun.  <br> 7. Sistem prikaže sporočilo o uspešni registraciji in gosta preusmeri na prijavo.                                                      |
| **Alternativni tokovi:** | 4a. Katero od polj ni izpolnjeno ali ima neveljavno obliko (napačen e-pošni naslov): sistem ob polju prikaže opozorilo in ostane na obrazcu (nazaj na korak 3). <br> 4b. Geslo je prekratko ali se ne ujema s ponovljenim geslom: sistem prikaže opozorilo (nazaj na korak 3). <br> 5a. Uporabniško ime ali e-poštni naslov že obstajata: sistem prikaže sporočilo, da je podatek zaseden, in gosta pozove k spremembi (nazaj na korak 3). <br> 3a. Gost prikliče registracijo: sistem zavrže vnesene podatke in prikaže seznam receptov. |
| **Izjeme:** | - Napaka pri shranjevanju v bazo (baza ni dosegljiva): sistem računa ne ustvari, prikaže sporočilo "Registracija trenutno ni mogoča, poskusite kasneje.". <br> - Zaledje ni dosegljivo: obličje prikaže sporočilo o napaki povezave, vneseni podatki ostanejo v obrazcu.                                                                                                                                                                                                                                                                  |


## Primer uporabe 3

| Polje | Vsebina |
|---|---|
| **Primer uporabe:** | Ime oziroma kratek naziv primera uporabe. |
| **ID:** | Enolična oznaka primera uporabe, na primer PU-03. |
| **Cilj:** | Kaj želi uporabnik doseči s tem primerom uporabe? |
| **Akterji:** | Kdo sodeluje (npr. končni uporabnik, sistem, administrator)? |
| **Predpogoji:** | Kaj mora biti izpolnjeno, preden se primer uporabe lahko izvede? |
| **Stanje sistema po PU:** | Ali se stanje sistema spremeni oziroma kakšno je po izvedbi? |
| **Scenarij:** | Opišite običajni potek interakcije uporabnika s sistemom po korakih:<br> 1. Korak 1;<br> 2. Korak 2;<br> 3. … |
| **Alternativni tokovi:** | Opišite možne drugačne poteke in navedite, pri katerem koraku se pojavijo (npr. 1a, 1b, 2a). |
| **Izjeme:** | Kje lahko pride do napake in kako naj se sistem takrat odzove? |
