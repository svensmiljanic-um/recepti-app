package si.student.recepti;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@Tag(name = "Recepti")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/recepti")
public class ReceptiNadzorna {
    // fiksen seznam kategorij, ki jih lahko izbere uporabnik
    private static final List<String> KATEGORIJE = List.of("Predjed", "Glavna jed", "Priloga", "Juha", "Sladica", "Pijača");
    // kategorija, ki jo dobi recept, če uporabnik ne izbere nobene
    private static final String BREZ_KATEGORIJE = "Brez kategorije";

    private final ReceptiRepository shrambaReceptov;

    public ReceptiNadzorna(ReceptiRepository shrambaReceptov) {
        this.shrambaReceptov = shrambaReceptov;
    }

    // prebere vse vrstice iz tabele
    @Operation(summary = "Vrne vse recepte")
    @GetMapping
    public List<Recepti> pridobiVseRecepte() {
        return shrambaReceptov.findAll(); // findAll() prebere vse vrstice iz tabele, Spring vrne JSON
    }

    // vrne seznam kategorij za spustni meni v obrazcu
    @Operation(summary = "Vrne seznam kategorij receptov")
    @GetMapping("/kategorije")
    public List<String> pridobiKategorije() {
        return KATEGORIJE;
    }

    // če kategorija ni podana, recept dobi "Brez kategorije"
    private String preveriKategorijo(String kategorija) {
        if (kategorija == null || kategorija.isEmpty()) {
            return BREZ_KATEGORIJE;
        }
        return kategorija;
    }

    // iskanje, filter po kategoriji in paginacija: vrne samo eno stran receptov
    // iskanje = besedilo, ki ga iščemo v imenu ali sestavinah (prazno = vsi recepti)
    // kategorija = izbrana kategorija (prazno = vse kategorije)
    // stran = številka strani (prva stran je 0), velikost = število receptov na strani
    @Operation(summary = "Vrne recepte po straneh, z iskanjem po imenu in sestavinah ter filtrom po kategoriji")
    @GetMapping("/stran")
    public Page<Recepti> pridobiStran(
            @RequestParam(defaultValue = "") String iskanje,
            @RequestParam(defaultValue = "") String kategorija,
            @RequestParam(defaultValue = "0") int stran,
            @RequestParam(defaultValue = "3") int velikost) {

        // najnovejši recepti (z največjim ID-jem) so na vrhu
        Pageable strani = PageRequest.of(stran, velikost, Sort.by("id").descending());

        // če kategorija ni izbrana, iščemo po vseh receptih
        if (kategorija.isEmpty()) {
            // isti niz iščemo v imenu in v sestavinah
            return shrambaReceptov.findByImeContainingIgnoreCaseOrSestavineContainingIgnoreCase(iskanje, iskanje, strani);
        }

        // sicer iščemo samo med recepti izbrane kategorije
        return shrambaReceptov.najdiPoKategorijiInIskanju(kategorija, iskanje, strani);
    }

    // prebere točno določeno vrstico
    @Operation(summary = "Vrne en recept")
    @GetMapping("/{id}")
    public ResponseEntity<Recepti> pridobiRecept(@PathVariable Long id) {
        Recepti recept = shrambaReceptov.findById(id).orElse(null);

        // če recepta z ID-jem ni, vrne 404 Not Found
        if (recept == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // če recept obstaja, vrne 200 OK -> vrne JSON
        return new ResponseEntity<>(recept,HttpStatus.OK);
    }

    @Operation(summary = "Doda nov recept")
    @PostMapping
    public Recepti dodajRecept(@RequestBody Recepti recept) {
        recept.setKategorija(preveriKategorijo(recept.getKategorija())); // privzeta kategorija, če je ni
        return shrambaReceptov.save(recept); // save() vstavi novo vrstico, ID dodeli baza
    }

    @Operation(summary = "Posodobi obstoječi recept")
    @PutMapping("/{id}")
    public ResponseEntity<Recepti> posodobiRecept(@PathVariable Long id, @RequestBody Recepti noviPodatki) {
        Recepti recept = shrambaReceptov.findById(id).orElse(null); // poiščemo obstoječi recept

        if (recept == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // če ne obstaja, ni kaj posodabljati -> 404
        }

        // v obstoječi objekt prepišemo polja z novimi vrednostmi
        recept.setIme(noviPodatki.getIme());
        recept.setOpis(noviPodatki.getOpis());
        recept.setSestavine(noviPodatki.getSestavine());
        recept.setNavodila(noviPodatki.getNavodila());
        recept.setCas_priprave(noviPodatki.getCas_priprave());
        recept.setKategorija(preveriKategorijo(noviPodatki.getKategorija()));

        Recepti shranjenRecept = shrambaReceptov.save(recept);

        // rezultat: 200 OK
        return new ResponseEntity<>(shranjenRecept, HttpStatus.OK);
    }

    @Operation(summary = "Doda všeček receptu")
    @PostMapping("/{id}/vseck")
    public ResponseEntity<Recepti> dodajVseck(@PathVariable Long id) {
        Recepti recept = shrambaReceptov.findById(id).orElse(null);

        if (recept == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        recept.setVseckov(recept.getVseckov() + 1);
        return new ResponseEntity<>(shrambaReceptov.save(recept), HttpStatus.OK);
    }

    @Operation(summary = "Odstrani všeček receptu")
    @DeleteMapping("/{id}/vseck")
    public ResponseEntity<Recepti> odstraniVseck(@PathVariable Long id) {
        Recepti recept = shrambaReceptov.findById(id).orElse(null);

        if (recept == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        recept.setVseckov(Math.max(0, recept.getVseckov() - 1));
        return new ResponseEntity<>(shrambaReceptov.save(recept), HttpStatus.OK);
    }

    @Operation(summary = "Izbriše recept")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> izbrisiRecept(@PathVariable Long id) {
        boolean receptObstaja = shrambaReceptov.existsById(id); // preverimo, če recept obstaja

        if (!receptObstaja) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // ne obstaja -> 404
        }

        shrambaReceptov.deleteById(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT); // obstaja -> izbriše
    }

}