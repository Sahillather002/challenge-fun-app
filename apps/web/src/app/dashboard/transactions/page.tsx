'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, TrendingUp, TrendingDown, Download, Filter, DollarSign, Calendar } from 'lucide-react';

type Transaction = {
  id: string;
  type: 'entry_fee' | 'prize' | 'refund' | 'withdrawal';
  amount: number;
  description: string;
  competition?: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
};

const mockTransactions: Transaction[] = [
  {
    id: '1',
    type: 'prize',
    amount: 250,
    description: 'Prize winnings',
    competition: '30-Day Step Challenge',
    date: '2024-10-15',
    status: 'completed',
  },
  {
    id: '2',
    type: 'entry_fee',
    amount: -25,
    description: 'Competition entry fee',
    competition: 'Weekend Warriors',
    date: '2024-10-12',
    status: 'completed',
  },
  {
    id: '3',
    type: 'entry_fee',
    amount: -30,
    description: 'Competition entry fee',
    competition: 'Calorie Crusher October',
    date: '2024-10-01',
    status: 'completed',
  },
  {
    id: '4',
    type: 'prize',
    amount: 100,
    description: 'Prize winnings - 3rd place',
    competition: 'September Sprint',
    date: '2024-09-30',
    status: 'completed',
  },
  {
    id: '5',
    type: 'withdrawal',
    amount: -150,
    description: 'Bank withdrawal',
    date: '2024-09-28',
    status: 'completed',
  },
  {
    id: '6',
    type: 'entry_fee',
    amount: -20,
    description: 'Competition entry fee',
    competition: 'Distance Dominator',
    date: '2024-09-15',
    status: 'completed',
  },
  {
    id: '7',
    type: 'prize',
    amount: 500,
    description: 'Prize winnings - 1st place 🏆',
    competition: 'Summer Challenge',
    date: '2024-08-31',
    status: 'completed',
  },
  {
    id: '8',
    type: 'refund',
    amount: 25,
    description: 'Competition cancelled - refund',
    competition: 'August Marathon',
    date: '2024-08-20',
    status: 'completed',
  },
];

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'entry_fee' | 'prize' | 'withdrawal'>('all');

  const filteredTransactions = filter === 'all' 
    ? mockTransactions 
    : mockTransactions.filter(t => t.type === filter);

  const totalEarnings = mockTransactions
    .filter(t => t.type === 'prize')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = mockTransactions
    .filter(t => t.type === 'entry_fee')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalEarnings - totalSpent;

  const typeIcons = {
    entry_fee: <TrendingDown className="h-5 w-5 text-red-500" />,
    prize: <TrendingUp className="h-5 w-5 text-green-500" />,
    refund: <TrendingUp className="h-5 w-5 text-blue-500" />,
    withdrawal: <TrendingDown className="h-5 w-5 text-orange-500" />,
  };

  const typeLabels = {
    entry_fee: 'Entry Fee',
    prize: 'Prize',
    refund: 'Refund',
    withdrawal: 'Withdrawal',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-muted-foreground">
            View your payment history and earnings
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Net earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${totalEarnings.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From prizes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${totalSpent.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Entry fees
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTransactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Filter:</span>
        <div className="flex gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'prize' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('prize')}
          >
            Prizes
          </Button>
          <Button
            variant={filter === 'entry_fee' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('entry_fee')}
          >
            Entry Fees
          </Button>
          <Button
            variant={filter === 'withdrawal' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('withdrawal')}
          >
            Withdrawals
          </Button>
        </div>
      </div>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Your complete payment history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-2 rounded-full bg-background">
                    {typeIcons[transaction.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{transaction.description}</p>
                      {transaction.status === 'pending' && (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">
                          Pending
                        </span>
                      )}
                      {transaction.status === 'failed' && (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          Failed
                        </span>
                      )}
                    </div>
                    {transaction.competition && (
                      <p className="text-sm text-muted-foreground">
                        {transaction.competition}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(transaction.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {typeLabels[transaction.type]}
                  </p>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No transactions found</h3>
                <p className="text-muted-foreground mb-4">
                  Try changing your filter
                </p>
                <Button onClick={() => setFilter('all')} variant="outline">
                  Show All Transactions
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Methods
          </CardTitle>
          <CardDescription>
            Manage your payment methods for competitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 rounded">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold">•••• •••• •••• 4242</p>
                  <p className="text-sm text-muted-foreground">Expires 12/25</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              + Add Payment Method
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
