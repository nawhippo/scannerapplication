package nategroup.medicationScanner.Transaction;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<Transaction> getAllTransactions() {
        return transactionService.getAllTransactions();
    }

    @GetMapping("/createdBy/{createdBy}")
    public List<Transaction> getTransactionsByCreatedBy(@PathVariable String createdBy) {
        return transactionService.getTransactionsByCreatedBy(createdBy);
    }
}