package nategroup.medicationScanner.medication;

import nategroup.medicationScanner.Transaction.Transaction;
import nategroup.medicationScanner.Transaction.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;

@Service
public class MedicationService {
    @Autowired
    private final MedicationRepository medicationRepository;
    @Autowired
    private final TransactionRepository transactionRepository;



    MedicationService(MedicationRepository medicationRepository, TransactionRepository transactionRepository){
        this.medicationRepository = medicationRepository;
        this.transactionRepository = transactionRepository;
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


    public Medication handleMedicationUpdate(Long medicationId, Integer quantity, String username) {
        Optional<Medication> optionalMedication = medicationRepository.findById(medicationId);
        if (optionalMedication.isPresent()) {
            Medication medication = optionalMedication.get();
            medication.setSupply(medication.getSupply() + quantity);
            Transaction transaction = new Transaction(medication.getName(), username, LocalDateTime.now(), quantity);
            transactionRepository.save(transaction);
            return medicationRepository.save(medication);
        }
        return null;
    }
}
