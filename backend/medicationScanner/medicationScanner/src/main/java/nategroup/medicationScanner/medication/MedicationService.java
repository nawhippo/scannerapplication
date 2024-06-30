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
    public Medication AlterMedicine(long medicineId, int alteration){
        Optional<Medication> medication = medicationRepository.findById(medicineId);
        if (medication.isPresent()) {
            Medication medication1 = medication.get();
            medication1.setSupply(medication1.getSupply() + alteration);
            medicationRepository.save(medication1);
            return medication1;
        }
        return null;
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
}
