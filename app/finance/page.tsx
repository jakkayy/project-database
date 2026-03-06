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
      <div className="min-h-screen bg-gray-50">
        <ClientNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ClientNavbar />

      <div className="max-w-6xl mx-auto px-10 py-10">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Balance</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Balance Section */}
          <div className="lg:col-span-1 space-y-5">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-500 mb-3">Current Balance</p>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {formatCurrency(balance)}
              </div>
              <div className="text-sm text-gray-400">Account: {name}</div>
            </div>

            {/* Deposit Form */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Top Up</h2>
              <form onSubmit={handleDeposit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Amount (THB)
                  </label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-green-500 focus:bg-white focus:ring-1 focus:ring-green-500"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={depositLoading}
                  className="w-full bg-green-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {depositLoading ? 'Processing...' : 'Top Up'}
                </button>
              </form>

              {message && (
                <div className={`mt-4 p-3 rounded-lg text-sm ${
                  messageType === 'success'
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Transaction History</h2>

              {transactions.length === 0 ? (
                <div className="text-center py-12 text-gray-400 text-sm">
                  No transaction history
                </div>
              ) : (
                <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 items-center justify-center rounded-full ${
                          transaction.type === 'TRANSFER_OUT'
                            ? 'bg-red-100 text-red-500'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {transaction.type === 'TRANSFER_OUT' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5 12 21m0 0-7.5-7.5M12 21V3" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {getTransactionTypeLabel(transaction.type)}
                          </div>
                          <div className="text-xs text-gray-400">
                            {formatDate(transaction.createdAt)}
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-bold ${getTransactionColor(transaction.type)}`}>
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