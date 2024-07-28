import React, { useEffect, useState } from "react";
import axios from "axios"; 
const url = "http:/localhost:8080/";

const MedicationTable = () => {
    const [tableData, setTableData] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMedicationData = () => {
            axios.get(`${url}/getAllMedications`)
                .then(response => setTableData(response.data))
                .catch(error => setError(error.message));
        };
        fetchMedicationData();
    }, []);

    return (
        <div>
            {tableData ? (
                <ul>
                    {tableData.map(drug => (
                        <li key={drug.id}>
                            {drug.id} - {drug.name} - {drug.supply}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No table data found yet.</p>
            )}
            {error & <p>{error}</p>}
        </div>
    );
};

export default MedicationTable;