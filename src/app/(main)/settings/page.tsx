
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/page-header";
import { Switch } from "@/components/ui/switch";
import { useUser, useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking, useAuth } from "@/firebase";
import type { UserProfile } from "@/lib/types";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { deleteUserAccount } from "./actions";
import { useRouter } from "next/navigation";

interface ProfileForm {
  name: string;
}

export default function SettingsPage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const userProfileRef = useMemoFirebase(() => user ? doc(firestore, 'userProfiles', user.uid) : null, [user, firestore]);
  const { data: userProfile, isLoading: isUserProfileLoading } = useDoc<UserProfile>(userProfileRef);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProfileForm>();

  useEffect(() => {
    if (userProfile) {
      reset({ name: userProfile.name });
    }
  }, [userProfile, reset]);

  const handleUpdateProfile = (data: ProfileForm) => {
    if (!userProfileRef) return;
    updateDocumentNonBlocking(userProfileRef, { name: data.name });
    toast({
      title: "Profile Updated",
      description: "Your name has been successfully updated.",
    });
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
        await deleteUserAccount(user.uid, userProfile?.onboardingDataId);
        toast({
            title: "Account Deleted",
            description: "Your account and all associated data have been permanently deleted.",
        });
        await auth.signOut();
        router.push('/');
    } catch (error) {
        console.error("Failed to delete account:", error);
        toast({
            title: "Error",
            description: "Could not delete your account. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsDeleting(false);
    }
  }

  const isLoading = isUserLoading || isUserProfileLoading;

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences."
      />
      <div className="grid gap-8">
        <Card>
          <form onSubmit={handleSubmit(handleUpdateProfile)}>
            <CardHeader>
              <CardTitle className="font-headline">Profile</CardTitle>
              <CardDescription>
                This is how others will see you on the site.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" {...register("name", { required: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={userProfile?.email || ''} readOnly disabled />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading || isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Profile
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Notifications</CardTitle>
            <CardDescription>
              Configure how you receive notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="reminders" className="font-medium">Habit Reminders</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications to complete your habits.</p>
                </div>
              <Switch id="reminders" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="weekly-summary" className="font-medium">Weekly Summary</Label>
                    <p className="text-sm text-muted-foreground">Get a weekly email with your progress summary.</p>
                </div>
              <Switch id="weekly-summary" defaultChecked />
            </div>
             <div className="flex items-center justify-between">
                <div>
                    <Label htmlFor="partner-updates" className="font-medium">Partner Updates</Label>
                    <p className="text-sm text-muted-foreground">Notify me when an accountability partner checks my report.</p>
                </div>
              <Switch id="partner-updates" />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Preferences</Button>
          </CardFooter>
        </Card>

        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="font-headline text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              These actions are irreversible. Please be certain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isDeleting}>
                    {isDeleting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete Account
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                    Yes, delete my account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
