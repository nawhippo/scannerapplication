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

		cellName = document.createElement("td");
		cell.textContent = element.name
		row.append(cellName);

		cellQuantity = document.createElement("td");
		cell.textContent = element.supply;
		row.append(cellQuantity);

		table.append(row);
	});
})
	.catch(error => {
	console.log("error rendering medication table : ", error);
	});
}
