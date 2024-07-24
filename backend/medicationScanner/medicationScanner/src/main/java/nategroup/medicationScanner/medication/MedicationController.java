package nategroup.medicationScanner.medication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@Controller
public class MedicationController {
    @Autowired
    private final MedicationService medicationService;

    MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping("/getMedication/{medicationId}")
    public Medication getMedication(@RequestParam Long medicationId) {
        return medicationService.getMedicine(medicationId);
    }

    @GetMapping("/getAllMedications")
    public List<Medication> getAllMedications() {
        return medicationService.getAllMedicine();
    }

    //TODO: connect user class all together.
    @PutMapping("/alterMedication")
    public Medication alterMedication(@RequestParam Long medicationId, @RequestParam Integer quantity, @RequestParam String username) {
        return medicationService.handleMedicationUpdate(medicationId, quantity, username);
    }

    @PostMapping("/createMedication")
    public Medication createNewMedication(@RequestBody Medication medication) {
        return medicationService.addMedicine(medication);
    }
}