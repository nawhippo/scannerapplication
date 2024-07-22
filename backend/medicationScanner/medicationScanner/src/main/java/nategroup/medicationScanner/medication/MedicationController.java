package nategroup.medicationScanner.medication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import java.util.List;
import java.util.Optional;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class MedicationController {
    @Autowired
    private final MedicationService medicationService;

    MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/getMedication/{medicationId}")
    public Medication getMedication(@RequestParam Long medicationId) {
        Medication medication = medicationService.getMedicine(medicationId);
        return medication;
    }

    @GetMapping("/getAllMedications")
    public List<Medication> getMedication() {
        Optional<List<Medication>> medicines = Optional.ofNullable(medicationService.getAllMedicine());
        if (medicines.isPresent()) {
            List<Medication> medications = medicines.get();
            return medications;
        } else {
            return null;
        }
    }

    @PutMapping("/scanBarcode")
    public Medication ScanBarCode(@RequestParam Long medicationId, @RequestParam Optional<Integer> quantity) {
        Optional<Medication> medication = Optional.ofNullable(medicationService.HandleBarcodeScan(medicationId, quantity));
        if (medication.isPresent()) {
            return medicationService.HandleBarcodeScan(medicationId, quantity);
        }
        return null;
    }

    @PostMapping("/createMedication")
    public Medication createNewMedication(@RequestParam Medication medication){
        return medicationService.addMedicine(medication);
    }
}
