package si.student.recepti;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Recepti {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String ime;
    private String opis;

    @Column(length = 2000) // privzeto je 255 znakov
    private String sestavine;

    @Column(length = 5000)
    private String navodila;

    private int cas_priprave;

    public Recepti() {
    }

    public long getId() {
        return id;
    }

    public String getIme() {
        return ime;
    }

    public String getOpis() {
        return opis;
    }

    public String getSestavine() {
        return sestavine;
    }

    public String getNavodila() {
        return navodila;
    }

    public int getCas_priprave() {
        return cas_priprave;
    }

    public void setIme(String ime) {
        this.ime = ime;
    }

    public void setOpis(String opis) {
        this.opis = opis;
    }

    public void setSestavine(String sestavine) {
        this.sestavine = sestavine;
    }

    public void setNavodila(String navodila) {
        this.navodila = navodila;
    }

    public void setCas_priprave(int cas_priprave) {
        this.cas_priprave = cas_priprave;
    }
}
