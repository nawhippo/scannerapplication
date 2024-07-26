package nategroup.medicationScanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;


@SpringBootApplication
@ComponentScan(basePackages = {"nategroup.medicationScanner.User"})
public class MedicationScannerApplication {

	public static void main(String[] args) {
		SpringApplication.run(MedicationScannerApplication.class, args);
	}

}
