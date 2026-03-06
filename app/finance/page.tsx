'use client';

import { useState, useEffect } from 'react';
import ClientNavbar from '../components/ClientNavbar';

interface Transaction {
  id: number;
  type: 'DEPOSIT' | 'TRANSFER_OUT' | 'TRANSFER_IN';
  amount: number;
  createdAt: string;
}

interface BalanceData {
  balance: number;
  name: string;
}

export default function FinancePage() {
  const [balance, setBalance] = useState<number>(0);
  const [name, setName] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [depositLoading, setDepositLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const fetchBalance = async () => {
    try {
      const response = await fetch('/api/finance/balance');
      if (response.ok) {
        const data: BalanceData = await response.json();
        setBalance(Number(data.balance));
        setName(data.name);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/finance/transactions');
      if (response.ok) {
        const data = await response.json();
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!depositAmount || Number(depositAmount) <= 0) {
      setMessage('Please enter a valid amount');
      setMessageType('error');
      return;
    }

    setDepositLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/finance/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: Number(depositAmount) }),
      });

      const data = await response.json();

      if (response.ok) {
        setBalance(Number(data.newBalance));
        setDepositAmount('');
        setMessage('Deposit successful!');
        setMessageType('success');
        fetchTransactions();
        window.dispatchEvent(new Event('auth-change'));
      } else {
        setMessage(data.error || 'Deposit failed');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Deposit error:', error);
      setMessage('An error occurred during deposit');
      setMessageType('error');
    } finally {
      setDepositLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', {
      style: 'currency',
      currency: 'THB',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return 'Deposit';
      case 'TRANSFER_OUT':
        return 'Transfer Out';
      case 'TRANSFER_IN':
        return 'Transfer In';
      default:
        return type;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
      case 'TRANSFER_IN':
        return 'text-green-600';
      case 'TRANSFER_OUT':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <ClientNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <ClientNavbar />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finance</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Section */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-900 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Current Balance</h2>
              <div className="text-3xl font-bold text-[#C9A84C] mb-2">
                {formatCurrency(balance)}
              </div>
              <div className="text-gray-400 font-bold">Account: {name}</div>
            </div>

            {/* Deposit Form */}
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Top Up</h2>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Amount (THB)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg focus:outline-none focus:border-[#C9A84C] text-white"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="w-full bg-[#C9A84C] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#B09042] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading ? 'Processing...' : 'Top Up'}
                </button>
              </form>
              
              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  messageType === 'success' 
                    ? 'bg-green-900 text-green-200' 
                    : 'bg-red-900 text-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-neutral-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
              
              {transactions.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  No transaction history
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-neutral-800 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">
                          {getTransactionTypeLabel(transaction.type)}
                        </div>
                        <div className="text-sm text-neutral-400">
                          {formatDate(transaction.createdAt)}
                        </div>
                      </div>
                      <div className={`text-lg font-semibold ${getTransactionColor(transaction.type)}`}>
                        {transaction.type === 'TRANSFER_OUT' ? '-' : '+'}
                        {formatCurrency(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}