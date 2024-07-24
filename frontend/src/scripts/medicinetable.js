import axios from 'axios';

document.addEventListener("DOMContentLoaded", function() {
    fetchandrendertable();
});


function fetchandrendertable(){
axios.get("/getAllMedications")
.then(response => {
	const table = document.getElementById("medicationTable");
	response.data.forEach(element => {
		row = document.createElement("tr");

		cellId = document.createElement("td");
		cellId.textContent = element.id;
		row.append(cellId);

		cellItemName = document.createElement("td");
		cell.textContent = element.itemName
		row.append(cellItemName);

		cellCreatedBy = document.createElement("td");
		cell.textContent = element.createdBy;
		row.append(createdBy);

		cellCreatedDate = document.createElement("td");
		cell.textContent = element.createdDate;
		row.append(cellCreatedDate);

		
		table.append(row);
	});
})
	.catch(error => {
	console.log("error rendering medication table : ", error);
	});
}
