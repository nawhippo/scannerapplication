package nategroup.medicationScanner.medication;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Service
public class MedicationService {
    private final MedicationRepository medicationRepository;
    MedicationService(MedicationRepository medicationRepository){
        this.medicationRepository = medicationRepository;
    }



    public Medication getMedicine(Long medicineId){
        Optional<Medication> medication = medicationRepository.findById(medicineId);
        if (medication.isPresent()) {
            Medication medication1 = medication.get();
            return medication1;
        }
        return null;
    }

    public Medication addMedicine(Medication medication) {
        return medicationRepository.save(medication);
    }
    public Medication removeMedicine(Long medicineId) {
        Optional<Medication> medication = medicationRepository.findById(medicineId);
        if (medication.isPresent()) {
            Medication medication1 = medication.get();
            medicationRepository.delete(medication1);
            return medication1;
        }
        return null;
    }

    public ArrayList<Medication> getAllMedicine(){
        return (ArrayList<Medication>) medicationRepository.findAll();
    }


    public Medication handleMedicationUpdate(Long medicationId, Integer quantity) {
        Optional<Medication> optionalMedication = medicationRepository.findById(medicationId);
        if (optionalMedication.isPresent()) {
            Medication medication = optionalMedication.get();
            medication.setSupply(medication.getSupply() + quantity);
            return medicationRepository.save(medication);
        }
        return null;
    }
}
