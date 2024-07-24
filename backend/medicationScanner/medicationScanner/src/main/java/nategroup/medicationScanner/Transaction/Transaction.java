package nategroup.medicationScanner.Transaction;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String itemName;

    @Column
    private String createdBy;

    @Column
    private LocalDateTime createdDate;

    @Column
    private Integer alteration;

    public Transaction(String itemName, String createdBy, LocalDateTime createdDate, Integer alteration){
        this.itemName = itemName;
        this.createdBy = createdBy;
        this.createdDate = createdDate;
        this.alteration = alteration;
    }

}
