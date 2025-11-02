"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowDownCircle, ArrowUpCircle, Plus, Landmark } from "lucide-react";
import type { Transaction } from "@/lib/types";

const initialTransactions: Transaction[] = [
  { id: "1", date: "2024-07-20", description: "Salary", category: "income", amount: 150000 },
  { id: "2", date: "2024-07-20", description: "Tithe", category: "tithe", amount: -15000 },
  { id: "3", date: "2024-07-19", description: "Groceries", category: "expense", amount: -4500 },
  { id: "4", date: "2024-07-18", description: "Freelance Project", category: "income", amount: 25000 },
  { id: "5", date: "2024-07-17", description: "Rent", category: "expense", amount: -40000 },
];

export default function FinancesPage() {
  const [transactions, setTransactions] = useState(initialTransactions);

  const totalIncome = transactions
    .filter((t) => t.category === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.category === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const totalTithe = transactions
    .filter((t) => t.category === "tithe")
    .reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome + totalExpenses + totalTithe;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Finance Tracker"
        description="A light ledger for your income, expenses, and tithes."
      >
        <div className="flex gap-2">
            <Button variant="outline">
                <Landmark className="mr-2 h-4 w-4" /> Pay Tithe (M-Pesa)
            </Button>
            <Dialog>
            <DialogTrigger asChild>
                <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Transaction
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                <DialogTitle className="font-headline">New Transaction</DialogTitle>
                <DialogDescription>
                    Log a new income, expense, or tithe payment.
                </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" placeholder="e.g. Groceries" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="amount">Amount (Ksh)</Label>
                    <Input id="amount" type="number" placeholder="e.g. 5000" />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select>
                    <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="tithe">Tithe</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
                <DialogFooter>
                <Button type="submit">Save Transaction</Button>
                </DialogFooter>
            </DialogContent>
            </Dialog>
        </div>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {totalIncome.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Ksh {Math.abs(totalExpenses).toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Ksh {netBalance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount (Ksh)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant={t.category === 'income' ? 'default' : t.category === 'tithe' ? 'secondary' : 'destructive'} className="capitalize">
                      {t.category}
                    </Badge>
                  </TableCell>
                  <TableCell className={`text-right font-semibold ${t.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {t.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
