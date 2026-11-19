package si.student.recepti;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ReceptiRepository extends JpaRepository<Recepti, Long> {

    // iskanje po imenu ALI sestavinah (brez razlike med velikimi in malimi črkami), rezultat je razdeljen na strani
    Page<Recepti> findByImeContainingIgnoreCaseOrSestavineContainingIgnoreCase(String ime, String sestavine, Pageable pageable);

    // kategorijo in iskalni niz uporabi skupaj, pri čemer išče po imenu ali sestavinah
    @Query("SELECT r FROM Recepti r WHERE r.kategorija = :kategorija AND " +
            "(LOWER(COALESCE(r.ime, '')) LIKE LOWER(CONCAT('%', :iskanje, '%')) OR " +
            "LOWER(COALESCE(r.sestavine, '')) LIKE LOWER(CONCAT('%', :iskanje, '%')))" )
    Page<Recepti> najdiPoKategorijiInIskanju(
            @Param("kategorija") String kategorija,
            @Param("iskanje") String iskanje,
            Pageable pageable);

    // vrne vse različne kategorije, ki jih imajo shranjeni recepti (brez praznih)
    @Query("SELECT DISTINCT r.kategorija FROM Recepti r WHERE r.kategorija IS NOT NULL")
    List<String> najdiKategorije();
}