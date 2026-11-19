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

import java.util.ArrayList;
import java.util.List;

@Tag(name = "Recepti")
@RestController
@CrossOrigin(origins = "http://localhost:5173")
@RequestMapping("/api/recepti")
public class ReceptiNadzorna {
    // začetne kategorije; uporabnik lahko vpiše tudi svojo
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

    // vrne začetne kategorije in kategorije, ki jih je uporabnik že vpisal pri receptih
    @Operation(summary = "Vrne seznam kategorij receptov")
    @GetMapping("/kategorije")
    public List<String> pridobiKategorije() {
        List<String> vse = new ArrayList<>(KATEGORIJE);
        for (String k : shrambaReceptov.najdiKategorije()) {
            // "Brez kategorije" ni prava kategorija, zato je ne ponujamo
            if (!vse.contains(k) && !k.equals(BREZ_KATEGORIJE)) {
                vse.add(k);
            }
        }
        return vse;
    }

    // počisti vpisano kategorijo; če je prazna, vrne "Brez kategorije"
    private String preveriKategorijo(String kategorija) {
        if (kategorija == null || kategorija.trim().isEmpty()) {
            return BREZ_KATEGORIJE;
        }
        String ociscena = kategorija.trim();
        if (ociscena.length() > 50) {
            ociscena = ociscena.substring(0, 50); // kategorija je lahko dolga največ 50 znakov
        }
        return ociscena;
    }

    // iskanje in paginacija: vrne samo eno stran receptov
    // iskanje = besedilo, ki ga iščemo v imenu ali sestavinah (prazno = vsi recepti)
    // stran = številka strani (prva stran je 0), velikost = število receptov na strani
    @Operation(summary = "Vrne recepte po straneh, z iskanjem po imenu in sestavinah")
    @GetMapping("/stran")
    public Page<Recepti> pridobiStran(
            @RequestParam(defaultValue = "") String iskanje,
            @RequestParam(defaultValue = "0") int stran,
            @RequestParam(defaultValue = "5") int velikost) {

        // najnovejši recepti (z največjim ID-jem) so na vrhu
        Pageable strani = PageRequest.of(stran, velikost, Sort.by("id").descending());

        // isti niz iščemo v imenu in v sestavinah
        return shrambaReceptov.findByImeContainingIgnoreCaseOrSestavineContainingIgnoreCase(iskanje, iskanje, strani);
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