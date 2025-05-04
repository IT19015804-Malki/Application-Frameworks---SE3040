import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './AddTransaction.css'; // Add your custom CSS file

const AddTransaction = ({ onTransactionAdded }) => {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [category, setCategory] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/transactions/add',
        { amount: parseFloat(amount), type, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage('✅ Transaction added successfully!');
      setAmount('');
      setCategory('');
      setType('income');
      if (onTransactionAdded) onTransactionAdded();
    } catch (err) {
      console.error('Error adding transaction:', err.response?.data || err.message);
      setMessage('❌ Failed to add transaction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-container">
      {/* Banner Image */}
      <div className="banner-container">
        <img 
          src="https://cdn-icons-png.freepik.com/256/3029/3029373.png" 
          alt="Add Transaction Banner" 
          className="add-transaction-banner" 
        />
      </div>

      <div className="form-container">
        <h3>Add a New Transaction</h3>
        <form onSubmit={handleSubmit} className="transaction-form">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="input-field"
          />
          <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="text"
            placeholder="Category (e.g. Salary, Food, Rent)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="input-field"
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Adding...' : 'Add Transaction'}
          </button>
        </form>

        {message && <p className="response-message">{message}</p>}

        {/* Back to Dashboard Button */}
        <button
          className="back-to-dashboard-btn"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddTransaction;
