document.addEventListener("DOMContentLoaded", getTransactions);

getTransactions = () => { 
    axios.get("/api/getAllTransactions")
    .then(response => {
        response.forEach(element => {
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
        })
    }
    )
    }