package si.student.recepti;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ReceptiRepository extends JpaRepository<Recepti, Long> {

    // iskanje po imenu ALI sestavinah (brez razlike med velikimi in malimi črkami), rezultat je razdeljen na strani
    Page<Recepti> findByImeContainingIgnoreCaseOrSestavineContainingIgnoreCase(String ime, String sestavine, Pageable pageable);

    // vrne vse različne kategorije, ki jih imajo shranjeni recepti (brez praznih)
    @Query("SELECT DISTINCT r.kategorija FROM Recepti r WHERE r.kategorija IS NOT NULL")
    List<String> najdiKategorije();
}