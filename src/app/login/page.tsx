
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PillarLogo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});

type AuthAction = 'signin' | 'signup';

export default function LoginPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthAction>('signin');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    try {
      if (activeTab === 'signin') {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        toast({ title: 'Successfully signed in!' });
      } else {
        await createUserWithEmailAndPassword(
          auth,
          values.email,
          values.password
        );
        toast({
          title: 'Account Created!',
          description: "Welcome to Pillar. Let's get you started.",
        });
      }
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Authentication error:', error);
      let description = 'An error occurred. Please check your credentials and try again.';
      if (error.code === 'auth/user-not-found' && activeTab === 'signin') {
        description = 'No account found with this email. Try signing up instead.';
      } else if (error.code === 'auth/email-already-in-use' && activeTab === 'signup') {
        description = 'An account with this email already exists. Try signing in.';
      } else if (error.code === 'auth/wrong-password') {
        description = 'Incorrect password. Please try again.';
      }
      
      toast({
        title: 'Authentication Failed',
        description,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/20 px-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center mb-6">
          <Link href="/" className="flex items-center gap-2">
            <PillarLogo className="w-10 h-10 text-primary" />
            <span className="font-headline text-3xl font-bold">Pillar</span>
          </Link>
        </div>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AuthAction)} className="w-full">
          <Card>
            <CardHeader className="text-center">
                <TabsList className="grid w-full grid-cols-2 mx-auto max-w-sm">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>
            </CardHeader>
            <CardContent>
              <TabsContent value="signin">
                <div className='text-center mb-4'>
                    <CardTitle className="font-headline text-2xl">Welcome Back</CardTitle>
                    <CardDescription>Enter your credentials to access your account.</CardDescription>
                </div>
                <AuthForm isSubmitting={isSubmitting} form={form} onSubmit={onSubmit} buttonText='Sign In' />
              </TabsContent>
              <TabsContent value="signup">
                <div className='text-center mb-4'>
                    <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
                    <CardDescription>Enter your email and password to get started.</CardDescription>
                </div>
                <AuthForm isSubmitting={isSubmitting} form={form} onSubmit={onSubmit} buttonText='Create Account' />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </div>
  );
}

// Reusable Auth Form Component
function AuthForm({ isSubmitting, form, onSubmit, buttonText }: { isSubmitting: boolean; form: any; onSubmit: any; buttonText: string }) {
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {buttonText}
        </Button>
      </form>
    </Form>
  );
}
