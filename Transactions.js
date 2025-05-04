// Frontend: client/src/components/Transactions.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/transactions', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (error) {
        console.error('Error fetching transactions', error);
      }
    };
    
    fetchTransactions();
  }, []);

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((txn) => (
          <li key={txn._id}>
            {txn.type.toUpperCase()}: {txn.category} - ${txn.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Transactions;
