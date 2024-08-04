import { useEffect, useState } from "react";
import React from 'react';
import axios from 'axios';
import {Navbar, NavItem, Row, Col} from 'react-bootstrap';
const TransactionTable = () => {
    const [transactionData, setTransactionData] = useState([]);
    const [error, setError] = useState('')


    useEffect(() => {
    const getTransactionTable = () => {
        axios.get(`/api/transactions`)
        .then(response => {
            setTransactionData(response.data)
        }
        )
        .catch(error => {
            setError(error);
        })
        }
    })
        return (
            <>
            <h1>Transaction Table</h1>
            {transactionData.length > 0 ? (
            <ul>
            {transactionData.map(transaction => (
                <li key={transaction.id}>
                    <Row>
<Col sm>
    {transaction.id}
</Col>
<Col sm>
    {transaction.createdDate} 
</Col>
<Col sm>
 {transaction.itemName}
 </Col>
 <Col sm>
{transaction.alteration}
  </Col>
 <Col sm>
{transaction.createdBy}
 </Col>
                  </Row>
                   </li>
            ))}
            </ul>
            ) : <p>No Transactions Found</p>}
            {error ? (
            <p>
                {error}
            </p>
            )
            : null}
            </>
        )
    }

    export default TransactionTable;