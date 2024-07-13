package nategroup.medicationScanner.medication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MedicationController {
    @Autowired
    private final MedicationService medicationService;
    MedicationController(MedicationService medicationService){
        this.medicationService = medicationService;
    }
    @GetMapping("/getMedication/{medicationId}")
    public ResponseEntity<Medication> getMedication(@RequestParam Long medicationId){
        Medication medication = medicationService.getMedicine(medicationId);
        if (medication == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(medication);
    }
    @GetMapping("/getAllMedications")
    public ResponseEntity<List<Medication>> getMedication(){
        Optional<List<Medication>> medicines = Optional.ofNullable(medicationService.getAllMedicine());
        if (medicines.isPresent()){
            List<Medication> medications= medicines.get();
            return ResponseEntity.ok(medications);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/scanBarcode")
    public ResponseEntity<Medication> ScanBarCode(@RequestParam Long medicationId) {
        Optional<Medication> medication = Optional.ofNullable(medicationService.HandleBarcodeScan(medicationId));
        if (medication.isPresent()) {
            return ResponseEntity.ok(medication.get());
        }
        return ResponseEntity.notFound().build();
    }
}
