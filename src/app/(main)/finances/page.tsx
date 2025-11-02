
"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { useFirestore, useUser, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";

export default function FinancesPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const financeCollection = useMemoFirebase(() => {
    if (!user) return null;
    return query(collection(firestore, "users", user.uid, "financeRecords"), orderBy("date", "desc"));
  }, [firestore, user]);

  const { data: transactions, isLoading: areTransactionsLoading } = useCollection<Transaction>(financeCollection);
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { control, handleSubmit, register, reset } = useForm<Omit<Transaction, 'id'>>();

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    if (!financeCollection) return;
    const amount = parseFloat(String(data.amount));
    const newTransaction = {
      ...data,
      amount: data.type === 'income' ? Math.abs(amount) : -Math.abs(amount),
      date: new Date().toISOString(),
    };
    addDocumentNonBlocking(collection(firestore, "users", user!.uid, "financeRecords"), newTransaction);
    reset({ description: "", amount: 0, type: undefined });
    setIsDialogOpen(false);
  };

  const isLoading = isUserLoading || areTransactionsLoading;

  const totalIncome = transactions?.filter((t) => t.type === "income").reduce((acc, t) => acc + t.amount, 0) ?? 0;
  const totalExpenses = transactions?.filter((t) => t.type === "expense").reduce((acc, t) => acc + t.amount, 0) ?? 0;
  const totalTithe = transactions?.filter((t) => t.type === "tithe").reduce((acc, t) => acc + t.amount, 0) ?? 0;
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
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
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
                <form onSubmit={handleSubmit(handleAddTransaction)}>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" placeholder="e.g. Groceries" {...register("description", { required: true })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="amount">Amount (Ksh)</Label>
                        <Input id="amount" type="number" placeholder="e.g. 5000" {...register("amount", { required: true, valueAsNumber: true })} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Category</Label>
                        <Controller
                          name="type"
                          control={control}
                          rules={{ required: true }}
                          render={({ field }) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <SelectTrigger id="type">
                                  <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="income">Income</SelectItem>
                                  <SelectItem value="expense">Expense</SelectItem>
                                  <SelectItem value="tithe">Tithe</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save Transaction</Button>
                  </DialogFooter>
                </form>
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
            {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">Ksh {totalIncome.toLocaleString()}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className="text-2xl font-bold">Ksh {Math.abs(totalExpenses).toLocaleString()}</div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {isLoading ? <Skeleton className="h-8 w-3/4" /> : <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Ksh {netBalance.toLocaleString()}
            </div>}
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
              {isLoading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-24"/></TableCell>
                  <TableCell><Skeleton className="h-5 w-32"/></TableCell>
                  <TableCell><Skeleton className="h-6 w-20 rounded-full"/></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto"/></TableCell>
                </TableRow>
              ))}
              {!isLoading && transactions?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">{t.description}</TableCell>
                  <TableCell>
                    <Badge variant={t.type === 'income' ? 'default' : t.type === 'tithe' ? 'secondary' : 'destructive'} className="capitalize">
                      {t.type}
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
