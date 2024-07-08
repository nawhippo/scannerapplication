import axios from 'axios';
function fetchandrendertable(){
axios.get("./medication")
.then(response => {
	const table = document.getElementById("medicationTable")
	response.data.forEach(element => {
		row = document.createElement("tr")
		cell = document.createElement("td");
		cell.textContent = element
		row.appendChild(cell)
		table.append(row)
	});
})
	.catch(error => {
	console.log("error rendering medication table");
	});
}
